SET AUTOCOMMIT = 0;
START TRANSACTION;

-- Action table.
CREATE TABLE IF NOT EXISTS `action` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(125) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=9 ;

INSERT INTO `action` (`id`, `name`) VALUES
(1, 'publish'),
(2, 'reply'),
(3, 'closed'),
(4, 'finished'),
(5, 'modified'),
(6, 'moved');

-- Default timeline.
CREATE TABLE IF NOT EXISTS `timeline_cc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `from_participant` varchar(125) COLLATE utf8_unicode_ci NOT NULL,
  `to_participant` varchar(125) COLLATE utf8_unicode_ci DEFAULT NULL,
  `context` text COLLATE utf8_unicode_ci NOT NULL,
  `action_id` int(11) NOT NULL,
  `id_topic` varchar(125) COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_context` varchar(125) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_tax` (`id_context`),
  FULLTEXT KEY `ucontext` (`context`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- User table.
CREATE TABLE IF NOT EXISTS `user` (
  `username` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(75) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `accounts` text COLLATE utf8_unicode_ci,
  `principal_account` varchar(75) COLLATE utf8_unicode_ci DEFAULT NULL,
  `validated` int(1) NOT NULL DEFAULT '0',
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Insert first user to manage account. The password is 123456
INSERT INTO `user` (`username`, `name`, `email`, `password`, `accounts`, `principal_account`, `validated`, `ts`) 
VALUES ('admin', 'Admin', 'admin@mail.com', 'e10adc3949ba59abbe56e057f20f883e', 'cc', 'cc', '1', CURRENT_TIMESTAMP);

COMMIT;