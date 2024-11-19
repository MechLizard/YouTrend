const oracledb = require('oracledb');

// *=== Time/Day Success ===* //
async function fetchTimeDaySuccess({ country, categoryId, startDate, endDate, tag }) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        let time_day_sql = `
            SELECT 
                unique_video.publish_date, 
                unique_video.published_day_of_week, 
                SUM(unique_video.views) AS views,
                SUM(unique_video.likes) AS likes, 
                SUM(unique_video.dislikes) AS dislikes, 
                SUM(unique_video.comment_count) AS comment_count,
                MAX(best_daily.top_video_id) AS top_video_id,
                MAX(best_daily.top_video_title) AS top_video_title,
                MAX(best_daily.top_video_views) AS top_video_views,
                MAX(best_daily.top_video_likes) AS top_video_likes,
                MAX(best_daily.top_video_dislikes) AS top_video_dislikes
            FROM (
                SELECT publish_date, published_day_of_week, views, likes, dislikes, comment_count,
                       ROW_NUMBER() OVER (PARTITION BY video.video_id ORDER BY views DESC) AS rn
                FROM Video
                ${tag ? 'JOIN tag_association ON video.video_id = tag_association.video_id' : ''} 
                WHERE (publish_country LIKE :country OR :country = '%')
                  AND (category_id = :category_id OR :category_id IS NULL)
                  AND publish_date BETWEEN TO_DATE(:start_date, 'DD-MM-YY') AND TO_DATE(:end_date, 'DD-MM-YY')
                  ${tag ? 'AND tag_association.tag_string LIKE :tag' : ''} 
            ) unique_video
            JOIN (
                SELECT publish_date AS top_video_publish_date, 
                       video_id AS top_video_id,
                       title AS top_video_title,
                       views AS top_video_views,
                       likes AS top_video_likes,
                       dislikes AS top_video_dislikes
                FROM (
                    SELECT publish_date, video.video_id, title, views, likes, dislikes,
                           ROW_NUMBER() OVER (PARTITION BY publish_date ORDER BY views DESC) AS day_rank
                    FROM Video
                    ${tag ? 'JOIN tag_association ON video.video_id = tag_association.video_id' : ''} 
                    WHERE (publish_country LIKE :country OR :country = '%')
                      AND (category_id = :category_id OR :category_id IS NULL)
                      AND publish_date BETWEEN TO_DATE(:start_date, 'DD-MM-YY') AND TO_DATE(:end_date, 'DD-MM-YY')
                      ${tag ? 'AND tag_association.tag_string LIKE :tag' : ''} 
                )
                WHERE day_rank = 1
            ) best_daily 
            ON unique_video.publish_date = top_video_publish_date
            WHERE rn = 1
            GROUP BY unique_video.publish_date, unique_video.published_day_of_week
            ORDER BY unique_video.publish_date
        `;


      const attributes = {
        country: country || '%',
        category_id: categoryId || null,
        start_date: startDate || '14-11-17',
        end_date: endDate || '14-06-18'
      };

      if (tag) {
        attributes.tag = `%${tag}%`;
      }

      const result = await connection.execute(time_day_sql, attributes);
      return result.rows;

    } catch (err) {
        console.error("Error executing 'Time/Day Success' query:", err);
        throw err;
    }
};

