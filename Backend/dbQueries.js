const oracledb = require('oracledb');

// *=== Time/Day Success ===* //
async function fetchTimeDaySuccess({ country, categoryId, startDate, endDate, tag }) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        let time_day_sql = `
        SELECT publish_date, 
               published_day_of_week, 
               SUM(views) AS views, 
               SUM(likes) AS likes, 
               SUM(dislikes) AS dislikes, 
               SUM(comment_count) AS comment_count
        FROM (
            SELECT publish_date, published_day_of_week, views, likes, dislikes, comment_count,
                   ROW_NUMBER() OVER (PARTITION BY video.video_id ORDER BY views DESC) AS rn
            FROM Video
            ${tag ? 'JOIN tag_association ON video.video_id = tag_association.video_id' : ''} -- Only join if tag is specified
            WHERE (publish_country LIKE :country OR :country = '%')
            AND (category_id = :category_id OR :category_id IS NULL)
            AND publish_date BETWEEN TO_DATE(:start_date, 'DD-MM-YY') AND TO_DATE(:end_date, 'DD-MM-YY')
            ${tag ? 'AND tag_association.tag_string LIKE :tag' : ''} -- Only filter by tag if specified
        )
        WHERE rn = 1 -- Selects the first unique in each row in video_id
        GROUP BY publish_date, published_day_of_week
        ORDER BY publish_date
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

      let baseSelect = `
          SELECT trending_date
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
          comments_disabled: commentsDisabled ? 'True' : 'False',  // Default to 'False'
          ratings_disabled: ratingsDisabled ? 'True' : 'False',    // Default to 'False'
          video_removed: videoRemoved ? 'True' : 'False'           // Default to 'False'
      };

      // Conditional columns and filtering based on flags
      if (commentsDisabled) {
          baseSelect += `, COUNT(CASE WHEN comments_disabled = 'True' THEN 1 END) AS comments_disabled_count`;
          baseConditions += ` AND comments_disabled = 'True'`;
      }
      if (ratingsDisabled) {
          baseSelect += `, COUNT(CASE WHEN ratings_disabled = 'True' THEN 1 END) AS ratings_disabled_count`;
          baseConditions += ` AND ratings_disabled = 'True'`;
      }
      if (videoRemoved) {
          baseSelect += `, COUNT(CASE WHEN video_error_or_removed = 'True' THEN 1 END) AS video_removed_count`;
          baseConditions += ` AND video_error_or_removed = 'True'`;
      }

      let joinTagTable = '';
      if (tag) {
          joinTagTable = `JOIN tag_association ON video.video_id = tag_association.video_id`;
          baseConditions += ` AND tag_association.tag_string LIKE :tag`;
          attributes.tag = tag;
      }

      // Full query from above components
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