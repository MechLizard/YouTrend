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
  commentsDisabled,
  ratingsDisabled,
  videoRemoved,
}) {
  let connection;
  try {
    connection = await oracledb.getConnection();

    const disabledConditions = [];
    if (commentsDisabled) disabledConditions.push("comments_disabled = 'True'");
    if (ratingsDisabled) disabledConditions.push("ratings_disabled = 'True'");
    if (videoRemoved) disabledConditions.push("video_error_or_removed = 'True'");

    const disabledCaseStatements = [];
    if (commentsDisabled)
      disabledCaseStatements.push(
        "COUNT(CASE WHEN unique_video.comments_disabled = 'True' THEN 1 END) AS comments_disabled_count"
      );
    if (ratingsDisabled)
      disabledCaseStatements.push(
        "COUNT(CASE WHEN unique_video.ratings_disabled = 'True' THEN 1 END) AS ratings_disabled_count"
      );
    if (videoRemoved)
      disabledCaseStatements.push(
        "COUNT(CASE WHEN unique_video.video_error_or_removed = 'True' THEN 1 END) AS video_removed_count"
      );

    if (disabledCaseStatements.length === 0) {
      disabledCaseStatements.push("1 AS no_filters_applied");
    }

    const whereClause = disabledConditions.length > 0
      ? `AND (${disabledConditions.join(" OR ")})`
      : "";

    let disabled_sql = `
      SELECT trending_date,
             ${disabledCaseStatements.join(", ")},
             MAX(best_daily.top_video_id) AS top_video_id,
             MAX(best_daily.top_video_title) AS top_video_title,
             MAX(best_daily.top_video_views) AS top_video_views,
             MAX(best_daily.top_video_likes) AS top_video_likes,
             MAX(best_daily.top_video_dislikes) AS top_video_dislikes
      FROM (
          SELECT trending_date,
                 comments_disabled,
                 ratings_disabled,
                 video_error_or_removed,
                 ROW_NUMBER() OVER (PARTITION BY video.video_id ORDER BY views DESC) AS rn
          FROM Video
          ${tag ? `
            JOIN tag_association ON video.video_id = tag_association.video_id
            AND tag_association.tag_string LIKE :tag
          ` : ""}
          WHERE (publish_country LIKE :country OR :country = '%')
            AND (category_id = :category_id OR :category_id IS NULL)
            AND trending_date BETWEEN TO_DATE(:start_date, 'DD-MM-YY') AND TO_DATE(:end_date, 'DD-MM-YY')
            ${whereClause}
      ) unique_video
      JOIN (
          SELECT trending_date AS top_video_trending_date,
                 video_id AS top_video_id,
                 title AS top_video_title,
                 views AS top_video_views,
                 likes AS top_video_likes,
                 dislikes AS top_video_dislikes
          FROM (
              SELECT trending_date, video.video_id, title, views, likes, dislikes,
                     ROW_NUMBER() OVER (PARTITION BY trending_date ORDER BY views DESC) AS day_rank
              FROM Video
              ${tag ? `
                JOIN tag_association ON video.video_id = tag_association.video_id
                AND tag_association.tag_string LIKE :tag
              ` : ""}
              WHERE (publish_country LIKE :country OR :country = '%')
                AND (category_id = :category_id OR :category_id IS NULL)
                AND trending_date BETWEEN TO_DATE(:start_date, 'DD-MM-YY') AND TO_DATE(:end_date, 'DD-MM-YY')
          )
          WHERE day_rank = 1
      ) best_daily ON unique_video.trending_date = top_video_trending_date
      WHERE rn = 1
      GROUP BY trending_date
      ORDER BY trending_date
    `;

    const attributes = {
      country: country || "%",
      category_id: categoryId || null,
      start_date: startDate || "14-11-17",
      end_date: endDate || "14-06-18",
    };
    if (tag) {
      attributes.tag = `%${tag}%`;
    }

    console.log("Inputs: ", attributes);

    const result = await connection.execute(disabled_sql, attributes);

    return result.rows;

  } catch (err) {
    console.error("Error executing 'Disabled Videos' query:", err);
    throw err;
  }
}

