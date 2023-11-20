--
-- Table structure for table `profile`
--

CREATE TABLE `profile` (
  `email` varchar(30) NOT NULL,
  `password` varchar(20) NOT NULL,
  `name` varchar(20) NOT NULL,
  `gender` int(1) NOT NULL,
  `phoneNum` varchar(20) NOT NULL,
  `stdId` varchar(10) NOT NULL,
  `nickname` varchar(20),
  PRIMARY KEY (`stdId`)
);

--
-- Dumping data for table `profile`
--

INSERT INTO `profile` VALUES ('test@test.com','qwer1234','test',0,'010-1234-5678', '20231111', 'testNick');
