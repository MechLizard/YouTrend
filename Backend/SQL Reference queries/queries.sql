
/*- trending_date date is from 14-NOV-17 to 14-JUN-18 AKA 14-11-17 to 14-06-18 in DD-MM-YY
-- publish_date is from 23-JUL-06 to 14-JUN-18 (AKA 23-07-06 to 17-06-18)
-- Input variables start with ":". So, ":country" is a variable that is provided by the user while "country" refers to a table in the database.
-- Set string variables (like country or tag) to '%' by default. It acts as a wildcard in case you don't want to narrow something down. Int variables should be NULL by default.

-- If we are able to display information about videos the video_id should be prepended by https://www.youtube.com/watch?v= so that it becomes a direct link to the video.
-- Ex: Video ID Y6eKxjMA9ek with the link prepended would be: https://www.youtube.com/watch?v=Y6eKxjMA9ek

-- Whenever a tag isn't specified the two lines relating to tags should be removed in code. 
-- On average the line that deals with tags results in a query that is 2.6 seconds compared to 0.4 seconds of one without. 
-- The lines are specified in the first query:


== Input/output documentation ==
All queries will have these inputs:
Country: String, '%' when none selected.
Category_id: int, Null when not selected.
start_date: string in format of 'DD-MM-YY', default is '14-11-17'.
end_date: string in format of 'DD-MM-YY', default is '14-06-18'.
tag: string, '%' when not entered.

All queries will have these outputs:
trending_date: in format of dd-mon-yy (Ex: 14-NOV-17), but this can easily be changed to whatever format is needed.


Time & Day Success Query:
Extra input: 
start_date: Default should be 14-11-17 in DD-MM-YY
end_date: Default should be 14-06-18 in DD-MM-YY
Extra Output: 
published_day_of_week: string, "Monday", "Tuesday", "Wednesday... ect.
Views: Int, total combined views for videos that day.

Disabled videos Query:
Extra Input (Given as a "Choose one" to the user): 
comments_disabled: String, "True" or "False". Default is "False"
ratings_disabled: String, "True" or "False". Default is "False"
video_removed: String, "True" or "False". Default is "False"
Extra Output:
disabled_count: A total count of videos that had the selected feature disabled

Events Query:
Extra Input: 
event: String, name of event chosen
Extra Output:
event_name: string
event_description: string
event_date: in format of dd-mon-yy (Ex: 14-NOV-17), but this can easily be changed to whatever format is needed.

Popularity Query:
Extra Input: 
selection: The value of the radio button for views, likes or dislikes.
Extra Output: 
views: int
likes: int
dislikes: int
comment_count: int

Sentiment Query:
Extra Input: none
Extra Output: 
- avg_likes: Float
- avg_dislikes: Float
- like_dislike_ratio: Float
*/


-- Time & Day Sucess
-- This query uses publish_date instead of trending_date for searches. Which goes from 23-JUL-06 to 14-JUN-18 (AKA 23-07-06 to 17-06-18)
-- This query can be extended with if statements in javascript to only return the needed information 
SELECT publish_date, -- This date can be formatted differently as needed. Ex: TO_CHAR(trending_date, 'mm-dd-yy') AS trending_date
published_day_of_week, SUM(views) AS views, SUM(likes) AS likes, SUM(dislikes) AS dislikes, SUM(comment_count) AS comment_count
FROM ( -- Only gets the relevant version of non-unique video IDs
    SELECT publish_date, published_day_of_week, views, likes, dislikes, comment_count,
           ROW_NUMBER() OVER (PARTITION BY video.video_id ORDER BY views DESC) AS rn
    FROM Video
    JOIN tag_association ON video.video_id = tag_association.video_id  -- When implemented in javascript this line should have an If statement that doesn't run if tag sorting isn't needed.
    WHERE (publish_country LIKE :country OR :country = '%')
    AND (category_id = :category_id OR :category_id IS NULL)
    AND publish_date BETWEEN TO_Date(:start_date, 'DD-MM-YY') -- Default for this query is 23-07-06 (DD-MM-YY)
                    and TO_Date(:end_date, 'DD-MM-YY') -- Default for this query is 17-06-18
    AND (tag_association.tag_string LIKE :tag OR :tag = '%')  -- When implemented in javascript this line should have an If statement that doesn't run if tag sorting isn't needed.
)
WHERE rn = 1  -- Selects the first unique in each row in video_id
GROUP BY publish_date, published_day_of_week
ORDER BY publish_date;



