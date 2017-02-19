<?
$version_number="2.2.1"; // Edit when changing versions.
$time=time();

$protocol=($_SERVER['HTTPS']) ? "https" : "http";
$recognized_url=$protocol."://".$_SERVER['HTTP_HOST'].dirname($_SERVER['REQUEST_URI']);
$installation_url=str_replace("admin/actions/install","",$recognized_url);

// Checking if ffmpeg is installed.
if(!file_exists("/usr/local/bin/ffmpeg")){
	if(file_exists("/usr/bin/ffmpeg")){
		$ffmpeg_path="/usr/bin/";
	} else {
		$ffmpeg_path="";
	}		
} else {
	$ffmpeg_path="/usr/local/bin/";
}

// Checking if flvtool2 is installed.
if(!file_exists("/usr/local/bin/flvtool2")){
	if(file_exists("/usr/bin/flvtool2")){
		$flvtool2_path="/usr/bin/";
	} else {
		$flvtool2_path="";
	}
} else {
	$flvtool2_path="/usr/local/bin/";
}

// Checking if imagemagick is installed.
if(file_exists("/usr/bin/convert")){
	$imagemagick_installed=1;
	$imagemagick_path="/usr/bin/";
} else {
	$imagemagick_installed=0;
	$imagemagick_path="";
}


$sql_contents="

CREATE TABLE IF NOT EXISTS `banner_spots` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

INSERT INTO `banner_spots` (`id`, `name`, `description`) VALUES
(1, 'Home Page - Right Menu Banner', '200*600 Banner at the right of the videos table.\nUsed in home, videos and profile pages.\nYou need to add new spots and edit the templates if you wish to change them.'),
(2, 'Video Page Right Banner', '300*600 Banner at the right of the video.'),
(3, 'Video Page Bottom Banner', '600*150 Banner Below the Video Player');

CREATE TABLE IF NOT EXISTS `banners` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `description` text NOT NULL,
  `spot` int(10) unsigned NOT NULL,
  `image` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL DEFAULT '',
  `custom_html` text NOT NULL,
  `weight` decimal(3,2) NOT NULL DEFAULT '1.00' COMMENT '0,01 to 1,99 (Index relative to the other banners of the spot that indicates percetage of being shown)',
  `status` tinyint(1) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC AUTO_INCREMENT=4 ;


INSERT INTO `banners` (`id`, `name`, `description`, `spot`, `image`, `link`, `custom_html`, `weight`, `status`) VALUES
(1, 'Sample Banner', 'Sample Banner 200*600px', 1, 'http://www.automagick.com/images/banners/demo_sample_banner_200x600.jpg', 'http://www.automagick.com', '', '0.01', 1),
(2, 'Sample Banner', 'Sample Banner 300*600', 2, 'http://www.automagick.com/images/banners/demo_sample_banner_300x600.jpg', 'http://www.automagick.com', '', '0.01', 1),
(3, 'Sample Banner', 'Sample Banner 600*150px', 3, 'http://www.automagick.com/images/banners/demo_sample_banner_600x150.jpg', 'http://www.automagick.com', '', '0.01', 1);


CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `thumb` varchar(255) NOT NULL,
  `smart_tags` varchar(255) NOT NULL,
  `forward_to` int(10) unsigned NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `name` (`name`(15))
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC ;

INSERT INTO `categories` (`id`, `name`, `thumb`, `smart_tags`, `forward_to`, `status`) VALUES(1, 'Default Category', '', '', 0, 1);