// *=== Disabled Videos ===* //
async function fetchDisabledVideos({
  country, 
  categoryId, 
  startDate, 
  endDate, 
  tag, 
  commentsDisabled = false, 
  ratingsDisabled = false, 
  videoRemoved = false 
}) {
  let connection;
  try {
      connection = await oracledb.getConnection();
      connection.outFormat = oracledb.OUT_FORMAT_OBJECT; // for json output to include names of cols

      let baseSelect = `
          SELECT trending_date, 
                 COUNT(CASE WHEN comments_disabled = 'True' THEN 1 END) AS comments_disabled_count,
                 COUNT(CASE WHEN ratings_disabled = 'True' THEN 1 END) AS ratings_disabled_count,
                 COUNT(CASE WHEN video_error_or_removed = 'True' THEN 1 END) AS video_removed_count
      `;
      let baseConditions = `
          WHERE (publish_country LIKE :country OR :country = '%')
          AND (category_id = :category_id OR :category_id IS NULL)
          AND trending_date BETWEEN TO_DATE(:start_date, 'DD-MM-YY') AND TO_DATE(:end_date, 'DD-MM-YY')
      `;

      const attributes = {
          country: country || '%',
          category_id: categoryId || null,
          start_date: startDate || '14-11-17',
          end_date: endDate || '14-06-18',
      };

      if (commentsDisabled) {
          baseConditions += ` AND comments_disabled = :comments_disabled`;
          attributes.comments_disabled = 'True';
      }

      if (ratingsDisabled) {
          baseConditions += ` AND ratings_disabled = :ratings_disabled`;
          attributes.ratings_disabled = 'True';
      }

      if (videoRemoved) {
          baseConditions += ` AND video_error_or_removed = :video_removed`;
          attributes.video_removed = 'True';
      }

      let joinTagTable = '';
      if (tag) {
          joinTagTable = `JOIN tag_association ON video.video_id = tag_association.video_id`;
          baseConditions += ` AND tag_association.tag_string LIKE :tag`;
          attributes.tag = `%${tag}%`;
      }

      const disabled_videos_sql = `
          ${baseSelect}
          FROM (
              SELECT trending_date, comments_disabled, ratings_disabled, video_error_or_removed,
                     ROW_NUMBER() OVER (PARTITION BY video.video_id ORDER BY views DESC) AS rn
              FROM Video
              ${joinTagTable}
              ${baseConditions}
          )
          WHERE rn = 1
          GROUP BY trending_date
          ORDER BY trending_date
      `;

      const result = await connection.execute(disabled_videos_sql, attributes);
      return result.rows;

  } catch (err) {
      console.error("Error executing 'Disabled Videos' query:", err);
      throw err;
  }
};

// *=== Events ===* //
async function fetchTrendingData({ country, categoryId, startDate, endDate, tag }) {
  let connection;
  try {
    connection = await oracledb.getConnection();

    let baseSelect = `
    SELECT trending_date, SUM(views) AS views
  `;
  let baseConditions = `
    WHERE (publish_country LIKE :country OR :country = '%')
    AND (category_id = :category_id OR :category_id IS NULL)
    AND trending_date BETWEEN TO_DATE(:start_date, 'DD-MM-YY') AND TO_DATE(:end_date, 'DD-MM-YY')
  `;
  
  const attributes = {
    country: country || '%',
    category_id: categoryId || null,
    start_date: startDate || '14-11-17',
    end_date: endDate || '14-06-18'
  };

  let joinTagTable = '';
  if (tag) {
    joinTagTable = `JOIN tag_association ON video.video_id = tag_association.video_id`;
    baseConditions += ` AND tag_association.tag_string LIKE :tag`;
    attributes.tag = tag;
  }

  // Full SQL query
  const trending_data_sql = `
    ${baseSelect}
    FROM (
      SELECT trending_date, views,
             ROW_NUMBER() OVER (PARTITION BY video.video_id ORDER BY views DESC) AS rn
      FROM Video
      ${joinTagTable}
      ${baseConditions}
    )
    WHERE rn = 1
    GROUP BY trending_date
    ORDER BY trending_date
  `;

  const result = await connection.execute(trending_data_sql, attributes);
  return result.rows;

  } catch (err) {
    console.error("Error executing 'Trending Data' query:", err);
    throw err;
  }
}

async function fetchEventInfo(eventName) {
  let connection;
  try {
    connection = await oracledb.getConnection();

    const event_info_sql = `
      SELECT event_name, event_description, event_date
      FROM events
      WHERE event_name = :event
    `;

    const attributes = { event: eventName };
    const result = await connection.execute(event_info_sql, attributes);
    return result.rows;
  } catch (err) {
    console.error("Error executing 'Event Info' query:", err);
    throw err;
  }
}

