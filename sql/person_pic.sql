CREATE TABLE `person_pic` (
  `personId` varchar(36) NOT NULL,
  `picId` varchar(36) NOT NULL,
  `isAvailable` tinyint(4) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`personId`,`picId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4