CREATE TABLE IF NOT EXISTS `categories_groups` (
  `category_id` int(10) unsigned NOT NULL,
  `group_id` int(10) unsigned NOT NULL,
  KEY `category_id` (`category_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `categories_groups` (`category_id`, `group_id`) VALUES(1, 1);

CREATE TABLE IF NOT EXISTS `category_groups` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `status` tinyint(1) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 ;

INSERT INTO `category_groups` (`id`, `name`, `status`) VALUES(1, 'Default', 1);

CREATE TABLE IF NOT EXISTS `category_translations` (
  `category_id` int(10) unsigned NOT NULL,
  `lang_id` int(10) unsigned NOT NULL,
  `name` varchar(100) NOT NULL,
  UNIQUE KEY `category_lang` (`category_id`,`lang_id`),
  KEY `category_id` (`category_id`),
  KEY `lang_id` (`lang_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `channels` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `url` varchar(255) NOT NULL,
  `thumb` varchar(255) NOT NULL,
  `text` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`(14))
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `date` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `video_id` int(10) unsigned NOT NULL,
  `comment` text NOT NULL,
  `thumb_up` int(10) unsigned NOT NULL,
  `thumb_down` int(10) unsigned NOT NULL,
  `spam` tinyint(3) unsigned NOT NULL COMMENT 'Times marked as spam by users.',
  `status` tinyint(4) NOT NULL COMMENT '-1) Pending for Approval, 0) Inactive, 1) Active',
  PRIMARY KEY (`id`),
  KEY `date` (`date`),
  KEY `user_id` (`user_id`),
  KEY `video_id` (`video_id`),
  KEY `status` (`status`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS `countries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(2) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 ;

INSERT INTO `countries` (`id`, `code`, `name`) VALUES(1, 'us', 'United States');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(2, 'ca', 'Canada');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(3, 'af', 'Afghanistan');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(4, 'al', 'Albania');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(5, 'dz', 'Algeria');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(6, 'ds', 'American Samoa');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(7, 'ad', 'Andorra');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(8, 'ao', 'Angola');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(9, 'ai', 'Anguilla');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(10, 'aq', 'Antarctica');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(11, 'ag', 'Antigua and/or Barbuda');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(12, 'ar', 'Argentina');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(13, 'am', 'Armenia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(14, 'aw', 'Aruba');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(15, 'au', 'Australia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(16, 'at', 'Austria');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(17, 'az', 'Azerbaijan');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(18, 'bs', 'Bahamas');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(19, 'bh', 'Bahrain');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(20, 'bd', 'Bangladesh');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(21, 'bb', 'Barbados');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(22, 'by', 'Belarus');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(23, 'be', 'Belgium');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(24, 'bz', 'Belize');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(25, 'bj', 'Benin');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(26, 'bm', 'Bermuda');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(27, 'bt', 'Bhutan');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(28, 'bo', 'Bolivia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(29, 'ba', 'Bosnia and Herzegovina');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(30, 'bw', 'Botswana');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(31, 'bv', 'Bouvet Island');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(32, 'br', 'Brazil');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(33, 'io', 'British lndian Ocean Territory');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(34, 'bn', 'Brunei Darussalam');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(35, 'bg', 'Bulgaria');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(36, 'bf', 'Burkina Faso');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(37, 'bi', 'Burundi');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(38, 'kh', 'Cambodia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(39, 'cm', 'Cameroon');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(40, 'cv', 'Cape Verde');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(41, 'ky', 'Cayman Islands');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(42, 'cf', 'Central African Republic');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(43, 'td', 'Chad');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(44, 'cl', 'Chile');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(45, 'cn', 'China');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(46, 'cx', 'Christmas Island');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(47, 'cc', 'Cocos (Keeling) Islands');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(48, 'co', 'Colombia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(49, 'km', 'Comoros');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(50, 'cg', 'Congo');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(51, 'ck', 'Cook Islands');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(52, 'cr', 'Costa Rica');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(53, 'hr', 'Croatia (Hrvatska)');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(54, 'cu', 'Cuba');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(55, 'cy', 'Cyprus');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(56, 'cz', 'Czech Republic');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(57, 'dk', 'Denmark');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(58, 'dj', 'Djibouti');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(59, 'dm', 'Dominica');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(60, 'do', 'Dominican Republic');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(61, 'tp', 'East Timor');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(62, 'ec', 'Ecudaor');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(63, 'eg', 'Egypt');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(64, 'sv', 'El Salvador');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(65, 'gq', 'Equatorial Guinea');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(66, 'er', 'Eritrea');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(67, 'ee', 'Estonia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(68, 'et', 'Ethiopia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(69, 'fk', 'Falkland Islands (Malvinas)');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(70, 'fo', 'Faroe Islands');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(71, 'fj', 'Fiji');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(72, 'fi', 'Finland');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(73, 'fr', 'France');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(74, 'fx', 'France, Metropolitan');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(75, 'gf', 'French Guiana');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(76, 'pf', 'French Polynesia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(77, 'tf', 'French Southern Territories');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(78, 'ga', 'Gabon');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(79, 'gm', 'Gambia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(80, 'ge', 'Georgia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(81, 'de', 'Germany');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(82, 'gh', 'Ghana');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(83, 'gi', 'Gibraltar');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(84, 'gr', 'Greece');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(85, 'gl', 'Greenland');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(86, 'gd', 'Grenada');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(87, 'gp', 'Guadeloupe');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(88, 'gu', 'Guam');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(89, 'gt', 'Guatemala');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(90, 'gn', 'Guinea');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(91, 'gw', 'Guinea-Bissau');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(92, 'gy', 'Guyana');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(93, 'ht', 'Haiti');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(94, 'hm', 'Heard and Mc Donald Islands');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(95, 'hn', 'Honduras');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(96, 'hk', 'Hong Kong');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(97, 'hu', 'Hungary');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(98, 'is', 'Iceland');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(99, 'in', 'India');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(100, 'id', 'Indonesia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(101, 'ir', 'Iran (Islamic Republic of)');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(102, 'iq', 'Iraq');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(103, 'ie', 'Ireland');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(104, 'il', 'Israel');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(105, 'it', 'Italy');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(106, 'ci', 'Ivory Coast');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(107, 'jm', 'Jamaica');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(108, 'jp', 'Japan');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(109, 'jo', 'Jordan');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(110, 'kz', 'Kazakhstan');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(111, 'ke', 'Kenya');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(112, 'ki', 'Kiribati');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(113, 'kp', 'Korea, Democratic People\'s Republic of');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(114, 'kr', 'Korea, Republic of');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(115, 'kw', 'Kuwait');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(116, 'kg', 'Kyrgyzstan');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(117, 'la', 'Lao People\'s Democratic Republic');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(118, 'lv', 'Latvia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(119, 'lb', 'Lebanon');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(120, 'ls', 'Lesotho');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(121, 'lr', 'Liberia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(122, 'ly', 'Libyan Arab Jamahiriya');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(123, 'li', 'Liechtenstein');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(124, 'lt', 'Lithuania');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(125, 'lu', 'Luxembourg');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(126, 'mo', 'Macau');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(127, 'mk', 'Macedonia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(128, 'mg', 'Madagascar');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(129, 'mw', 'Malawi');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(130, 'my', 'Malaysia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(131, 'mv', 'Maldives');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(132, 'ml', 'Mali');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(133, 'mt', 'Malta');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(134, 'mh', 'Marshall Islands');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(135, 'mq', 'Martinique');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(136, 'mr', 'Mauritania');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(137, 'mu', 'Mauritius');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(138, 'ty', 'Mayotte');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(139, 'mx', 'Mexico');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(140, 'fm', 'Micronesia, Federated States of');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(141, 'md', 'Moldova, Republic of');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(142, 'mc', 'Monaco');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(143, 'mn', 'Mongolia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(144, 'ms', 'Montserrat');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(145, 'ma', 'Morocco');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(146, 'mz', 'Mozambique');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(147, 'mm', 'Myanmar');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(148, 'na', 'Namibia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(149, 'nr', 'Nauru');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(150, 'np', 'Nepal');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(151, 'nl', 'Netherlands');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(152, 'an', 'Netherlands Antilles');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(153, 'nc', 'New Caledonia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(154, 'nz', 'New Zealand');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(155, 'ni', 'Nicaragua');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(156, 'ne', 'Niger');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(157, 'ng', 'Nigeria');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(158, 'nu', 'Niue');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(159, 'nf', 'Norfork Island');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(160, 'mp', 'Northern Mariana Islands');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(161, 'no', 'Norway');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(162, 'om', 'Oman');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(163, 'pk', 'Pakistan');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(164, 'pw', 'Palau');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(165, 'pa', 'Panama');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(166, 'pg', 'Papua New Guinea');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(167, 'py', 'Paraguay');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(168, 'pe', 'Peru');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(169, 'ph', 'Philippines');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(170, 'pn', 'Pitcairn');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(171, 'pl', 'Poland');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(172, 'pt', 'Portugal');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(173, 'pr', 'Puerto Rico');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(174, 'qa', 'Qatar');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(175, 're', 'Reunion');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(176, 'ro', 'Romania');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(177, 'ru', 'Russian Federation');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(178, 'rw', 'Rwanda');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(179, 'kn', 'Saint Kitts and Nevis');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(180, 'lc', 'Saint Lucia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(181, 'vc', 'Saint Vincent and the Grenadines');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(182, 'ws', 'Samoa');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(183, 'sm', 'San Marino');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(184, 'st', 'Sao Tome and Principe');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(185, 'sa', 'Saudi Arabia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(186, 'sn', 'Senegal');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(187, 'sc', 'Seychelles');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(188, 'sl', 'Sierra Leone');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(189, 'sg', 'Singapore');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(190, 'sk', 'Slovakia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(191, 'si', 'Slovenia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(192, 'sb', 'Solomon Islands');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(193, 'so', 'Somalia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(194, 'za', 'South Africa');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(195, 'gs', 'South Georgia South Sandwich Islands');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(196, 'es', 'Spain');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(197, 'lk', 'Sri Lanka');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(198, 'sh', 'St. Helena');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(199, 'pm', 'St. Pierre and Miquelon');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(200, 'sd', 'Sudan');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(201, 'sr', 'Suriname');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(202, 'sj', 'Svalbarn and Jan Mayen Islands');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(203, 'sz', 'Swaziland');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(204, 'se', 'Sweden');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(205, 'ch', 'Switzerland');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(206, 'sy', 'Syrian Arab Republic');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(207, 'tw', 'Taiwan');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(208, 'tj', 'Tajikistan');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(209, 'tz', 'Tanzania, United Republic of');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(210, 'th', 'Thailand');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(211, 'tg', 'Togo');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(212, 'tk', 'Tokelau');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(213, 'to', 'Tonga');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(214, 'tt', 'Trinidad and Tobago');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(215, 'tn', 'Tunisia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(216, 'tr', 'Turkey');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(217, 'tm', 'Turkmenistan');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(218, 'tc', 'Turks and Caicos Islands');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(219, 'tv', 'Tuvalu');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(220, 'ug', 'Uganda');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(221, 'ua', 'Ukraine');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(222, 'ae', 'United Arab Emirates');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(223, 'gb', 'United Kingdom');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(224, 'um', 'United States minor outlying islands');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(225, 'uy', 'Uruguay');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(226, 'uz', 'Uzbekistan');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(227, 'vu', 'Vanuatu');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(228, 'va', 'Vatican City State');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(229, 've', 'Venezuela');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(230, 'vn', 'Vietnam');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(231, 'vg', 'Virigan Islands (British)');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(232, 'vi', 'Virgin Islands (U.S.)');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(233, 'wf', 'Wallis and Futuna Islands');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(234, 'eh', 'Western Sahara');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(235, 'ye', 'Yemen');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(236, 'yu', 'Yugoslavia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(237, 'zr', 'Zaire');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(238, 'zm', 'Zambia');
INSERT INTO `countries` (`id`, `code`, `name`) VALUES(239, 'zw', 'Zimbabwe');


CREATE TABLE IF NOT EXISTS `labels` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `lang_id` int(10) unsigned NOT NULL,
  `name` varchar(150) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lang_id` (`lang_id`,`name`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='Table that stores all the labels for each language.' ;


INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'my_favorite', 'My Favorite');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'new_videos', 'New Videos');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'home', 'Home');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'videos', 'Videos');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'categories', 'Categories');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'favorites', 'Favorites');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'premium', 'Premium');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'videochat', 'Videochat');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'upload', 'Upload');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'advanced_search', 'Advanced Search');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'view', 'View');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'search', 'Search');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'new', 'New');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'first', 'First');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'last', 'Last');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'date', 'Date');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'views', 'Views');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'rating', 'Rating');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'duration', 'Duration');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'recently_added_videos', 'Recently Added Videos');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'meta_title', 'This is the title of the site and for metatags.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'meta_description', 'This is the description of the site for the metatags.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'meta_keywords', 'This are the keywords of the site for the metatags.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'popular_videos', 'Popular Videos');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'most_rated_videos', 'Most Rated Videos');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'alphabetical', 'Alphabetical');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'longest_videos', 'Longest Videos');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'top_rated', 'Top Rated');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'most_popular', 'Most Popular');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'last_added', 'Last Added');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'more', 'more');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'less', 'less');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'no_video_decription', 'This video doesn\'t have description.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'share', 'Share');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'share_url', 'Share Url');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'favorite', 'Favorite');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'login_register', '<a href=\"javascript:void(0)\;\" onclick=\"OpenLayer(\'login_register_layer\');\" class=\"link\">Log in</a> or <a href=\"javascript:void(0)\;\" onclick=\"OpenLayer(\'login_register_layer\')\;\" class=\"link\">register</a> to add this video to your favorites.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'add_favorite', 'Add video to favorites');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'remove_favorite', 'Remove video from favorites');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'video_info', 'Video Info');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'times', 'times');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'viewed', 'Viewed');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'channels', 'Channels');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'uploaded', 'Uploaded');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'uploaded_by', 'Uploaded By');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'favorited', 'Favorited');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'tags', 'Tags');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'rate_video', 'Rate Video');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'thank_you', 'Thank You');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'rank1', 'Awful');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'rank2', 'Bad');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'rank3', 'Average');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'rank4', 'Good');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'rank5', 'Excellent!');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'already_voted', 'Already Voted');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'videos_being_watched', 'Videos Being Watched Now');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'premium_videos', 'Premium Videos');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'error_try_later', 'Error. Try Later.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'with', 'with');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'votes', 'votes');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'register_link', '<a href=\"javascript:void(0)\;\" onclick=\"OpenLayer(\'login_register_layer\');\" class=\"link\">Register</a>');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'channel', 'channel');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'watch_more_of', 'Watch more videos of');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'related_videos', 'Related Videos');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'login', 'login');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'register', 'register');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'username', 'Username');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'password', 'Password');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'email', 'E-Mail');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'close', 'close');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'comments', 'comments');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'showing', 'Showing');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'to', 'to');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'of', 'of');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'total_comments', 'total comments');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'report_spam', 'Report Spam');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'report_this_video', 'Report this Video');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'report_reason_1', 'Video not working');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'report_reason_2', 'Inappropriate (rape, incest, etc.)');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'report_reason_3', 'Copyrighted Material');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'report_reason_4', 'Underage');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'report_reason_5', 'Other');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'report_video_message_success', 'Report Sent. Thank you.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'report_video_message_error', 'Error: could not send the report. Try again later.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'add_comment', 'Add a Comment');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'post_comment', 'Post Comment');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'register_to_comment', 'Register to Comment');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'username_required', 'Username is Required');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'password_required', 'Password is Required');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'login_failed', 'Wrong username/pass combination.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'user_not_active', 'Your account is not active.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'forgot_password', 'Forgot Password?');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'recover_password', 'Recover Password');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'forgot_instructions', 'Enter your E-Mail to receive recover instructions.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'favorited_error', 'Error: could not add/remove video from favorites.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'my_profile', 'My Profile');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'logout', 'logout');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'comments_not_allowed', 'Comments are not allowed.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'comments_error', 'Cannot send an empty comment.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'comment_explanation', 'You may use some HTML tags like: &lt;a&gt;, &lt;b&gt;, &lt;i&gt;, &lt;u&gt; and &lt;img&gt;. Links will not be read by search engines, so don\'t make SPAM.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'recaptcha_error', 'Entered code is not correct.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'comment_empty', 'Comment is empty.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'comment_added', 'Comment successfully added.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'comment_failure', 'Comment failed to be added.\nTry again later.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'like_dislike_error', 'Already Chosen');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'my', 'my');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'edit_my_profile', 'Edit my Profile');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'edit_avatar', 'Edit Avatar');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'user_not_found', 'User has not been found. Contact Support if you think this is an error.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'password_tip', 'Password: Leave this field empty if you don\'t want to edit your password.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'username_tip', 'Username: Can\'t edit it here. Contact support to do it.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'premium_video', 'Premium Video');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'email_tip', 'E-Mail: Can\'t be edited. Contact support to edit.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'generate_random_password', 'Generate Random Password');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'country', 'Country');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'no_country_selected', 'No country Selected');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'gender', 'Gender');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'male', 'Male');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'female', 'Female');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'birthdate', 'Birthdate');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'birthday_tip', 'Your Birthdate: YYYY-MM-DD');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'edit_profile', 'Edit Profile');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'upload_image', 'Upload Image');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'browse', 'browse');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'current_avatar', 'Current Avatar');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'file_upload_failed', 'File could not be uploaded.\\r\\nContact support and report this problem.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'file_format_invalid', 'Invalid file format: Only JPG, PNG and GIF formats allowed.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'session_expired', 'Access Denied: Your session has expired.\\r\\nPlease login.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'crop_image', 'Crop Image');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'preview', 'Preview');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'crop_save', 'Crop & Save');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'cancel', 'Cancel');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'profile_not_updated', 'Profile could not be updated. Contact support.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'profile_successfully_updated', 'Your Profile has been successfully updated.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'title', 'Title');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'description', 'Description');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'file', 'File');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'upload_video', 'Upload Video');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'upload_video_instructions', '');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'upload_categories_tip', 'You can select multiple categories using Shift + Cntrl keys.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'tags_tip', 'Comma separated.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'mandatory_fields', 'Mandatory Fields');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'all_fields_required', 'All fields are required.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'upload_invalid_format', 'Invalid file format.\\r\\nOnly FLV, AVI, WMV, MPEG or MP4 videos supported.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'video_addition_failed', 'Video could not be added.\\r\\nContact Support');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'video_upload_success_message', 'Video Uploaded Successfully.<br>\nPlease allow a couple of minutes for it to be shown.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'email_required', 'Please, complete your E-Mail address.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'email_not_found', 'E-mail does not exist.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'recover_email_sent', 'An E-mail has been sent with recovery instructions.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'cannot_save_image', 'Cannot save image.\\r\\nContact Support.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'cannot_crop_image', 'Cannot crop image.\\r\\nContact Support.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'password_recovery_instructions', 'Password Recovery Instructions');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'password_recovery_email_text', 'Regards, {*username*}.\n\nThis is an email you requested to reset your password.\n\nClick on the next link to proceed:\n\n{*reset_link*}\n\nA new password will be created and will be sent to your email.\n\nIf you didn\'t request a new password, just ignore this message.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'reset_pass_wrong_data_sent', 'Wrong Recovery Info Sent. Start All Over');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'pass_reset_check_email', 'Your Password has been reset. Check your Email.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'password_reset_success', 'Your new password.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'password_reset_email_text', 'Rgards, {*username*}.\n\nYou password reset has been successful.\n\nNew Password: {*password*}\n\nYou may now login to {*site_url*}');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'enter_fullscreen_mode', 'Enter fullscreen mode');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'buy_premium_membership', 'Buy Premium Membership');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'premium_membership_instructions', 'Please, select the option of your choice.<br>You will be able to pay with PayPal, Credit Card, or eCheck.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'paypal_option_button_1', '<form action=\"https://www.sandbox.paypal.com/cgi-bin/webscr\" method=\"post\">\n<input type=\"hidden\" name=\"cmd\" value=\"_s-xclick\">\n<input type=\"hidden\" name=\"hosted_button_id\" value=\"FJ4EPV7C9VVQ4\">\n<input type=\"image\" src=\"https://www.sandbox.paypal.com/en_US/i/btn/btn_buynowCC_LG.gif\" border=\"0\" name=\"submit\" alt=\"PayPal - The safer, easier way to pay online!\">\n<img alt=\"\" border=\"0\" src=\"https://www.sandbox.paypal.com/en_US/i/scr/pixel.gif\" width=\"1\" height=\"1\">\n</form>');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'paypal_option_button_2', '<form action=\"https://www.sandbox.paypal.com/cgi-bin/webscr\" method=\"post\">\n<input type=\"hidden\" name=\"cmd\" value=\"_s-xclick\">\n<input type=\"hidden\" name=\"hosted_button_id\" value=\"5U3EEDYSWV39Q\">\n<input type=\"image\" src=\"https://www.sandbox.paypal.com/en_US/i/btn/btn_buynowCC_LG.gif\" border=\"0\" name=\"submit\" alt=\"PayPal - The safer, easier way to pay online!\">\n<img alt=\"\" border=\"0\" src=\"https://www.sandbox.paypal.com/en_US/i/scr/pixel.gif\" width=\"1\" height=\"1\">\n</form>');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'paypal_option_button_3', '<form action=\"https://www.sandbox.paypal.com/cgi-bin/webscr\" method=\"post\">\n<input type=\"hidden\" name=\"cmd\" value=\"_s-xclick\">\n<input type=\"hidden\" name=\"hosted_button_id\" value=\"MC5WVLP85ZWSY\">\n<input type=\"image\" src=\"https://www.sandbox.paypal.com/en_US/i/btn/btn_buynowCC_LG.gif\" border=\"0\" name=\"submit\" alt=\"PayPal - The safer, easier way to pay online!\">\n<img alt=\"\" border=\"0\" src=\"https://www.sandbox.paypal.com/en_US/i/scr/pixel.gif\" width=\"1\" height=\"1\">\n</form>');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'paypal_option_button_4', '');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'paypal_option_button_5', '');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'zombaio_option_button_1', '<form name=\"form1\" method=\"POST\" action=\"https://secure.zombaio.com/?{*site_id*}.{*pricing_id*}.ZOM\">\n<input type=\"hidden\" name=\"extra\" value=\"&user_id={*user_id*}\">\n<input type=\"hidden\" name=\"Username\" value=\"{*user_name*}\">\n<input type=\"hidden\" name=\"Password\" value=\"{*user_password*}\">\n<input type=\"image\" src=\"templates/{*template*}/images/zombaio_option_1_{*lang_code*}.jpg\">\n</form>');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'zombaio_option_button_2', '<form name=\"form2\" method=\"POST\" action=\"https://secure.zombaio.com/?{*site_id*}.{*pricing_id*}.ZOM\">\n<input type=\"hidden\" name=\"extra\" value=\"&user_id={*user_id*}\">\n<input type=\"hidden\" name=\"Username\" value=\"{*user_name*}\">\n<input type=\"hidden\" name=\"Password\" value=\"{*user_password*}\">\n<input type=\"image\" src=\"templates/{*template*}/images/zombaio_option_2_{*lang_code*}.jpg\">\n</form>');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'zombaio_option_button_3', '<form name=\"form3\" method=\"POST\" action=\"https://secure.zombaio.com/?{*site_id*}.{*pricing_id*}.ZOM\3>\n<input type=\"hidden\" name=\"extra\" value=\"&user_id={*user_id*}\">\n<input type=\"hidden\" name=\"Username\" value=\"{*user_name*}\">\n<input type=\"hidden\" name=\"Password\" value=\"{*user_password*}\">\n<input type=\"image\" src=\"templates/{*template*}/images/zombaio_option_3_{*lang_code*}.jpg\">\n</form>');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'zombaio_option_button_4', '');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'zombaio_option_button_5', '');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'user_exists', 'Username already taken. Choose another one.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'user_not_added', 'User could not be added. Contact Support.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'register_success', 'Your account has been created!<br>Check your email to confirm it.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'email_missmatch', 'E-mail format is not correct.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'delete_video_confirm', 'Are you sure you want to delete this video?');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'rss_feed', 'RSS Feed');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'rss_feeds_title', 'Get your RSS feeds');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'rss_feeds_text', 'What Is RSS?<br><br>RSS (Rich Site Summary) is a format for delivering regularly changing web content. Many video-related sites, video sites and publishers syndicate their content as an RSS Feed to whoever wants it.<br><br>Why use RSS? Benefits and Reasons for using RSS<br><br>RSS solves a problem for people who regularly use the web and would like to get updated in new videos quick. It allows you to easily stay informed by retrieving the latest content from the sites you are interested in and all the latest new videos in this site. You save time by not needing to visit each site individually. The number of sites offering RSS feeds is growing rapidly and includes big names like Yahoo and Google News.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'delete_permission_denied', 'You don''t have the rights to delete this video.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'tags_cloud', 'Tags Cloud');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'your_account_password', 'Your Account Password');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'embed_code', 'Embed Code');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'sponsored_by', 'Sponsored By');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'login_info_msg', 'You need to log in to use this feature.');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'create_account', 'Create Account');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'or', 'or');
INSERT INTO `labels` (`id`, `lang_id`, `name`, `value`) VALUES('', 1, 'tags_archive', 'Tags Archive');


CREATE TABLE IF NOT EXISTS `languages` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(2) NOT NULL COMMENT 'Iso Code: en, es, it, etc',
  `name` varchar(30) NOT NULL,
  `installed` tinyint(1) unsigned NOT NULL COMMENT '0) Not installed, 1) Installed',
  `default` tinyint(1) unsigned NOT NULL COMMENT '0) Not Default, 1) Default Language',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='Languages available' ;


INSERT INTO `languages` (`id`, `code`, `name`, `installed`, `default`) VALUES(1, 'en', 'English', 1, 1);

CREATE TABLE IF NOT EXISTS `paypal_txns` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `txn_id` varchar(20) NOT NULL,
  `date` int(11) NOT NULL,
  `item_number` int(11) NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(5) NOT NULL,
  `status` varchar(1) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `txn_id` (`txn_id`),
  KEY `user_id` (`user_id`),
  KEY `date` (`date`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS `players` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `code` text NOT NULL,
  `default` tinyint(1) unsigned NOT NULL COMMENT '0) Not Default, 1) Default Player',
  `editable` tinyint(1) unsigned NOT NULL COMMENT 'Is the player code, editable by the user?',
  `comments` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT 'Aditional comments regarding the player.',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='Players Code' ;

INSERT INTO `players` (`id`, `name`, `code`, `default`, `editable`, `comments`) VALUES(1, 'Default Player', '<object width=\"{*player_width*}\" height=\"{*player_height*}\" data=\"{*installation_url*}players/default/player.swf\" name=\"player\" id=\"player\" type=\"application/x-shockwave-flash\">\r\n<param name=\"movie\" value=\"{*installation_url*}players/default/player.swf\">\r\n<param name=\"allowfullscreen\" value=\"true\">\r\n<param name=\"allowscriptaccess\" value=\"always\">\r\n<param name=\"quality\" value=\"high\">\r\n<param name=\"cachebusting\" value=\"true\">\r\n<param name=\"bgcolor\" value=\"#{*background_color*}\">\r\n<param name=\"wmode\" value=\"opaque\">\r\n<param  name=\"flashvars\" value=\"config={*installation_url*}players/default/config.php?id={*video_id*}\">\r\n<embed src=\"{*installation_url*}players/default/player.swf\" width=\"{*player_width*}\" height=\"{*player_height*}\" name=\"player\" id=\"player\" \r\nflashvars=\"config={*installation_url*}players/default/config.php?id={*video_id*}\" \r\nquality=\"high\" bgcolor=\"#{*background_color*}\" allowfullscreen=\"true\" allowscriptaccess=\"always\"\r\ncachebusting=\"true\"\r\npluginspage=\"http://www.macromedia.com/go/getflashplayer\" type=\"application/x-shockwave-flash\" wmode=\'opaque\' />\r\n</object>', 1, 0, 'This is the Default Player. It can\'t be edited. You are able to configure it in Settings > Default Player');

CREATE TABLE IF NOT EXISTS `rtmp_servers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `server` varchar(100) NOT NULL,
  `host` varchar(100) NOT NULL,
  `port` int(10) unsigned NOT NULL,
  `user` varchar(50) NOT NULL,
  `pass` varchar(50) NOT NULL,
  `remove_ext` tinyint(1) unsigned NOT NULL,
  `add_mp4` tinyint(1) unsigned NOT NULL,
  `status` tinyint(1) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `search_tags` (
  `tag` varchar(40) NOT NULL,
  `lang_id` int(10) unsigned NOT NULL,
  `date` int(10) unsigned NOT NULL,
  `tag_count` int(10) unsigned NOT NULL DEFAULT '1',
  UNIQUE `tag` (`tag` (15)),
  KEY `date` (`date`),
  KEY `lang_id` (`lang_id`),
  KEY `tag_count` (`tag_count`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='We save here the tags searched from the index, to show the c';

CREATE TABLE IF NOT EXISTS `tags_archive` (
  `id` INT( 10 ) UNSIGNED NOT NULL AUTO_INCREMENT ,
  `tag` VARCHAR( 40 ) NOT NULL ,
  `status` TINYINT( 1 ) UNSIGNED NOT NULL ,
  PRIMARY KEY ( `id` ),
  UNIQUE ( `tag` ( 20 ) ),
  INDEX ( `status` )
) ENGINE = MyISAM DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS `settings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(20) NOT NULL COMMENT 'Type of setting value: settings, sources, templates, etc.',
  `name` varchar(50) NOT NULL,
  `value` varchar(255) NOT NULL,
  `parent` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC ;

INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES(1, 'settings', 'aSettings', '', 0);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'template_name', 'tubepro', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'style_name', 'styles', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'license_number', '".$_POST['license_number']."', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'admin_user', 'admin', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'admin_pass', 'admin', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'admin_name', 'Webmaster Name', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'admin_email', 'webmaster@yourdomain.com', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'installation_url', '$installation_url', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'site_title', 'Your Site Name', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'home_title', 'title of the homepage', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'videos_amount', '24', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'videos_cols', '4', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'player_width', '640', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'player_height', '480', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'thumb_width', '164', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'thumb_height', '124', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'related_amount', '10', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'related_cols', '2', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'ffmpeg_path', '$ffmpeg_path', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'flvtool2_path', '$flvtool2_path', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'ffmpeg_autoconvert', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'ffmpeg_conversion_command', '-vcodec libx264 -vpre medium -ab 128 -ar 44100 -b 200 -r 15 -s {*player_width*}x{*player_height*} -f flv', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'ffmpeg_capture_time_limit', '5', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tasks_cron_limit', '0', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'imagemagick_installed', '$imagemagick_installed', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'imagemagick_path', '$imagemagick_path', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'comments_allowed', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'comments_amount', '25', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'comments_anonymus_allowed', '0', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'comments_disable_after', '10', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'comments_forbidden_keywords', '', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'default_player_background_color', '000000', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'default_player_controlbar_color', '000000', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'default_player_controlbar_font_color', 'FFFFFF', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'default_player_preroll_status', '0', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'default_player_preroll_link', '', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'default_player_preroll_image', '', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'default_player_preroll_duration', '8', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'default_player_postroll_status', '0', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'default_player_postroll_link', '', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'default_player_postroll_image', '', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'default_player_straming_method', '2', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'default_player_rtmp_server', '', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'home_premium_amount', '8', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'template_caching', '0', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'premium_icon', 'templates/automagick/images/black_hd_icon.png', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'current_version', '$version_number', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'home_being_watched_amount', '8', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'home_recently_added_amount', '24', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'ratings_anonymus_allowed', '0', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'rss_status', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'rss_categories', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'sitemap_status', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'sitemap_frequency', 'daily', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'sitemap_videos_frequency', 'daily', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'smart_recategorization_ignore_list', 'the,of,with,a,one,he,she,is,there,on,in,under,over', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'comments_moderation', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'comments_captcha', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'recaptcha_private_key', '6LevbroSAAAAALhB6rYPXmvrDWxxuaniKCBNs5Ao', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'recaptcha_public_key', '6LevbroSAAAAAHby8CZqDI2Hd3cLaDUm_9AIdzjP', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'imagemagick_installed', '".($imagemagick_installed ? 1 : 0)."', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'imagemagick_autoenhance', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'video_upload_allowed', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'video_upload_moderated', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'video_upload_player_id', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'video_upload_task_m4v_conversion', '0', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'video_upload_task_mp4_conversion', '0', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'video_upload_task_autotranslate', '0', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'thumbs_amount', '8', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'premium_postroll_image', '$installation_url/templates/automagick/images/premium.jpg', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'default_player_autoplay', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'premium_postroll_link', 'javascript:OpenPremiumOptions()\;', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'premium_free_seconds', '15', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'paypal_method_status', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'paypal_option_item_number_1', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'paypal_option_days_amount_1', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'paypal_option_item_number_2', '2', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'paypal_option_days_amount_2', '30', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'paypal_option_item_number_3', '3', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'paypal_option_days_amount_3', '90', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'paypal_option_item_number_4', '', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'paypal_option_days_amount_4', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'paypal_option_item_number_5', '', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'paypal_option_days_amount_5', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'paypal_option_item_name_1', '1 Day Premium Membership - $1.99', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'paypal_option_item_name_2', '30 Days Premium Membership - $29.99', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'paypal_option_item_name_3', '3 Months Premium Membership - $79.99', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'paypal_option_item_name_4', '', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'paypal_option_item_name_5', '', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'zombaio_method_status', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'zombaio_gw_pass', '', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'zombaio_site_id', '', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'zombaio_rebill_days', '30', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'zombaio_option_item_name_1', '1 Day Premium Membership - $1.99', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'zombaio_option_pricing_id_1', '', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'zombaio_option_days_amount_1', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'zombaio_option_item_name_2', '30 Days Premium Membership - $29.99', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'zombaio_option_pricing_id_2', '', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'zombaio_option_days_amount_2', '30', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'zombaio_option_item_name_3', '3 Months Premium Membership - $79.99', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'zombaio_option_pricing_id_3', '', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'zombaio_option_days_amount_3', '92', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'zombaio_option_item_name_4', '', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'zombaio_option_pricing_id_4', '', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'zombaio_option_days_amount_4', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'zombaio_option_item_name_5', '', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'zombaio_option_pricing_id_5', '', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'zombaio_option_days_amount_5', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'template_cache_lifetime', '60', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'mobile_enabled', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'mobile_amount', '5', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'mobile_thumb_width', '120', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'mobile_thumb_height', '96', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'mobile_ffmpeg_conversion_command', '-vcodec libx264 -vpre medium -ar 44100 -ab 96k -b 1200k -r 15 -s 320x240 -threads 0 -f m4v', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'mobile_ffmpeg_mp4_conversion_command', '-vcodec libx264 -vpre medium -ar 44100 -ab 96k -b 1200k -r 15 -s 320x240 -threads 0 -f mp4', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'mobile_template_name', 'mobile_default', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'mobile_style_name', 'dark_style', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'mobile_header_bgcolor', '6F0000', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'mobile_bar_bgcolor', 'E06300', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'mobile_body_bgcolor', '000000', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'mobile_font_color', 'FFFFFF', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'mobile_links_color', 'FC4700', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'mobile_item_bgcolor', '363636', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'mobile_item_border', '6F5D5A', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'mobile_thumb_border_color', 'FFAD00', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'mobile_font_color_2', 'FA0000', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'mobile_menu_links_color', 'FFFFFF', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tags_cloud_enabled', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tags_cloud_limit', '30', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tags_cloud_smallest_font', '8', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tags_cloud_largest_font', '26', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tags_cloud_duration', '5', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tags_cloud_expiration', '30', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tags_archive_font_size', '10', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tags_archive_enabled', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tags_archive_limit', '100', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tags_archive_activate_amount', '10', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tubepro_links2_color', 'A00000', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tubepro_thumb_bgcolor', 'F9F9F9', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tubepro_box_border', 'A7A7A7', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tubepro_box_bgcolor', 'FFFFFF', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tubepro_button_text_color', 'FFFFFF', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tubepro_button_rgba_color', '113,194,0', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tubepro_original_logo_height', '58', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tubepro_original_logo_width', '401', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tubepro_original_logo_image', 'images/logo.png', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tubepro_thumb_border_color', 'A7A7A7', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tubepro_links_color', '142E5A', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tubepro_font_color_2', '642A2A', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tubepro_body_bgcolor', 'FFFFFF', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tubepro_menu_links_color', 'FFFFFF', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tubepro_body_font_color', '494949', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tubepro_menu_active_color', 'b22100', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tubepro_bar_color', '3A75CC', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'tubepro_header_bg_color', 'FFFFFF', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'memcache_enabled', '0', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'memcache_server', 'localhost', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'memcache_port', '11211', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'memcache_expires', '30', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'default_player_secure_streaming', '0', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'default_player_limit_bw', '1', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'default_player_limit_bw_kbps', '100', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'flvtool2_installed', '0', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'qtfaststart_installed', '0', 1);
INSERT INTO `settings` (`id`, `type`, `name`, `value`, `parent`) VALUES('', 'settings', 'atomicparsley_installed', '0', 1);




CREATE TABLE IF NOT EXISTS `sources` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(70) NOT NULL,
  `label` varchar(50) NOT NULL,
  `url` varchar(255) NOT NULL,
  `player_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS `stats` (
  `date` date NOT NULL,
  `ip` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `raw` int(11) NOT NULL COMMENT 'Raw visits of the date',
  KEY `date` (`date`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `stats_raw` (
  `date` date NOT NULL,
  `ip` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  KEY `date_ip_userid` (`date`,`ip`,`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `translations` (
  `video_id` int(10) unsigned NOT NULL,
  `lang_id` int(10) unsigned NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  UNIQUE KEY `video_lang` (`video_id`,`lang_id`),
  KEY `video_id` (`video_id`),
  KEY `lang_id` (`lang_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='This table will save the translations of titles and descriptions.';

CREATE TABLE IF NOT EXISTS `updates` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `version` varchar(15) NOT NULL,
  `date` int(10) unsigned NOT NULL,
  `status` tinyint(3) unsigned NOT NULL COMMENT '0) Failed, 1) Successful',
  `results` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `version` (`version`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='Here we will log the automatic updates actions' ;

INSERT INTO `updates` (`id`, `version`, `date`, `status`, `results`) VALUES(1, '$version_number', '$time', 1, 'This version was manually installed.');

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(25) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(40) NOT NULL,
  `date_added` int(10) unsigned NOT NULL,
  `country` int(10) unsigned NOT NULL,
  `birthdate` int(10) unsigned NOT NULL,
  `gender` tinyint(4) unsigned NOT NULL COMMENT '0) Male, 1) Female',
  `avatar` varchar(255) NOT NULL,
  `premium_from_date` int(10) unsigned NOT NULL COMMENT 'Date when the users starts it\'s premium period',
  `premium_to_date` int(10) unsigned NOT NULL COMMENT 'Date when the users ends it\'s premium period',
  `last_visit` int(10) unsigned NOT NULL,
  `status` tinyint(1) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `username` (`username`(3)),
  KEY `email` (`email`(3))
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS `users_favorited` (
  `user_id` int(10) unsigned NOT NULL,
  `video_id` int(10) unsigned NOT NULL,
  UNIQUE KEY `user_video` (`user_id`,`video_id`),
  KEY `user_id` (`user_id`),
  KEY `video_id` (`video_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `users_voted` (
  `user_id` int(10) unsigned NOT NULL,
  `video_id` int(10) unsigned NOT NULL,
  KEY `user_id` (`user_id`),
  KEY `user_video` (`user_id`,`video_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `videos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ext_id` int(10) unsigned NOT NULL COMMENT 'external_id if applies',
  `ext_key` varchar(255) NOT NULL,
  `source` int(10) unsigned NOT NULL COMMENT '0) Added by Admin - N) Source Id',
  `premium` tinyint(1) unsigned NOT NULL COMMENT '0) Non Premium Video, 1) Premium Video',
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `tags` text NOT NULL,
  `rtmp_server` int(10) unsigned NOT NULL,
  `file` text NOT NULL COMMENT 'FLV url or path',
  `m4v_file` text NOT NULL,
  `mp4_file` text NOT NULL,
  `embed_code` text NOT NULL COMMENT 'Will be used only for direct use.',
  `preview_img` varchar(255) NOT NULL COMMENT 'Image that appears before the video plays',
  `player_id` int(10) unsigned NOT NULL COMMENT 'Id of players table',
  `preroll_img` varchar(255) NOT NULL,
  `preroll_link` varchar(255) NOT NULL DEFAULT '',
  `postroll_img` varchar(255) NOT NULL DEFAULT '',
  `postroll_link` varchar(255) NOT NULL DEFAULT '',
  `duration` int(10) unsigned NOT NULL COMMENT 'In seconds',
  `date_added` int(10) unsigned NOT NULL,
  `activation_date` int(10) unsigned NOT NULL,
  `deactivation_date` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL COMMENT 'Id of the user that submitted the video.',
  `views` int(10) unsigned NOT NULL,
  `favorited` int(10) unsigned NOT NULL COMMENT 'Times this video was favorited',
  `rating` decimal(10,2) unsigned NOT NULL,
  `votes` int(10) unsigned NOT NULL,
  `last_viewed` int(10) unsigned NOT NULL COMMENT 'timestamp of the last time viewed, to calculate \"Viewing now\" videos.',
  `status` tinyint(2) NOT NULL COMMENT '-1) Pending for Approval, 0) Inactive, 1) Active',
  `last_updated` int(10) unsigned NOT NULL,
  `cron_status` varchar(20) NOT NULL DEFAULT '0' COMMENT '0) Not Waiting, N) Waiting diferent combinations of actions.',
  `reported` tinyint(3) unsigned NOT NULL COMMENT '0) Not Reported, n) Reported N times. If reaches to 9, It will be autodeactivated.',
  `reported_reasons` text NOT NULL COMMENT 'Reason of reporting the video by the user.',
  `broken_flv` tinyint(1) unsigned NOT NULL COMMENT '0) Not Broken, 1) Broken',
  PRIMARY KEY (`id`),
  KEY `ext_id` (`ext_id`),
  KEY `ext_key` (`ext_key`(6)),
  KEY `source` (`source`),
  KEY `user_id` (`user_id`),
  KEY `rtmp_server` (`rtmp_server`),
  KEY `reported` (`reported`),
  KEY `player_id` (`player_id`),
  KEY `status` (`status`),
  KEY `premium` (`premium`),
  KEY `views_id` (`views`,`id`),
  KEY `rating_id` (`rating`,`votes`,`id`),
  KEY `duration_id` (`duration`,`id`),
  KEY `last_viewed_id` (`last_viewed`,`id`),
  KEY `title_id` (`title` (10),`id`),
  KEY `date_added_id` (`date_added`,`id`),
  KEY `activation_date_id` (`activation_date`,`id`),
  FULLTEXT KEY `title_tags` (`title`,`tags`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC ;

CREATE TABLE IF NOT EXISTS `videos_categories` (
  `video_id` int(10) unsigned NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  KEY `video_id` (`video_id`),
  KEY `category_id` (`category_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Videos Categories Link';

CREATE TABLE IF NOT EXISTS `videos_channels` (
  `video_id` int(10) unsigned NOT NULL,
  `channel_id` int(10) unsigned NOT NULL,
  KEY `video_id` (`video_id`),
  KEY `channel_id` (`channel_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `videos_thumbs` (
  `video_id` int(10) unsigned NOT NULL,
  `thumb` varchar(255) NOT NULL,
  `thumb_order` tinyint(3) unsigned NOT NULL,
  KEY `video_id` (`video_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `ccbill_txns` (
	`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
	`user_id` int(10) unsigned NOT NULL,
	`date` int(10) unsigned NOT NULL,
	`action` varchar(20) NOT NULL,
	`transaction_id` int(40) unsigned NOT NULL,
	`subscription_id` int(40) unsigned NOT NULL,
	`username` varchar(40) NOT NULL,
	`password` varchar(40) NOT NULL,
	`email` varchar(255) NOT NULL,
	`amount` decimal(10,4) NOT NULL,
	`currency` varchar(3) NOT NULL,
	`first_name` varchar(25) NOT NULL,
	`last_name` varchar(40) NOT NULL,
	`cardholder` varchar(100) NOT NULL,
	`address` varchar(150) NOT NULL,
	`zip_code` varchar(10) NOT NULL,
	`region` int(10) unsigned NOT NULL,
	`city` varchar(100) NOT NULL,
	`country` varchar(3) NOT NULL,
	`site_id` int(10) unsigned NOT NULL,
	`pricing_id` int(10) unsigned NOT NULL,
	`visitor_language` varchar(3) NOT NULL,
	`visitor_ip` varchar(15) NOT NULL,
	`cardhash` varchar(40) NOT NULL,
	`affiliate_id` varchar(25) NOT NULL,
	`affiliate_commision` varchar(20) NOT NULL,
	PRIMARY KEY (`id`),
	KEY `subscription_id` (`subscription_id`),
	KEY `email` (`email`),
	KEY `user_id` (`user_id`),
	KEY `transaction_id` (`transaction_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='CCBill Transactions';


CREATE TABLE IF NOT EXISTS `zombaio_txns` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `date` int(10) unsigned NOT NULL,
  `action` varchar(20) NOT NULL,
  `transaction_id` int(10) unsigned NOT NULL,
  `subscription_id` int(10) unsigned NOT NULL,
  `username` varchar(40) NOT NULL,
  `password` varchar(40) NOT NULL,
  `email` varchar(255) NOT NULL,
  `amount` decimal(10,4) NOT NULL,
  `currency` varchar(3) NOT NULL,
  `first_name` varchar(25) NOT NULL,
  `last_name` varchar(40) NOT NULL,
  `cardholder` varchar(100) NOT NULL,
  `address` varchar(150) NOT NULL,
  `zip_code` varchar(10) NOT NULL,
  `region` int(10) unsigned NOT NULL,
  `city` varchar(100) NOT NULL,
  `country` varchar(3) NOT NULL,
  `site_id` int(10) unsigned NOT NULL,
  `pricing_id` int(10) unsigned NOT NULL,
  `visitor_language` varchar(3) NOT NULL,
  `visitor_ip` varchar(15) NOT NULL,
  `cardhash` varchar(40) NOT NULL,
  `affiliate_id` varchar(25) NOT NULL,
  `affiliate_commision` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `subscription_id` (`subscription_id`),
  KEY `email` (`email`),
  KEY `user_id` (`user_id`),
  KEY `transaction_id` (`transaction_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Zombaio Transactions' AUTO_INCREMENT=1;
";

$aQueries=explode(";\n",$sql_contents);

foreach($aQueries as $query){
	if(trim($query)){
		mysql_query(trim($query)) or logText("installation_error_log.txt",mysql_error());
	}
}
