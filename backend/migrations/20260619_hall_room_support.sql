ALTER TABLE Rooms
  MODIFY room_type ENUM('AC', 'NON_AC', 'HALL') NOT NULL;

ALTER TABLE Rooms
  ADD COLUMN available_beds INT DEFAULT 0;

ALTER TABLE Bookings
  ADD COLUMN room_type ENUM('AC', 'NON_AC', 'HALL') NULL;