// *=== Events ===* //
async function fetchTrendingData({ country, categoryId, startDate, endDate, tag }) {
  let connection;
  try {
    connection = await oracledb.getConnection();
  
    const attributes = {
      country: country || '%',
      category_id: categoryId || null,
      start_date: startDate || '14-11-17',
      end_date: endDate || '14-06-18'
    };
    if (tag) {
      attributes.tag = `%${tag}%`;
    }

    const tagJoin = tag
        ? `JOIN tag_association ON video.video_id = tag_association.video_id`
        : '';
    const tagCondition = tag
      ? `AND tag_association.tag_string LIKE :tag`
      : '';

    // Full SQL query
    const trending_data_sql = `
    SELECT trending_date, 
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
            SELECT trending_date, views, likes, dislikes, comment_count,
                  ROW_NUMBER() OVER (PARTITION BY video.video_id ORDER BY views DESC) AS rn
            FROM Video
            ${tagJoin}
            WHERE (publish_country LIKE :country OR :country = '%')
              AND (category_id = :category_id OR :category_id IS NULL)
              AND trending_date BETWEEN TO_DATE(:start_date, 'DD-MM-YY') AND TO_DATE(:end_date, 'DD-MM-YY')
              ${tagCondition}
        ) unique_video
        JOIN (
            SELECT trending_date AS top_video_trending_date, 
                  video_id AS top_video_id,
                  title AS top_video_title,
                  views AS top_video_views,
                  likes AS top_video_likes,
                  dislikes AS top_video_dislikes
            FROM (
                SELECT trending_date, video.video_id, title, views, likes, dislikes,
                      ROW_NUMBER() OVER (PARTITION BY trending_date ORDER BY views DESC) AS day_rank
                FROM Video
                ${tagJoin}
                WHERE (publish_country LIKE :country OR :country = '%')
                  AND (category_id = :category_id OR :category_id IS NULL)
                  AND trending_date BETWEEN TO_DATE(:start_date, 'DD-MM-YY') AND TO_DATE(:end_date, 'DD-MM-YY')
                  ${tagCondition}
            )
            WHERE day_rank = 1
        ) best_daily ON unique_video.trending_date = best_daily.top_video_trending_date
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

    const attributes = {
      country: country || '%',
      category_id: categoryId || null,
      start_date: startDate || '14-11-17',
      end_date: endDate || '14-06-18'
    };
    if (tag) {
      attributes.tag = `%${tag}%`;
    }

    const tagJoin = tag
        ? `JOIN tag_association ON video.video_id = tag_association.video_id`
        : '';
    const tagCondition = tag
      ? `AND tag_association.tag_string LIKE :tag`
      : '';

    // Full SQL query for popularity
    const popularity_sql = `
      SELECT trending_date,
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
          SELECT trending_date, views, likes, dislikes, comment_count,
                ROW_NUMBER() OVER (PARTITION BY video.video_id ORDER BY views DESC) AS rn
          FROM Video
          ${tagJoin}
          WHERE (publish_country LIKE :country OR :country = '%')
          AND (category_id = :category_id OR :category_id IS NULL)
          AND trending_date BETWEEN TO_Date(:start_date, 'DD-MM-YY') 
                          and TO_Date(:end_date, 'DD-MM-YY')
          ${tagCondition}
      ) unique_video
      JOIN ( -- Gets the best performing video for that day.
          SELECT trending_date AS top_video_trending_date, 
          video_id AS top_video_id,
          title AS top_video_title,
          views AS top_video_views,
          likes AS top_video_likes,
          dislikes AS top_video_dislikes
          FROM (
              SELECT trending_date, video.video_id, title, views, likes, dislikes,
                    ROW_NUMBER() OVER (PARTITION BY trending_date ORDER BY views DESC) AS day_rank
              FROM Video
              ${tagJoin}
              WHERE (publish_country LIKE :country OR :country = '%') 
                AND (category_id = :category_id OR :category_id IS NULL)
                AND trending_date BETWEEN TO_Date(:start_date, 'DD-MM-YY')
                AND TO_Date(:end_date, 'DD-MM-YY')
                ${tagCondition}
          )
          WHERE day_rank = 1
      ) best_daily ON unique_video.trending_date = top_video_trending_date 
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

    const attributes = {
      country: country || '%',
      category_id: categoryId || null,
      start_date: startDate || '14-11-17',
      end_date: endDate || '14-06-18'
    };
    if (tag) {
      attributes.tag = `%${tag}%`;
    }

    const tagJoin = tag
        ? `JOIN tag_association ON video.video_id = tag_association.video_id`
        : '';
    const tagCondition = tag
      ? `AND tag_association.tag_string LIKE :tag`
      : '';

    const sentiment_sql = `
      SELECT trending_date, 
      avg(likes) AS avg_likes, avg(dislikes) AS avg_dislikes, 
      AVG(CASE 
          WHEN dislikes = 0 THEN likes / 1
          ELSE likes / dislikes
      END) AS like_dislike_ratio,
      MAX(best_daily.top_video_id) AS top_video_id,
      MAX(best_daily.top_video_title) AS top_video_title,
      MAX(best_daily.top_video_views) AS top_video_views,
      MAX(best_daily.top_video_likes) AS top_video_likes,
      MAX(best_daily.top_video_dislikes) AS top_video_dislikes
      FROM ( -- Only gets the relevant version of non-unique video IDs
          SELECT trending_date, views, likes, dislikes,
                ROW_NUMBER() OVER (PARTITION BY video.video_id ORDER BY views DESC) AS rn
          FROM Video
          ${tagJoin}
          WHERE (publish_country LIKE :country OR :country = '%')
          AND (category_id = :category_id OR :category_id IS NULL)
          AND trending_date BETWEEN TO_Date(:start_date, 'DD-MM-YY') 
          AND TO_Date(:end_date, 'DD-MM-YY')
          ${tagCondition}
      ) unique_video
      JOIN ( -- Gets the best performing video for that day.
          SELECT trending_date AS top_video_trending_date, 
          video_id AS top_video_id,
          title AS top_video_title,
          views AS top_video_views,
          likes AS top_video_likes,
          dislikes AS top_video_dislikes
          FROM (
              SELECT trending_date, video.video_id, title, views, likes, dislikes,
                    ROW_NUMBER() OVER (PARTITION BY trending_date ORDER BY views DESC) AS day_rank
              FROM Video
              ${tagJoin}
              WHERE (publish_country LIKE :country OR :country = '%') -- When implemented in javascript this line should have an If statement that doesn't run if tag sorting isn't needed.
                AND (category_id = :category_id OR :category_id IS NULL)
                AND trending_date BETWEEN TO_Date(:start_date, 'DD-MM-YY')
                AND TO_Date(:end_date, 'DD-MM-YY')
                ${tagCondition}
          )  
          WHERE day_rank = 1
      ) best_daily ON unique_video.trending_date = top_video_trending_date -- Combines the two subqueries.
      WHERE rn = 1  -- Selects the first unique in each row in video_id
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