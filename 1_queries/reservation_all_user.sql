SELECT 
    r.id as reservation_id, 
    p.title, 
    r.start_date, 
    p.cost_per_night, 
    AVG(pr.rating) AS average_rating
FROM 
    reservations r
JOIN 
    properties p ON r.property_id = p.property_id
LEFT JOIN 
    property_reviews pr ON p.property_id = pr.property_id
WHERE 
    r.guest_id = 1
GROUP BY 
    r.id, p.title, r.start_date, p.cost_per_night
ORDER BY 
    r.start_date
LIMIT 10;
