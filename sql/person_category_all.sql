CREATE TABLE `person_category_all` (
  `category` varchar(45) NOT NULL,
  `isAvailable` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4