-- Disabled Videos query
-- At least one check box for comments_disabled, ratings_disabled or video_error_or_removed must be checked for this query to make sense. 
SELECT trending_date, -- This date can be formatted differently as needed. Ex: TO_CHAR(trending_date, 'mm-dd-yy') AS trending_date
COUNT(CASE WHEN comments_disabled = 'True' THEN 1 END) AS disabled_count -- When implemented in javascript: Make it so this line only runs If comments_disabled option is selected.
COUNT(CASE WHEN ratings_disabled = 'True' THEN 1 END) AS disabled_count -- When implemented in javascript: Make it so this line only runs If ratings_disabled option is selected.
COUNT(CASE WHEN video_error_or_removed = 'True' THEN 1 END) AS disabled_count -- When implemented in javascript: Make it so this line only runs If video_removed option is selected.
FROM ( -- Only gets the relevant version of non-unique video IDs
    SELECT trending_date, 
	comments_disabled, 
	ratings_disabled, 
	video_error_or_removed,
           ROW_NUMBER() OVER (PARTITION BY video.video_id ORDER BY views DESC) AS rn
    FROM Video
    JOIN tag_association ON video.video_id = tag_association.video_id  -- When implemented in javascript this line should have an If statement that doesn't run if tag sorting isn't needed.
    WHERE (publish_country LIKE :country OR :country = '%')
    AND (category_id = :category_id OR :category_id IS NULL)
    AND trending_date BETWEEN TO_Date(:start_date, 'DD-MM-YY') 
                    and TO_Date(:end_date, 'DD-MM-YY')
    AND (tag_association.tag_string LIKE :tag OR :tag = '%')  -- When implemented in javascript this line should have an If statement that doesn't run if tag sorting isn't needed.
    AND (comments_disabled = 'True') -- When implemented in javascript: Make it so this line only runs If comments_disabled option is selected.
    AND (ratings_disabled = 'True') -- When implemented in javascript: Make it so this line only runs If ratings_disabled option is selected.
    AND (video_error_or_removed = 'True') -- When implemented in javascript: Make it so this line only runs If video_removed option is selected.
)
WHERE rn = 1  -- Selects the first unique in each row in video_id
GROUP BY trending_date
ORDER BY trending_date;



-- Events query
-- This query gives a simple graph of views for the selection, then overlays where the event occured.
SELECT trending_date, -- This date can be formatted differently as needed. Ex: TO_CHAR(trending_date, 'mm-dd-yy') AS trending_date
SUM(views) AS views
FROM ( -- Only gets the relevant version of non-unique video IDs
    SELECT trending_date, views,
           ROW_NUMBER() OVER (PARTITION BY video.video_id ORDER BY views DESC) AS rn
    FROM Video
    JOIN tag_association ON video.video_id = tag_association.video_id -- When implemented in javascript this line should have an If statement that doesn't run if tag sorting isn't needed.
    WHERE (publish_country LIKE :country OR :country = '%')
    AND (category_id = :category_id OR :category_id IS NULL)
    AND trending_date BETWEEN TO_Date(:start_date, 'DD-MM-YY') 
                    and TO_Date(:end_date, 'DD-MM-YY')
    AND (tag_association.tag_string LIKE :tag OR :tag = '%') -- When implemented in javascript this line should have an If statement that doesn't run if tag sorting isn't needed.
)
WHERE rn = 1  -- Selects the first unique in each row in video_id
GROUP BY trending_date
ORDER BY trending_date;

-- Separate query to get the chosen event information
SELECT event_name, event_description, event_date
FROM events
WHERE event_name = :event;



-- Popularity query
-- This query can be extended with if statements in javascript to only return the needed information 
-- This query gives a simple graph of views for the selection
SELECT trending_date, -- This date can be formatted differently as needed. Ex: TO_CHAR(trending_date, 'mm-dd-yy') AS trending_date
SUM(views) AS views, SUM(likes) AS likes, SUM(dislikes) AS dislikes, SUM(comment_count) AS comments
FROM ( -- Only gets the relevant version of non-unique video IDs
    SELECT trending_date, views, likes, dislikes, comment_count,
           ROW_NUMBER() OVER (PARTITION BY video.video_id ORDER BY views DESC) AS rn
    FROM Video
    JOIN tag_association ON video.video_id = tag_association.video_id -- When implemented in javascript this line should have an If statement that doesn't run if tag sorting isn't needed.
    WHERE (publish_country LIKE :country OR :country = '%')
    AND (category_id = :category_id OR :category_id IS NULL)
    AND trending_date BETWEEN TO_Date(:start_date, 'DD-MM-YY') 
                    and TO_Date(:end_date, 'DD-MM-YY')
    AND (tag_association.tag_string LIKE :tag OR :tag = '%') -- When implemented in javascript this line should have an If statement that doesn't run if tag sorting isn't needed.
)
WHERE rn = 1  -- Selects the first unique in each row in video_id
GROUP BY trending_date
ORDER BY trending_date;



-- Sentiment query
SELECT trending_date, -- This date can be formatted differently as needed. Ex: TO_CHAR(trending_date, 'mm-dd-yy') AS trending_date
avg(likes) AS avg_likes, avg(dislikes) AS avg_dislikes, 
AVG(CASE 
    WHEN dislikes = 0 THEN likes / 1
    ELSE likes / dislikes
END) AS like_dislike_ratio
FROM ( -- Only gets the relevant version of non-unique video IDs
    SELECT trending_date, views, likes, dislikes,
           ROW_NUMBER() OVER (PARTITION BY video.video_id ORDER BY views DESC) AS rn
    FROM Video
    JOIN tag_association ON video.video_id = tag_association.video_id -- When implemented in javascript this line should have an If statement that doesn't run if tag sorting isn't needed.
    WHERE (publish_country LIKE :country OR :country = '%')
    AND (category_id = :category_id OR :category_id IS NULL)
    AND trending_date BETWEEN TO_Date(:start_date, 'DD-MM-YY') 
                    and TO_Date(:end_date, 'DD-MM-YY')
    AND (tag_association.tag_string LIKE :tag OR :tag = '%') -- When implemented in javascript this line should have an If statement that doesn't run if tag sorting isn't needed.
)
WHERE rn = 1  -- Selects the first unique in each row in video_id
GROUP BY trending_date
ORDER BY trending_date;