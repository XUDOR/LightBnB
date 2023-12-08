SELECT 
    p.property_id AS id, 
    p.title, 
    p.cost_per_night, 
    COALESCE(AVG(pr.rating), 0) AS average_rating
FROM 
    properties p
LEFT JOIN 
    property_reviews pr ON p.property_id = pr.property_id
WHERE 
    p.city = 'Vancouver'
GROUP BY 
    p.property_id, p.title, p.cost_per_night
HAVING 
    COALESCE(AVG(pr.rating), 0) >= 4
ORDER BY 
    p.cost_per_night ASC
LIMIT 10;