// *=== Popularity ===* //
async function fetchPopularityData({ country, categoryId, startDate, endDate, tag }) {
  let connection;
  try {
    connection = await oracledb.getConnection();

    let baseSelect = `
      SELECT trending_date, SUM(views) AS views, SUM(likes) AS likes, SUM(dislikes) AS dislikes, SUM(comment_count) AS comments
    `;
    let baseConditions = `
      WHERE (publish_country LIKE :country OR :country = '%')
      AND (category_id = :category_id OR :category_id IS NULL)
      AND trending_date BETWEEN TO_DATE(:start_date, 'DD-MM-YY') AND TO_DATE(:end_date, 'DD-MM-YY')
    `;

    const attributes = {
      country: country || '%',
      category_id: categoryId || null,
      start_date: startDate || '14-11-17',
      end_date: endDate || '14-06-18'
    };

    let joinTagTable = '';
    if (tag) {
      joinTagTable = `JOIN tag_association ON video.video_id = tag_association.video_id`;
      baseConditions += ` AND tag_association.tag_string LIKE :tag OR :tag = '%'`;
      attributes.tag = tag;
    }

    // Full SQL query for popularity
    const popularity_sql = `
      ${baseSelect}
      FROM (
        SELECT trending_date, views, likes, dislikes, comment_count,
               ROW_NUMBER() OVER (PARTITION BY video.video_id ORDER BY views DESC) AS rn
        FROM Video
        ${joinTagTable}
        ${baseConditions}
      )
      WHERE rn = 1
      GROUP BY trending_date
      ORDER BY trending_date
    `;

    const result = await connection.execute(popularity_sql, attributes);
    return result.rows;
  } catch (err) {
    console.error("Error executing 'fetchPopularityData' query:", err);
    throw err;
  }
}

// *=== Sentiment ===* //
async function fetchSentimentData({ country, categoryId, startDate, endDate, tag }) {
  let connection;
  try {
    connection = await oracledb.getConnection();

    let baseSelect = `
      SELECT trending_date, AVG(likes) AS avg_likes, AVG(dislikes) AS avg_dislikes,
             AVG(CASE 
                 WHEN dislikes = 0 THEN likes / 1
                 ELSE likes / dislikes
             END) AS like_dislike_ratio
    `;
    let baseConditions = `
      WHERE (publish_country LIKE :country OR :country = '%')
      AND (category_id = :category_id OR :category_id IS NULL)
      AND trending_date BETWEEN TO_DATE(:start_date, 'DD-MM-YY') AND TO_DATE(:end_date, 'DD-MM-YY')
    `;

    const attributes = {
      country: country || '%',
      category_id: categoryId || null,
      start_date: startDate || '14-11-17',
      end_date: endDate || '14-06-18'
    };

    let joinTagTable = '';
    if (tag) {
      joinTagTable = `JOIN tag_association ON video.video_id = tag_association.video_id`;
      baseConditions += ` AND tag_association.tag_string LIKE :tag OR :tag = '%'`;
      attributes.tag = tag;
    }

    // Full SQL query for sentiment analysis
    const sentiment_sql = `
      ${baseSelect}
      FROM (
        SELECT trending_date, views, likes, dislikes,
               ROW_NUMBER() OVER (PARTITION BY video.video_id ORDER BY views DESC) AS rn
        FROM Video
        ${joinTagTable}
        ${baseConditions}
      )
      WHERE rn = 1
      GROUP BY trending_date
      ORDER BY trending_date
    `;

    const result = await connection.execute(sentiment_sql, attributes);
    return result.rows;
  } catch (err) {
    console.error("Error executing fetchSentimentData query:", err);
    throw err;
  }
}

module.exports = { fetchTimeDaySuccess, fetchDisabledVideos, fetchTrendingData, fetchEventInfo, fetchPopularityData, fetchSentimentData };