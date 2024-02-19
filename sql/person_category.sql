CREATE TABLE `person_category` (
  `personId` varchar(36) NOT NULL,
  `category` varchar(45) NOT NULL,
  PRIMARY KEY (`personId`,`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4