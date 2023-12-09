SELECT 
    p.city, 
    COUNT(r.id) AS total_reservation
FROM 
    properties p
JOIN 
    reservations r ON p.property_id = r.property_id
GROUP BY 
    p.city
ORDER BY 
    total_reservation DESC;
