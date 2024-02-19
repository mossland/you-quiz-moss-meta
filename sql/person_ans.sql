CREATE TABLE `person_ans` (
  `ansId` bigint(20) NOT NULL AUTO_INCREMENT,
  `personId` varchar(36) NOT NULL,
  `ans` varchar(45) NOT NULL,
  `isAvailable` tinyint(4) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`ansId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4