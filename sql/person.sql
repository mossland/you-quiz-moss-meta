CREATE TABLE `person` (
  `personId` varchar(36) NOT NULL,
  `name` varchar(45) NOT NULL,
  `group` varchar(45) DEFAULT NULL,
  `gender` tinyint(4) NOT NULL,
  `isAvailable` tinyint(4) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`personId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4