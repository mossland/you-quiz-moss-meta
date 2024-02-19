CREATE TABLE `user` (
  `userId` varchar(50) NOT NULL,
  `nickname` varchar(50) NOT NULL,
  `authority` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4