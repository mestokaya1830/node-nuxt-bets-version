-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 05, 2019 at 09:04 PM
-- Server version: 5.7.23
-- PHP Version: 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gasvet`
--

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `sp_activeinfo1`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_activeinfo1` (IN `u` VARCHAR(50), IN `s` CHAR(10))  READS SQL DATA
BEGIN
  SELECT COUNT(betref) AS activecount, SUM(amount) AS activeamount, SUM(earn) AS activeearn FROM betsummary WHERE user = u AND state = s;
END$$

DROP PROCEDURE IF EXISTS `sp_activeinfo2`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_activeinfo2` (IN `a` VARCHAR(50), IN `s` CHAR(10))  BEGIN
  SELECT COUNT(betref) AS activecount, SUM(amount) AS activeamount, SUM(earn) AS activeearn FROM betsummary WHERE admin = a AND state = s;
END$$

DROP PROCEDURE IF EXISTS `sp_activeinfo3`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_activeinfo3` (IN `u` VARCHAR(50), IN `s` CHAR(10))  READS SQL DATA
BEGIN
  SELECT COUNT(betref) AS activecount, SUM(amount) AS activeamount, SUM(earn) AS activeearn FROM betsummary WHERE user = u AND state = s;
END$$

DROP PROCEDURE IF EXISTS `sp_addbet1`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_addbet1` (IN `u` VARCHAR(50))  BEGIN
  SELECT credit, creditremain FROM users WHERE user = u;
END$$

DROP PROCEDURE IF EXISTS `sp_addbet2`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_addbet2` (IN `u` VARCHAR(50))  BEGIN
  SELECT user, admin, superadmin, creditremain FROM users WHERE user = u;
END$$

DROP PROCEDURE IF EXISTS `sp_betsum1`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_betsum1` (IN `u` VARCHAR(50))  READS SQL DATA
BEGIN
  SELECT * FROM betsummary WHERE user = u ORDER BY date DESC;
END$$

DROP PROCEDURE IF EXISTS `sp_betsum2`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_betsum2` (IN `u` VARCHAR(50), IN `s` CHAR(10))  READS SQL DATA
BEGIN
  SELECT * FROM betsummary WHERE user = u AND state = s ORDER BY date DESC;
END$$

DROP PROCEDURE IF EXISTS `sp_betsum3`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_betsum3` (IN `a` VARCHAR(50))  READS SQL DATA
BEGIN
  SELECT * FROM betsummary  WHERE admin = a  ORDER BY date DESC;
END$$

DROP PROCEDURE IF EXISTS `sp_betsum4`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_betsum4` (IN `a` VARCHAR(50), IN `s` CHAR(10))  READS SQL DATA
BEGIN
  SELECT * FROM betsummary  WHERE admin = a AND state = s  ORDER BY date DESC;
END$$

DROP PROCEDURE IF EXISTS `sp_betsum5`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_betsum5` (IN `a` VARCHAR(50))  READS SQL DATA
BEGIN
  SELECT * FROM betsummary  WHERE admin = a ORDER BY date DESC;
END$$

DROP PROCEDURE IF EXISTS `sp_betsum6`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_betsum6` (IN `u` VARCHAR(50), IN `s` CHAR(10))  READS SQL DATA
BEGIN
  SELECT * FROM betsummary  WHERE user = u AND state = s ORDER BY date DESC;
END$$

DROP PROCEDURE IF EXISTS `sp_betsumid`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_betsumid` (IN `b` INT(11))  READS SQL DATA
BEGIN
  SELECT tb.id, tb.betref, tb.code, tb.matches, tb.games, tb.options, tb.rate, tb.state, tb.stream, tb.branch , ts.score, ts.status, ts.minute FROM bets tb LEFT JOIN scores ts ON tb.code = ts.code WHERE tb.betref = b ORDER BY id DESC;
END$$

DROP PROCEDURE IF EXISTS `sp_bettotalinfo1`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_bettotalinfo1` (IN `u` VARCHAR(50))  READS SQL DATA
BEGIN
  Select COUNT(betref) AS count, SUM(amount) AS amount FROM betsummary WHERE user = u AND state != "Aktif" AND state != "iptal";
END$$

DROP PROCEDURE IF EXISTS `sp_bettotalinfo2`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_bettotalinfo2` (IN `u` VARCHAR(50), IN `s` CHAR(10))  BEGIN
 SELECT COUNT(betref) AS count, SUM(amount) AS amount, SUM(earn) AS earn FROM betsummary WHERE user = u AND state = s;
END$$

DROP PROCEDURE IF EXISTS `sp_bettotalinfo3`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_bettotalinfo3` (IN `u` VARCHAR(50), IN `s` CHAR(10))  BEGIN
 SELECT COUNT(betref) AS count, SUM(amount) AS amount FROM betsummary WHERE user = u AND state = s;
END$$

DROP PROCEDURE IF EXISTS `sp_bettotalinfo4`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_bettotalinfo4` (IN `a` VARCHAR(50))  BEGIN
  SELECT COUNT(betref) AS count, SUM(amount) AS amount FROM betsummary WHERE admin = a AND state != "Aktif" AND state != "iptal";
END$$

DROP PROCEDURE IF EXISTS `sp_bettotalinfo5`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_bettotalinfo5` (IN `a` VARCHAR(50), IN `s` CHAR(10))  BEGIN
  SELECT COUNT(betref) AS count, SUM(amount) AS amount, SUM(earn) AS earn FROM betsummary WHERE admin = a AND state = s;
END$$

DROP PROCEDURE IF EXISTS `sp_bettotalinfo6`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_bettotalinfo6` (IN `a` VARCHAR(50), IN `s` CHAR(10))  BEGIN
  SELECT COUNT(betref) AS count, SUM(amount) AS amount FROM betsummary WHERE admin = a AND state = s;
END$$

DROP PROCEDURE IF EXISTS `sp_creditinfo1`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_creditinfo1` (IN `u` VARCHAR(50))  BEGIN
  SELECT credit, creditused, creditremain FROM users WHERE user = u;
END$$

DROP PROCEDURE IF EXISTS `sp_creditinfo2`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_creditinfo2` (IN `a` VARCHAR(50))  BEGIN
  SELECT SUM(credit) AS creditsum, SUM(creditused) AS creditusedsum, SUM(creditremain) AS creditremainsum FROM users WHERE admin = a;
END$$

DROP PROCEDURE IF EXISTS `sp_creditinfo3`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_creditinfo3` (IN `u` VARCHAR(50))  BEGIN
  SELECT credit, creditused, creditremain FROM users WHERE user = u;
END$$

DROP PROCEDURE IF EXISTS `sp_limit`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_limit` (IN `u` VARCHAR(50))  BEGIN
  SELECT user, admin, minms, maxms, minkm, maxkm, maxrate, maxkis, maxkisremain, cminms, cmaxms, cminkm, cmaxkm FROM limitsettings WHERE user = u;
END$$

DROP PROCEDURE IF EXISTS `sp_time`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_time` (IN `u` VARCHAR(50))  BEGIN
  SELECT user, admin, ilkcba, ilkcbk, ikicba, ikicbk, sa, sk FROM timesettings WHERE user = u;
END$$

DROP PROCEDURE IF EXISTS `sp_totalinfo1`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_totalinfo1` (IN `u` VARCHAR(50))  BEGIN
 SELECT COUNT(betref) AS totalcount, SUM(amount) AS totalamount, SUM(earn) AS totalearn FROM betsummary WHERE user = u AND state != 'iptal';
END$$

DROP PROCEDURE IF EXISTS `sp_totalinfo2`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_totalinfo2` (IN `a` VARCHAR(50))  READS SQL DATA
BEGIN
 SELECT COUNT(betref) AS totalcount, SUM(amount) AS totalamount, SUM(earn) AS totalearn FROM betsummary WHERE admin = a AND state != 'iptal';
END$$

DROP PROCEDURE IF EXISTS `sp_userlist`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_userlist` (IN `a` VARCHAR(50))  BEGIN
  SELECT user FROM users WHERE admin = a;
END$$

DROP PROCEDURE IF EXISTS `sp_users`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_users` (IN `a` VARCHAR(50))  BEGIN
  SELECT user, role, admin, credit, creditremain, state, userlimit, remain, payment FROM users WHERE admin = a ORDER BY user;
END$$

DROP PROCEDURE IF EXISTS `sp_wonlostinfo1`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_wonlostinfo1` (IN `u` VARCHAR(50), IN `s` CHAR(10))  BEGIN
 SELECT COUNT(betref) AS woncount, SUM(amount) AS wonamount, SUM(earn) AS wonearn FROM betsummary WHERE user = u AND state = s;
END$$

DROP PROCEDURE IF EXISTS `sp_wonlostinfo2`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_wonlostinfo2` (IN `a` VARCHAR(50), IN `s` CHAR(10))  READS SQL DATA
BEGIN
 SELECT COUNT(betref) AS woncount, SUM(amount) AS wonamount, SUM(earn) AS wonearn FROM betsummary WHERE admin = a AND state = s;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `bets`
--

DROP TABLE IF EXISTS `bets`;
CREATE TABLE IF NOT EXISTS `bets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `betref` int(11) NOT NULL,
  `code` char(4) COLLATE utf8_turkish_ci NOT NULL,
  `user` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `admin` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `superadmin` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `matches` varchar(100) COLLATE utf8_turkish_ci NOT NULL,
  `games` varchar(100) COLLATE utf8_turkish_ci NOT NULL,
  `options` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `rate` float(5,2) UNSIGNED NOT NULL,
  `state` varchar(10) COLLATE utf8_turkish_ci NOT NULL,
  `stream` char(6) COLLATE utf8_turkish_ci NOT NULL,
  `branch` char(2) COLLATE utf8_turkish_ci NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `scoreid` int(11) UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `betref` (`betref`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Dumping data for table `bets`
--

INSERT INTO `bets` (`id`, `betref`, `code`, `user`, `admin`, `superadmin`, `matches`, `games`, `options`, `rate`, `state`, `stream`, `branch`, `date`, `scoreid`) VALUES
(1, 97720, '8510', 'hamit', 'sami', 'ali', 'Real Murcia v Tudelano', 'Maç Sonu', 'Beraberlik', 3.00, 'Aktif', 'Canlı', 'F', '2019-12-05 19:35:33', 0),
(2, 82973, '6379', 'hamit', 'sami', 'ali', 'SV Hemelingen v Habenhauser FV', 'Maç Sonu ve Alt/Üst', 'Alt  2.5', 8.00, 'Aktif', 'Canlı', 'F', '2019-12-05 19:35:47', 0),
(3, 57553, '781', 'hamit', 'sami', 'ali', 'Albacete - Extremadura', 'Çifte Şans', 'X2', 1.73, 'Aktif', 'Bülten', 'F', '2019-12-05 19:36:01', 0),
(4, 35159, '781', 'hamit', 'sami', 'ali', 'Albacete - Extremadura', 'Maç Sonu', '1', 2.05, 'Aktif', 'Bülten', 'F', '2019-12-05 19:36:08', 0),
(5, 80210, '9859', 'hamit', 'sami', 'ali', 'At. Pulpileno v CF Lorca Deportiva', 'Maç Sonu', 'Beraberlik', 2.88, 'Aktif', 'Canlı', 'F', '2019-12-05 19:36:22', 0),
(6, 75182, '5778', 'selim', 'sami', 'ali', 'Rot-Weiss Essen v SV Burgaltendorf 1913', 'Asian Handicap (4-1)', 'SV Burgaltendorf 1913  +2.0,+2.5', 1.90, 'Aktif', 'Canlı', 'F', '2019-12-05 19:36:47', 0),
(7, 38386, '5778', 'selim', 'sami', 'ali', 'Rot-Weiss Essen v SV Burgaltendorf 1913', 'İkinci Yarı Kazananı', 'Rot-Weiss Essen', 1.10, 'Aktif', 'Canlı', 'F', '2019-12-05 19:36:56', 0),
(8, 28610, '405', 'selim', 'sami', 'ali', 'Sassuolo Women - CF Florentia Women', 'Çifte Şans', 'X2', 1.67, 'Aktif', 'Bülten', 'F', '2019-12-05 19:37:11', 0),
(9, 18438, '637', 'selim', 'sami', 'ali', 'St George Cospicua - Swieqi Utd', 'Beraberlikte İade', 'St George Cospicua', 2.38, 'Aktif', 'Bülten', 'F', '2019-12-05 19:37:23', 0),
(10, 9361, '637', 'selim', 'sami', 'ali', 'St George Cospicua - Swieqi Utd', 'Maç Sonu', '2', 2.00, 'Aktif', 'Bülten', 'F', '2019-12-05 19:37:30', 0);

-- --------------------------------------------------------

--
-- Table structure for table `betshistory`
--

DROP TABLE IF EXISTS `betshistory`;
CREATE TABLE IF NOT EXISTS `betshistory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `betref` int(11) NOT NULL,
  `code` char(4) COLLATE utf8_turkish_ci NOT NULL,
  `user` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `admin` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `superadmin` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `matches` varchar(100) COLLATE utf8_turkish_ci NOT NULL,
  `games` varchar(100) COLLATE utf8_turkish_ci NOT NULL,
  `options` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `rate` float(5,2) UNSIGNED NOT NULL,
  `state` varchar(10) COLLATE utf8_turkish_ci NOT NULL,
  `stream` char(6) COLLATE utf8_turkish_ci NOT NULL,
  `branch` char(2) COLLATE utf8_turkish_ci NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `scoreid` int(11) UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `betsummary`
--

DROP TABLE IF EXISTS `betsummary`;
CREATE TABLE IF NOT EXISTS `betsummary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `betref` int(11) NOT NULL,
  `user` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `admin` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `superadmin` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `betscount` tinyint(2) UNSIGNED NOT NULL,
  `betscountremain` tinyint(2) UNSIGNED NOT NULL,
  `amount` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `rate` float(5,2) UNSIGNED NOT NULL,
  `earn` float(7,2) UNSIGNED NOT NULL,
  `owner` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `state` varchar(20) COLLATE utf8_turkish_ci NOT NULL,
  `payment` char(3) COLLATE utf8_turkish_ci NOT NULL DEFAULT 'no',
  PRIMARY KEY (`id`),
  UNIQUE KEY `betref` (`betref`),
  KEY `user` (`user`),
  KEY `admin` (`admin`),
  KEY `state` (`state`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Dumping data for table `betsummary`
--

INSERT INTO `betsummary` (`id`, `betref`, `user`, `admin`, `superadmin`, `date`, `betscount`, `betscountremain`, `amount`, `rate`, `earn`, `owner`, `state`, `payment`) VALUES
(1, 97720, 'hamit', 'sami', 'ali', '2019-12-05 19:35:33', 1, 1, 5, 3.00, 15.00, '', 'Aktif', 'no'),
(2, 82973, 'hamit', 'sami', 'ali', '2019-12-05 19:35:47', 1, 1, 10, 8.00, 80.00, '', 'Aktif', 'no'),
(3, 57553, 'hamit', 'sami', 'ali', '2019-12-05 19:36:01', 1, 1, 5, 1.73, 8.65, '', 'Aktif', 'no'),
(4, 35159, 'hamit', 'sami', 'ali', '2019-12-05 19:36:08', 1, 1, 10, 2.05, 20.50, '', 'Aktif', 'no'),
(5, 80210, 'hamit', 'sami', 'ali', '2019-12-05 19:36:22', 1, 1, 10, 2.88, 28.80, '', 'Aktif', 'no'),
(6, 75182, 'selim', 'sami', 'ali', '2019-12-05 19:36:47', 1, 1, 10, 1.90, 19.00, '', 'Aktif', 'no'),
(7, 38386, 'selim', 'sami', 'ali', '2019-12-05 19:36:56', 1, 1, 5, 1.10, 5.50, '', 'Aktif', 'no'),
(8, 28610, 'selim', 'sami', 'ali', '2019-12-05 19:37:11', 1, 1, 5, 1.67, 8.35, '', 'Aktif', 'no'),
(9, 18438, 'selim', 'sami', 'ali', '2019-12-05 19:37:23', 1, 1, 5, 2.38, 11.90, '', 'Aktif', 'no'),
(10, 9361, 'selim', 'sami', 'ali', '2019-12-05 19:37:30', 1, 1, 10, 2.00, 20.00, '', 'Aktif', 'no');

-- --------------------------------------------------------

--
-- Table structure for table `betsummaryhistory`
--

DROP TABLE IF EXISTS `betsummaryhistory`;
CREATE TABLE IF NOT EXISTS `betsummaryhistory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `betref` int(11) NOT NULL,
  `user` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `admin` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `superadmin` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `betscount` tinyint(2) UNSIGNED NOT NULL,
  `betscountremain` tinyint(2) UNSIGNED NOT NULL,
  `amount` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `rate` float(5,2) UNSIGNED NOT NULL,
  `earn` float(7,2) UNSIGNED NOT NULL,
  `owner` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `state` varchar(20) COLLATE utf8_turkish_ci NOT NULL,
  `payment` char(3) COLLATE utf8_turkish_ci NOT NULL DEFAULT 'no',
  PRIMARY KEY (`id`),
  UNIQUE KEY `betref` (`betref`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `creditlog`
--

DROP TABLE IF EXISTS `creditlog`;
CREATE TABLE IF NOT EXISTS `creditlog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `admin` varchar(50) COLLATE utf8_turkish_ci NOT NULL DEFAULT 'no',
  `superadmin` varchar(50) COLLATE utf8_turkish_ci NOT NULL DEFAULT 'no',
  `date` timestamp NOT NULL,
  `amount` float UNSIGNED NOT NULL,
  `creditremain` float UNSIGNED NOT NULL,
  `ope` varchar(20) COLLATE utf8_turkish_ci NOT NULL,
  `des` varchar(20) COLLATE utf8_turkish_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user` (`user`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Dumping data for table `creditlog`
--

INSERT INTO `creditlog` (`id`, `user`, `admin`, `superadmin`, `date`, `amount`, `creditremain`, `ope`, `des`) VALUES
(4, 'hamit', 'sami', 'ali', '2019-12-05 01:01:58', 9000, 9000, 'Kredi', 'Kayit'),
(5, 'selim', 'sami', 'ali', '2019-12-05 01:02:17', 9000, 9000, 'Kredi', 'Kayit'),
(6, 'hamit', 'sami', 'ali', '2019-12-05 19:35:35', 5, 8995, 'Eksildi', 'Kupon'),
(7, 'hamit', 'sami', 'ali', '2019-12-05 19:35:49', 10, 8985, 'Eksildi', 'Kupon'),
(8, 'hamit', 'sami', 'ali', '2019-12-05 19:36:03', 5, 8980, 'Eksildi', 'Kupon'),
(9, 'hamit', 'sami', 'ali', '2019-12-05 19:36:09', 10, 8970, 'Eksildi', 'Kupon'),
(10, 'hamit', 'sami', 'ali', '2019-12-05 19:36:24', 10, 8960, 'Eksildi', 'Kupon'),
(11, 'selim', 'sami', 'ali', '2019-12-05 19:36:49', 10, 8990, 'Eksildi', 'Kupon'),
(12, 'selim', 'sami', 'ali', '2019-12-05 19:36:58', 5, 8985, 'Eksildi', 'Kupon'),
(13, 'selim', 'sami', 'ali', '2019-12-05 19:37:13', 5, 8980, 'Eksildi', 'Kupon'),
(14, 'selim', 'sami', 'ali', '2019-12-05 19:37:25', 5, 8975, 'Eksildi', 'Kupon'),
(15, 'selim', 'sami', 'ali', '2019-12-05 19:37:32', 10, 8965, 'Eksildi', 'Kupon');

-- --------------------------------------------------------

--
-- Table structure for table `leagues`
--

DROP TABLE IF EXISTS `leagues`;
CREATE TABLE IF NOT EXISTS `leagues` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `hamit` tinyint(1) DEFAULT '1',
  `selim` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Dumping data for table `leagues`
--

INSERT INTO `leagues` (`id`, `name`, `hamit`, `selim`) VALUES
(82, 'İspanya Tercera Group 1', 1, 1),
(181, 'İspanya Tercera Group 2', 1, 1),
(301, 'İspanya Tercera Group 7', 1, 1),
(384, 'İspanya Tercera Group 8', 1, 1),
(444, 'İspanya Tercera Group 9', 1, 1),
(462, 'İspanya Tercera Group 10', 1, 1),
(501, 'İspanya Tercera Group 11', 1, 1),
(610, 'İspanya Tercera Group 16', 1, 1),
(611, 'İspanya Tercera Group 17', 1, 1),
(612, 'İspanya Youth Ligi', 1, 1),
(618, 'İskoçya Kadınlar FA Kupası', 1, 1),
(623, 'İtalya Serie C Group B', 1, 1),
(624, 'Portekiz Campeonato Nacional', 1, 1),
(626, 'İtalya Serie C Group C', 1, 1),
(631, 'İspanya Tercera Group 18', 1, 1),
(633, 'Şili Primera Division', 1, 1),
(634, 'Peru Primera Division', 1, 1),
(635, 'Kosta Rika Segunda', 1, 1),
(636, 'Brezilya U20 Ligi', 1, 1),
(637, 'Guatemala Primera Division', 1, 1),
(644, 'Kolombiya Primera A', 1, 1),
(646, 'Şili Tercera', 1, 1),
(648, 'Peru Reserve Ligi', 1, 1),
(649, 'Amerika UPSL', 1, 1),
(658, 'Nikaraguay Youth Ligi', 1, 1),
(659, 'Nikaraguay Apertura', 1, 1),
(660, 'Sırbistan U19 Ligi', 1, 1),
(662, 'Portekiz Kupası', 1, 1),
(663, 'El Salvador Apertura', 1, 1),
(664, 'Ermenistan Premier Ligi', 1, 1),
(665, 'Meksika U20 Ligi', 1, 1),
(667, 'Sudi Arabistan Premier Ligi', 1, 1),
(669, 'Hırvatistan 1.HNL', 1, 1),
(670, 'Polonya Ekstraklasa', 1, 1),
(671, 'Sırbistan Super Liga', 1, 1),
(675, 'Arnavutluk Şampiyonlar Ligi', 1, 1),
(679, 'Marutanya Division 1', 1, 1),
(684, 'İsviçre Challenge Ligi', 1, 1),
(696, 'Meksika Apertura', 1, 1),
(697, 'Aruba Division Di Honor', 1, 1),
(698, 'Ekvator Campeonato Ulusal', 1, 1),
(699, 'Kenya Premier Ligi', 1, 1),
(709, 'Macaristan NB I', 1, 1),
(710, 'Kıbrıs Division 1', 1, 1),
(711, 'Norveç Eliteserien', 1, 1),
(715, 'Guatemala Liga Ulusal', 1, 1),
(716, 'Dominik Cumhuriyeti Liga', 1, 1),
(717, 'Ekvator Primera B', 1, 1),
(718, 'Barbados Super Kupası', 1, 1),
(719, 'Macaristan NB II', 1, 1),
(721, 'Bahrain Premier Ligi', 1, 1),
(722, 'Mali Premiere Division', 1, 1),
(726, 'Togo Premier Division', 1, 1),
(727, 'Fildişi Sahili Premier Division', 1, 1),
(728, 'Peru', 1, 1),
(732, 'Nijerya Premier Ligi', 1, 1),
(735, 'Senegal Şampiyonlar Challenge', 1, 1),
(736, 'Norveç Toppserien Kadınlar Qual', 1, 1),
(737, 'Kosta Rika Play-Offs', 1, 1),
(738, 'Papua Kupası', 1, 1),
(10036537, 'İngiltere Ligi 1', 1, 1),
(10036538, 'İspanya Segunda', 1, 1),
(10036539, 'İspanya Segunda B Group 1', 1, 1),
(10036540, 'İspanya Segunda B Group 3', 1, 1),
(10036543, 'İspanya Tercera Group 3', 1, 1),
(10036544, 'İspanya Tercera Group 4', 1, 1),
(10036545, 'İspanya Tercera Group 5', 1, 1),
(10036546, 'İspanya Tercera Group 6', 1, 1),
(10036551, 'İspanya Tercera Group 12', 1, 1),
(10036552, 'İspanya Tercera Group 13', 1, 1),
(10036553, 'İspanya Tercera Group 14', 1, 1),
(10036554, 'İspanya Tercera Group 15', 1, 1),
(10036558, 'İspanya Primera Kadınlar', 1, 1),
(10036564, 'Almanya Oberliga Bremen', 1, 1),
(10036571, 'Hollanda Eerste Divisie', 1, 1),
(10036574, 'Polonya II Liga', 1, 1),
(10036578, 'Afrika Güney Diski Challenge', 1, 1),
(10036580, 'Türkiye 2 Lig Beyaz', 1, 1),
(10036582, 'Türkiye 3.Lig Group 1', 1, 1),
(10036583, 'Türkiye 3.Lig Group 2', 1, 1),
(10036586, 'İngiltere U23 Development Ligi', 1, 1),
(10036587, 'İngiltere Super Ligi Kadınlar', 1, 1),
(10036934, 'Çin Super Ligi', 1, 1),
(10036994, 'U23 Uluslararası', 1, 1),
(10037048, 'Türkiye 3.Lig Group 3', 1, 1),
(10037051, 'Romanya Liga II', 1, 1),
(10037109, 'Avrupa Dostluk Maçları', 1, 1),
(10037118, 'Almanya Bundesliga II Kadınlar', 1, 1),
(10037142, 'Malawi Super Ligi', 1, 1),
(10037169, 'italya Serie D', 1, 1),
(10037174, 'Dünya Kulüpler Dostluk Maçları', 1, 1),
(10037180, 'Fransa U19 Ligi', 1, 1),
(10037183, 'İtalya Serie C Group A', 1, 1),
(10037184, 'Almanya Oberliga Hessen', 1, 1),
(10037189, 'Almanya Oberliga Niedersachsen', 1, 1),
(10037195, 'Rwanda Ulusal Ligi', 1, 1),
(10037198, 'Almanya Ulusalliga South West', 1, 1),
(10037213, 'Uganda Premier Ligi', 1, 1),
(10037224, 'Slovenia 2. SNL', 1, 1),
(10037270, 'Portekiz Campeonato Nacional Kadınlar', 1, 1),
(10037285, 'Belçika First Division B', 1, 1),
(10037290, 'Brezilya Maçları', 1, 1),
(10037291, 'İngiltere FA Trophy', 1, 1),
(10037320, 'İspanya Segunda B Group 2', 1, 1),
(10037321, 'İspanya Segunda B Group 4', 1, 1),
(10037333, 'Venezuela Primera Division', 1, 1),
(10037409, 'Meksika Liga MX Femenil', 1, 1),
(10037425, 'Brezilya Copa Nordeste U20', 1, 1),
(10037428, 'Peru Segunda', 1, 1),
(10037430, 'Arjantin Şampiyonlar Ligi Kadınlar', 1, 1),
(10037432, 'Arjantin Primera B Metropolitana', 1, 1),
(10037434, 'Arjantin Primera C Metropolitana', 1, 1),
(10037435, 'Arjantin Ulusal B', 1, 1),
(10037440, 'Brezilya Serie A', 1, 1),
(10037444, 'Arjantin Torneo A', 1, 1),
(10037464, 'Jamaica Premier Ligi', 1, 1),
(10037542, 'Endenozya Liga 3', 1, 1),
(10037653, 'Hollanda Reserve Ligi', 1, 1),
(10040082, 'Arjantin Primera D Metropolitana', 1, 1),
(10040085, 'İngiltere Southern Ligi Division One', 1, 1),
(10040087, 'İrlanda Cum Leinster Senior Ligi', 1, 1),
(10040100, 'Brezilya Serie B', 1, 1),
(10040255, 'İsrail Liga Bet South', 1, 1),
(10040344, 'Uruguay Segunda B Ulusal', 1, 1),
(10040350, 'Avusturya Amateur Kupası', 1, 1),
(10040380, 'İngiltere EFL Trophy', 1, 1),
(10040381, 'İngiltere Ulusal Ligi', 1, 1),
(10040382, 'İngiltere Isthmian Premier Division', 1, 1),
(10040386, 'İngiltere Isthmian Kupası', 1, 1),
(10040387, 'İngiltere Southern Premier Ligi Central', 1, 1),
(10040388, 'İngiltere Southern Premier Ligi South', 1, 1),
(10040508, 'Hong Kong Reserve Division', 1, 1),
(10040520, 'Slovakya Youth Ligi', 1, 1),
(10040528, 'İran Kupası', 1, 1),
(10040553, 'Arjantin Reserve Ligi', 1, 1),
(10040735, 'Danimarka U19 Ligi', 1, 1),
(10040747, 'İngiltere U23 Premier Ligi Kupası', 1, 1),
(10040762, 'Mısır Division 1', 1, 1),
(10040771, 'Botswana Premier Ligi', 1, 1),
(10040882, 'Avusturalya A-Lig', 1, 1),
(10040912, 'Türkiye U19 Ligi', 1, 1),
(10040971, 'Makedonya First Ligi', 1, 1),
(10040977, 'Bulgaristan B PFG', 1, 1),
(10040979, 'Hırvatistan U19 Ligi', 1, 1),
(10040987, 'Filistin West Bank Ligi', 1, 1),
(10041006, 'Bulgaristan First Ligi', 1, 1),
(10041018, 'Romanya Liga I', 1, 1),
(10041036, 'Polonya I Liga', 1, 1),
(10041040, 'Türkiye 1 Lig', 1, 1),
(10041042, 'Ukrayna Vyscha Liga', 1, 1),
(10041045, 'Fransa National', 1, 1),
(10041046, 'Malta Premier Ligi', 1, 1),
(10041048, 'Bosna Hersek & Herzegovina Premier Liga', 1, 1),
(10041051, 'Rusya Premier Ligi', 1, 1),
(10041052, 'Almanya Bundesliga II', 1, 1),
(10041058, 'Danimarka Süperligien', 1, 1),
(10041067, 'Almanya 3.Liga', 1, 1),
(10041075, 'Avusturya 2. Liga', 1, 1),
(10041077, 'Türkiye Super Lig', 1, 1),
(10041083, 'Fransa Ligue 2', 1, 1),
(10041088, 'İngiltere Premier Ligi 2', 1, 1),
(10041089, 'Belçika Super Ligi Kadınlar', 1, 1),
(10041094, 'İskoçya FA Kupası', 1, 1),
(10041095, 'Almanya Bundesliga I', 1, 1),
(10041096, 'Belçika First Division A', 1, 1),
(10041100, 'Fransa Ligue 1', 1, 1),
(10041101, 'İngiltere Şampiyonlar Ligi', 1, 1),
(10041105, 'İrlanda Cum FAI Intermediate Kupası', 1, 1),
(10041107, 'İrlanda Kuzey Premier', 1, 1),
(10041109, 'İtalya Serie B', 1, 1),
(10041110, 'İspanya Primera Liga', 1, 1),
(10041115, 'Bolivya Clausura', 1, 1),
(10041116, 'Ekvator Reserve Ligi', 1, 1),
(10041125, 'Arjantin Süperligi', 1, 1),
(10041134, 'Paraguay Division Profesional', 1, 1),
(10041211, 'Yunanistan Super Ligi U19', 1, 1),
(10041282, 'İngiltere Premier Ligi', 1, 1),
(10041293, 'Zambia Super Ligi', 1, 1),
(10041304, 'Slovenia Prva Liga', 1, 1),
(10041307, 'Çek Cumhuriyeti First Ligi', 1, 1),
(10041315, 'İtalya Serie A', 1, 1),
(10041318, 'Tanzanya Premier Ligi', 1, 1),
(10041333, 'İskoçya Ligi One', 1, 1),
(10041334, 'İskoçya Şampiyonlar Ligi', 1, 1),
(10041335, 'İskoçya Premiership', 1, 1),
(10041336, 'İngiltere Ligi 2', 1, 1),
(10041355, 'Avusturya Bundesliga', 1, 1),
(10041356, 'Slovakya Super Liga', 1, 1),
(10041368, 'Fransa National 2', 1, 1),
(10041374, 'Fransa National 3', 1, 1),
(10041391, 'Hollanda Eredivisie', 1, 1),
(10041396, 'Yunanistan Super Ligi 1', 1, 1),
(10041398, 'Luxembourg Division Ulusale', 1, 1),
(10041401, 'İsviçre Super Ligi', 1, 1),
(10041407, 'Belçika First Amateur Division', 1, 1),
(10041479, 'Hırvatistan 3.HNL', 1, 1),
(10041525, 'Hindistan Super Ligi', 1, 1),
(10041527, 'Fas GNF 1', 1, 1),
(10041561, 'Kolombiya U20 Ligi', 1, 1),
(10041643, 'Mısır Division 2', 1, 1),
(10041663, 'Belçika Reserve Ligi', 1, 1),
(10041668, 'İngiltere Northern Ligi Challenge Kupası', 1, 1),
(10041743, 'UEFA Youth Ligi', 1, 1),
(10041809, 'UEFA Şampiyonlar Ligi', 1, 1),
(10041823, 'İngiltere County Kupası', 1, 1),
(10041892, 'Sudan Ligi', 1, 1),
(10041896, 'İsviçre Division 1 Kadınlar', 1, 1),
(10041897, 'Afrika Güney Premier', 1, 1),
(10042001, 'Uruguay U19 Ligi', 1, 1),
(10042023, 'Yunanistan Super Ligi 2', 1, 1),
(10042034, 'iskoçya Lowland Ligi', 1, 1),
(10042035, 'Portekiz Primeira Liga', 1, 1),
(10042094, 'iskoçya Highland Ligi', 1, 1),
(10042095, 'iskoçya Ligi Two', 1, 1),
(10042122, 'Antigua & Barbuda Premier Division', 1, 1),
(10042183, 'San Marino Kupası', 1, 1),
(10042267, 'İskoçya Reserve Ligi', 1, 1),
(10042284, 'Hollanda Youth Eredivisie', 1, 1),
(10042491, 'Danimarka Kupası', 1, 1),
(10042496, 'İspanya Kupa de Catalunya', 1, 1),
(10042498, 'İngiltere North West Counties Ligi', 1, 1),
(10042626, 'Galler Şampiyonlar Ligi South', 1, 1),
(10042628, 'Trinidad & Tobago Ligi Kupası', 1, 1),
(10042669, 'Hindistan Bangalore Super Division', 1, 1),
(10042671, 'AFC U19 Şampiyonlar Ligis', 1, 1),
(10042706, 'Norveç Division 1 Play-Offs', 1, 1),
(10042711, 'Belçika Division 1 Kadınlar', 1, 1),
(10043035, 'Kadınlar U23 Uluslararası', 1, 1),
(10043156, 'ingiltere FA Kupası', 1, 1),
(10043267, 'Curacao Ligi', 1, 1),
(10043583, 'Sudi Arabistan Youth Ligi', 1, 1),
(10043595, 'İngiltere Northern Ligi Division One', 1, 1),
(10043605, 'Luxembourg Promotion D’Honneur', 1, 1),
(10043754, 'İngiltere Isthmian Division One South', 1, 1),
(10043828, 'Dünya Soccer Dünya Kupası - 36 mins play', 1, 1),
(10043872, 'İrlanda Kuzey Amateur Kupası', 1, 1),
(10043963, 'South East Asyan Games', 1, 1),
(10044140, 'izlanda U19 Kupası', 1, 1),
(110040307, 'Sudi Arabistan Division', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `limitsettings`
--

DROP TABLE IF EXISTS `limitsettings`;
CREATE TABLE IF NOT EXISTS `limitsettings` (
  `user` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `admin` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `superadmin` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `minms` tinyint(3) UNSIGNED DEFAULT '0',
  `maxms` tinyint(3) UNSIGNED DEFAULT '0',
  `minkm` tinyint(3) UNSIGNED DEFAULT '3',
  `maxkm` mediumint(6) UNSIGNED DEFAULT '0',
  `maxrate` smallint(5) UNSIGNED DEFAULT '0',
  `maxkis` tinyint(3) UNSIGNED DEFAULT '10',
  `maxkisremain` tinyint(3) UNSIGNED DEFAULT '0',
  `cminms` tinyint(2) UNSIGNED DEFAULT '0',
  `cmaxms` tinyint(2) UNSIGNED DEFAULT '0',
  `cminkm` tinyint(3) UNSIGNED DEFAULT '0',
  `cmaxkm` mediumint(9) UNSIGNED DEFAULT '0',
  PRIMARY KEY (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Dumping data for table `limitsettings`
--

INSERT INTO `limitsettings` (`user`, `admin`, `superadmin`, `minms`, `maxms`, `minkm`, `maxkm`, `maxrate`, `maxkis`, `maxkisremain`, `cminms`, `cmaxms`, `cminkm`, `cmaxkm`) VALUES
('hamit', 'sami', 'ali', 0, 0, 3, 0, 0, 10, 0, 0, 0, 0, 0),
('selim', 'sami', 'ali', 0, 0, 3, 0, 0, 10, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `liveleagues`
--

DROP TABLE IF EXISTS `liveleagues`;
CREATE TABLE IF NOT EXISTS `liveleagues` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `hamit` tinyint(1) DEFAULT '1',
  `selim` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Dumping data for table `liveleagues`
--

INSERT INTO `liveleagues` (`id`, `name`, `hamit`, `selim`) VALUES
(0, 'Panama First Division Kadınlar', 1, 1),
(9, 'İspanya Segunda B Group 1', 1, 1),
(12, 'İspanya Segunda B Group 2', 1, 1),
(24, 'İspanya Segunda B Group 3', 1, 1),
(82, 'İspanya Tercera Group 1', 1, 1),
(89, 'ispanya Tercera', 1, 1),
(181, 'İspanya Tercera Group 2', 1, 1),
(208, 'İspanya Tercera Group 3', 1, 1),
(211, 'İspanya Tercera Group 4', 1, 1),
(271, 'İspanya Tercera Group 5', 1, 1),
(274, 'İspanya Tercera Group 6', 1, 1),
(301, 'İspanya Tercera Group 7', 1, 1),
(384, 'İspanya Tercera Group 8', 1, 1),
(444, 'İspanya Tercera Group 9', 1, 1),
(462, 'İspanya Tercera Group 10', 1, 1),
(501, 'İspanya Tercera Group 11', 1, 1),
(564, 'İspanya Tercera Group 12', 1, 1),
(573, 'İspanya Tercera Group 13', 1, 1),
(600, 'İspanya Tercera Group 14', 1, 1),
(609, 'İspanya Tercera Group 15', 1, 1),
(610, 'İspanya Tercera Group 16', 1, 1),
(611, 'İspanya Tercera Group 17', 1, 1),
(612, 'İspanya Youth Ligi', 1, 1),
(613, 'İspanya Primera Kadınlar', 1, 1),
(614, 'Almanya Oberliga Bremen', 1, 1),
(617, 'İngiltere Super Ligi Kadınlar', 1, 1),
(618, 'İskoçya Kadınlar FA Kupası', 1, 1),
(620, 'Dünya Kulüpler Dostluk Maçları', 1, 1),
(622, 'Almanya Oberliga Hessen', 1, 1),
(623, 'İtalya Serie C Group B', 1, 1),
(624, 'Portekiz Campeonato Ulusal', 1, 1),
(626, 'İtalya Serie C Group C', 1, 1),
(627, 'Belçika First Division B', 1, 1),
(630, 'İspanya Segunda B Group 4', 1, 1),
(631, 'İspanya Tercera Group 18', 1, 1),
(633, 'Şili Primera Division', 1, 1),
(634, 'Peru Primera Division', 1, 1),
(635, 'Kosta Rika Segunda', 1, 1),
(636, 'Brezilya U20 Ligi', 1, 1),
(637, 'Guatemala Primera Division', 1, 1),
(644, 'Kolombiya Primera A', 1, 1),
(646, 'Şili Tercera', 1, 1),
(648, 'Peru Reserve Ligi', 1, 1),
(649, 'Amerika UPSL', 1, 1),
(658, 'Nikaraguay Youth Ligi', 1, 1),
(659, 'Nikaraguay Apertura', 1, 1),
(660, 'Sırbistan U19 Ligi', 1, 1),
(662, 'Portekiz Kupası', 1, 1),
(663, 'El Salvador Apertura', 1, 1),
(664, 'Ermenistan Premier Ligi', 1, 1),
(665, 'Meksika U20 Ligi', 1, 1),
(666, 'Bulgaristan First Ligi', 1, 1),
(667, 'Sudi Arabistan Premier Ligi', 1, 1),
(668, 'Romanya Liga I', 1, 1),
(669, 'Hırvatistan 1.HNL', 1, 1),
(670, 'Polonya Ekstraklasa', 1, 1),
(671, 'Sırbistan Super Liga', 1, 1),
(672, 'Türkiye 1 Lig', 1, 1),
(673, 'Ukrayna Vyscha Liga', 1, 1),
(675, 'Arnavutluk Şampiyonlar Ligi', 1, 1),
(676, 'Bosna Hersek & Herzegovina Premier Liga', 1, 1),
(677, 'Rusya Premier Ligi', 1, 1),
(679, 'Marutanya Division 1', 1, 1),
(680, 'Danimarka Süperligien', 1, 1),
(681, 'Almanya 3.Liga', 1, 1),
(682, 'Türkiye Super Lig', 1, 1),
(684, 'İsviçre Challenge Ligi', 1, 1),
(686, 'Almanya Bundesliga I', 1, 1),
(687, 'Belçika First Division A', 1, 1),
(688, 'Fransa Ligue 1', 1, 1),
(693, 'Ekvator Reserve Ligi', 1, 1),
(696, 'Meksika Apertura', 1, 1),
(697, 'Aruba Division Di Honor', 1, 1),
(698, 'Ekvator Campeonato Ulusal', 1, 1),
(699, 'Kenya Premier Ligi', 1, 1),
(701, 'Slovenia Prva Liga', 1, 1),
(702, 'Çek Cumhuriyeti First Ligi', 1, 1),
(708, 'Avusturya Bundesliga', 1, 1),
(709, 'Macaristan NB I', 1, 1),
(710, 'Kıbrıs Division 1', 1, 1),
(711, 'Norveç Eliteserien', 1, 1),
(712, 'Hollanda Eredivisie', 1, 1),
(713, 'Yunanistan Super Ligi 1', 1, 1),
(714, 'İsviçre Super Ligi', 1, 1),
(715, 'Guatemala Liga Ulusal', 1, 1),
(716, 'Dominik Cumhuriyeti Liga', 1, 1),
(717, 'Ekvator Primera B', 1, 1),
(718, 'Barbados Super Kupası', 1, 1),
(719, 'Macaristan NB II', 1, 1),
(721, 'Bahrain Premier Ligi', 1, 1),
(722, 'Mali Premiere Division', 1, 1),
(725, 'Yunanistan Super Ligi 2', 1, 1),
(726, 'Togo Premier Division', 1, 1),
(727, 'Fildişi Sahili Premier Division', 1, 1),
(728, 'Peru', 1, 1),
(729, 'Antigua & Barbuda Premier Division', 1, 1),
(732, 'Nijerya Premier Ligi', 1, 1),
(733, 'Curacao Ligi', 1, 1),
(734, 'Sudi Arabistan Youth Ligi', 1, 1),
(735, 'Senegal Şampiyonlar Challenge', 1, 1),
(736, 'Norveç Toppserien Kadınlar Qual', 1, 1),
(737, 'Kosta Rika Play-Offs', 1, 1),
(738, 'Papua Kupası', 1, 1),
(10036537, 'İngiltere Ligi 1', 1, 1),
(10036538, 'İspanya Segunda', 1, 1),
(10036571, 'Hollanda Eerste Divisie', 1, 1),
(10036574, 'Polonya II Liga', 1, 1),
(10036586, 'İngiltere U23 Development Ligi', 1, 1),
(10036934, 'Çin Super Ligi', 1, 1),
(10036994, 'U23 Uluslararası', 1, 1),
(10037051, 'Romanya Liga II', 1, 1),
(10037109, 'Avrupa Dostluk Maçları', 1, 1),
(10037118, 'Almanya Bundesliga II Kadınlar', 1, 1),
(10037183, 'İtalya Serie C Group A', 1, 1),
(10037195, 'Rwanda Ulusal Ligi', 1, 1),
(10037198, 'Almanya Ulusalliga South West', 1, 1),
(10037213, 'Uganda Premier Ligi', 1, 1),
(10037290, 'Brezilya Maçları', 1, 1),
(10037291, 'İngiltere FA Trophy', 1, 1),
(10037333, 'Venezuela Primera Division', 1, 1),
(10037409, 'Meksika Liga MX Femenil', 1, 1),
(10037428, 'Peru Segunda', 1, 1),
(10037430, 'Arjantin Şampiyonlar Ligi Kadınlar', 1, 1),
(10037432, 'Arjantin Primera B Metropolitana', 1, 1),
(10037434, 'Arjantin Primera C Metropolitana', 1, 1),
(10037435, 'Arjantin Ulusal B', 1, 1),
(10037440, 'Brezilya Serie A', 1, 1),
(10037444, 'Arjantin Torneo A', 1, 1),
(10037464, 'Jamaica Premier Ligi', 1, 1),
(10037542, 'Endenozya Liga 3', 1, 1),
(10037653, 'Hollanda Reserve Ligi', 1, 1),
(10040082, 'Arjantin Primera D Metropolitana', 1, 1),
(10040085, 'İngiltere Southern Ligi Division One', 1, 1),
(10040087, 'İrlanda Cum Leinster Senior Ligi', 1, 1),
(10040100, 'Brezilya Serie B', 1, 1),
(10040255, 'İsrail Liga Bet South', 1, 1),
(10040344, 'Uruguay Segunda B Ulusal', 1, 1),
(10040350, 'Avusturya Amateur Kupası', 1, 1),
(10040380, 'ingiltere EFL Trophy', 1, 1),
(10040381, 'İngiltere Ulusal Ligi', 1, 1),
(10040382, 'İngiltere Isthmian Premier Division', 1, 1),
(10040386, 'İngiltere Isthmian Kupası', 1, 1),
(10040387, 'İngiltere Southern Premier Ligi Central', 1, 1),
(10040388, 'İngiltere Southern Premier Ligi South', 1, 1),
(10040508, 'Hong Kong Reserve Division', 1, 1),
(10040528, 'İran Kupası', 1, 1),
(10040553, 'Arjantin Reserve Ligi', 1, 1),
(10040747, 'İngiltere U23 Premier Ligi Kupası', 1, 1),
(10040762, 'Mısır Division 1', 1, 1),
(10040771, 'Botswana Premier Ligi', 1, 1),
(10040971, 'Makedonya First Ligi', 1, 1),
(10040987, 'Filistin West Bank Ligi', 1, 1),
(10041036, 'Polonya I Liga', 1, 1),
(10041046, 'Malta Premier Ligi', 1, 1),
(10041052, 'Almanya Bundesliga II', 1, 1),
(10041083, 'Fransa Ligue 2', 1, 1),
(10041088, 'İngiltere Premier Ligi 2', 1, 1),
(10041094, 'İskoçya FA Kupası', 1, 1),
(10041101, 'ingiltere Şampiyonlar Ligi', 1, 1),
(10041105, 'İrlanda Cum FAI Intermediate Kupası', 1, 1),
(10041107, 'İrlanda Kuzey Premier', 1, 1),
(10041109, 'İtalya Serie B', 1, 1),
(10041110, 'İspanya Primera Liga', 1, 1),
(10041115, 'Bolivya Clausura', 1, 1),
(10041125, 'Arjantin Süperligi', 1, 1),
(10041134, 'Paraguay Division Profesional', 1, 1),
(10041282, 'İngiltere Premier Ligi', 1, 1),
(10041293, 'Zambia Super Ligi', 1, 1),
(10041315, 'İtalya Serie A', 1, 1),
(10041318, 'Tanzanya Premier Ligi', 1, 1),
(10041333, 'İskoçya Ligi One', 1, 1),
(10041334, 'İskoçya Şampiyonlar Ligi', 1, 1),
(10041335, 'İskoçya Premiership', 1, 1),
(10041336, 'İngiltere Ligi 2', 1, 1),
(10041398, 'Luxembourg Division Ulusale', 1, 1),
(10041479, 'Hırvatistan 3.HNL', 1, 1),
(10041525, 'Hindistan Super Ligi', 1, 1),
(10041527, 'Fas GNF 1', 1, 1),
(10041561, 'Kolombiya U20 Ligi', 1, 1),
(10041643, 'Mısır Division 2', 1, 1),
(10041663, 'Belçika Reserve Ligi', 1, 1),
(10041668, 'İngiltere Northern Ligi Challenge Kupası', 1, 1),
(10041743, 'UEFA Youth Ligi', 1, 1),
(10041809, 'UEFA Şampiyonlar Ligi', 1, 1),
(10041823, 'İngiltere County Kupası', 1, 1),
(10041892, 'Sudan Ligi', 1, 1),
(10041896, 'İsviçre Division 1 Kadınlar', 1, 1),
(10041897, 'Afrika Güney Premier', 1, 1),
(10042001, 'Uruguay U19 Ligi', 1, 1),
(10042183, 'San Marino Kupası', 1, 1),
(10042267, 'İskoçya Reserve Ligi', 1, 1),
(10042284, 'Hollanda Youth Eredivisie', 1, 1),
(10042491, 'Danimarka Kupası', 1, 1),
(10042496, 'İspanya Kupa de Catalunya', 1, 1),
(10042498, 'İngiltere North West Counties Ligi', 1, 1),
(10042626, 'Galler Şampiyonlar Ligi South', 1, 1),
(10042628, 'Trinidad & Tobago Ligi Kupası', 1, 1),
(10042669, 'Hindistan Bangalore Super Division', 1, 1),
(10042671, 'AFC U19 Şampiyonlar Ligis', 1, 1),
(10042706, 'Norveç Division 1 Play-Offs', 1, 1),
(10043035, 'Kadınlar U23 Uluslararası', 1, 1),
(10043595, 'İngiltere Northern Ligi Division One', 1, 1),
(10043605, 'Luxembourg Promotion D’Honneur', 1, 1),
(10043754, 'İngiltere Isthmian Division One South', 1, 1),
(10043828, 'Dünya Soccer Dünya Kupası - 36 mins play', 1, 1),
(10043872, 'İrlanda Kuzey Amateur Kupası', 1, 1),
(10043963, 'South East Asyan Games', 1, 1),
(110040307, 'Sudi Arabistan Division', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `livemarkets`
--

DROP TABLE IF EXISTS `livemarkets`;
CREATE TABLE IF NOT EXISTS `livemarkets` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `hamit` tinyint(1) DEFAULT '1',
  `selim` tinyint(1) DEFAULT '1',
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Dumping data for table `livemarkets`
--

INSERT INTO `livemarkets` (`id`, `name`, `hamit`, `selim`) VALUES
(1777, 'Maç Sonu', 1, 1),
(1780, 'Kornerler', 1, 1),
(10001, 'Kesin Skor', 1, 1),
(10115, 'Çifte Şans', 1, 1),
(10124, 'Maç Sonu ve Alt/Üst', 1, 1),
(10147, 'Asya Handikap (0-0)', 1, 1),
(10148, 'Gol Aralığı', 1, 1),
(10153, '10 Dakika Korner - Alt/Üst - 30:00 - 39:59', 1, 1),
(10159, 'Maç Handikap', 1, 1),
(10160, 'İlk Yarı Kornerler', 1, 1),
(10161, 'İlk Yarı Sonucu', 1, 1),
(10170, 'İlk Yarı Asya Handikap (0-0)', 1, 1),
(10171, 'İlk Yarı Gol Aralığı (0-0)', 1, 1),
(10515, 'Son Korner', 1, 1),
(10560, 'İlk Yarı ve Maç Sonu', 1, 1),
(10561, 'İlk Yarı Kesin Skor', 1, 1),
(10562, 'Tek/Çift', 1, 1),
(10563, 'Beraberlikte iade', 1, 1),
(10564, 'Son Golü Hangi Takım Atar', 1, 1),
(10565, 'Her iki Takım Gol', 1, 1),
(10566, 'EvsahibiAlt/Üst', 1, 1),
(10567, 'Hangi Takım Gol Yemez', 1, 1),
(10568, 'İlk Yarı Alt/Üst', 1, 1),
(50162, 'Delasman Alt/Üst', 1, 1),
(50166, '10 Dakika Olayı - Alt/Üst - 30:00 - 39:59', 1, 1),
(50180, 'İkinci Yarı Hangi Takım Gol Atar', 1, 1),
(50185, 'Kornerler-Asya', 1, 1),
(50186, 'İlk Yarı Kornerler-Asya', 1, 1),
(50187, 'Kornerler-2', 1, 1),
(50193, 'Maç Zamanı Sonucu', 1, 1),
(50198, 'Kornerler Yarışı', 1, 1),
(50246, 'İkinci Yarı Kazananı', 1, 1),
(50281, 'Alternatif Asya Handikap (0-0)', 1, 1),
(50285, 'Alternatif Gol Aralığı (0-0)', 1, 1),
(50335, 'Gol Zamanı', 1, 1),
(50346, 'İlk Yarı Handikap', 1, 1),
(50349, 'Evsahibi Gol Zamanı ', 1, 1),
(50357, 'Deplasman Gol Zamanı', 1, 1),
(50365, 'Hangi Takım İki Yarıda Gol Atar', 1, 1),
(50390, 'İlk Yarı Her İki Takım Gol', 1, 1),
(50391, 'İkinci Yarı Her İki Takım Gol', 1, 1),
(50396, 'Evsahibi Gol Sayısı', 1, 1),
(50397, 'Deplasman Gol Sayısı', 1, 1),
(50461, 'Maç Sonu ve Her İki Takım Golü', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `loginlog`
--

DROP TABLE IF EXISTS `loginlog`;
CREATE TABLE IF NOT EXISTS `loginlog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `admin` varchar(50) COLLATE utf8_turkish_ci NOT NULL DEFAULT 'no',
  `superadmin` varchar(50) COLLATE utf8_turkish_ci NOT NULL DEFAULT 'no',
  `date` timestamp NOT NULL,
  `proccess` char(10) COLLATE utf8_turkish_ci NOT NULL,
  `ip` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Dumping data for table `loginlog`
--

INSERT INTO `loginlog` (`id`, `user`, `admin`, `superadmin`, `date`, `proccess`, `ip`) VALUES
(1, 'sami', 'ali', 'mesto', '2019-12-04 23:10:25', 'Offline', '127.0.0.1'),
(2, 'mesto', '', 'no', '2019-12-05 00:55:49', 'Online', '127.0.0.1'),
(3, 'mesto', '', 'no', '2019-12-05 00:56:06', 'Offline', '127.0.0.1'),
(4, 'ali', 'mesto', '', '2019-12-05 00:56:11', 'Online', '127.0.0.1'),
(5, 'ali', 'mesto', '', '2019-12-05 00:56:31', 'Offline', '127.0.0.1'),
(6, 'sami', 'ali', 'mesto', '2019-12-05 00:56:38', 'Online', '127.0.0.1'),
(7, 'sami', 'ali', 'mesto', '2019-12-05 00:57:58', 'Offline', '127.0.0.1'),
(8, 'sami', 'ali', 'mesto', '2019-12-05 00:58:50', 'Online', '127.0.0.1'),
(9, 'sami', 'ali', 'mesto', '2019-12-05 00:59:47', 'Offline', '127.0.0.1'),
(10, 'sami', 'ali', 'mesto', '2019-12-05 00:59:55', 'Online', '127.0.0.1'),
(11, 'sami', 'ali', 'mesto', '2019-12-05 01:07:14', 'Offline', '127.0.0.1'),
(12, 'ali', 'mesto', '', '2019-12-05 19:20:37', 'Online', '127.0.0.1'),
(13, 'ali', 'mesto', '', '2019-12-05 19:31:20', 'Offline', '127.0.0.1'),
(14, 'sami', 'ali', 'mesto', '2019-12-05 19:31:28', 'Online', '127.0.0.1'),
(15, 'sami', 'ali', 'mesto', '2019-12-05 19:31:48', 'Offline', '127.0.0.1'),
(16, 'hamit', 'sami', 'ali', '2019-12-05 19:31:56', 'Online', '127.0.0.1'),
(17, 'hamit', 'sami', 'ali', '2019-12-05 19:32:08', 'Offline', '127.0.0.1'),
(18, 'hamit', 'sami', 'ali', '2019-12-05 19:35:19', 'Online', '127.0.0.1'),
(19, 'hamit', 'sami', 'ali', '2019-12-05 19:36:30', 'Offline', '127.0.0.1'),
(20, 'selim', 'sami', 'ali', '2019-12-05 19:36:38', 'Online', '127.0.0.1'),
(21, 'selim', 'sami', 'ali', '2019-12-05 19:37:38', 'Offline', '127.0.0.1'),
(22, 'sami', 'ali', 'mesto', '2019-12-05 19:37:44', 'Online', '127.0.0.1'),
(23, 'sami', 'ali', 'mesto', '2019-12-05 19:41:31', 'Offline', '127.0.0.1'),
(24, 'sami', 'ali', 'mesto', '2019-12-05 19:41:37', 'Online', '127.0.0.1'),
(25, 'sami', 'ali', 'mesto', '2019-12-05 19:50:06', 'Offline', '127.0.0.1'),
(26, 'sami', 'ali', 'mesto', '2019-12-05 19:52:05', 'Online', '127.0.0.1'),
(27, 'sami', 'ali', 'mesto', '2019-12-05 20:17:57', 'Offline', '127.0.0.1'),
(28, 'sami', 'ali', 'mesto', '2019-12-05 20:18:48', 'Online', '127.0.0.1'),
(29, 'sami', 'ali', 'mesto', '2019-12-05 20:20:08', 'Offline', '127.0.0.1'),
(30, 'sami', 'ali', 'mesto', '2019-12-05 20:21:04', 'Online', '127.0.0.1'),
(31, 'sami', 'ali', 'mesto', '2019-12-05 20:24:20', 'Offline', '127.0.0.1'),
(32, 'sami', 'ali', 'mesto', '2019-12-05 20:25:16', 'Online', '127.0.0.1'),
(33, 'sami', 'ali', 'mesto', '2019-12-05 20:27:16', 'Offline', '127.0.0.1'),
(34, 'sami', 'ali', 'mesto', '2019-12-05 20:28:13', 'Online', '127.0.0.1'),
(35, 'sami', 'ali', 'mesto', '2019-12-05 20:32:20', 'Offline', '127.0.0.1'),
(36, 'sami', 'ali', 'mesto', '2019-12-05 20:33:11', 'Online', '127.0.0.1'),
(37, 'sami', 'ali', 'mesto', '2019-12-05 20:36:15', 'Offline', '127.0.0.1'),
(38, 'sami', 'ali', 'mesto', '2019-12-05 20:39:45', 'Online', '127.0.0.1'),
(39, 'sami', 'ali', 'mesto', '2019-12-05 20:40:10', 'Offline', '127.0.0.1'),
(40, 'sami', 'ali', 'mesto', '2019-12-05 20:44:10', 'Online', '127.0.0.1'),
(41, 'sami', 'ali', 'mesto', '2019-12-05 20:44:59', 'Offline', '127.0.0.1'),
(42, 'sami', 'ali', 'mesto', '2019-12-05 20:48:15', 'Online', '127.0.0.1'),
(43, 'sami', 'ali', 'mesto', '2019-12-05 20:48:47', 'Offline', '127.0.0.1'),
(44, 'sami', 'ali', 'mesto', '2019-12-05 20:50:05', 'Online', '127.0.0.1'),
(45, 'sami', 'ali', 'mesto', '2019-12-05 20:51:08', 'Offline', '127.0.0.1');

-- --------------------------------------------------------

--
-- Table structure for table `markets`
--

DROP TABLE IF EXISTS `markets`;
CREATE TABLE IF NOT EXISTS `markets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `hamit` tinyint(1) DEFAULT '1',
  `selim` tinyint(1) DEFAULT '1',
  UNIQUE KEY `betid` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Dumping data for table `markets`
--

INSERT INTO `markets` (`id`, `name`, `hamit`, `selim`) VALUES
(1, 'Maç Sonu', 1, 1),
(2, 'Maç Sonu ve Alt/Üst', 1, 1),
(3, 'Beraberlikte İade', 1, 1),
(4, 'Çifte Şans', 1, 1),
(5, 'Karşılıklı Gol ve Maç Sonu', 1, 1),
(6, 'Handikap Sonucu', 1, 1),
(7, 'İlk Yarı Sonucu', 1, 1),
(8, 'İlk Yarı Sonucu ve Alt/Üst', 1, 1),
(9, 'İlk Yarı/Maç Sonu', 1, 1),
(10, 'İlk Yarı Çifte Şans', 1, 1),
(11, ' İlk Yarı Kesin Skor', 1, 1),
(12, 'İlk Yarı Tek/Çift', 1, 1),
(13, ' İlk Yarı Toplam Alt/Üst', 1, 1),
(14, 'İlk Yarı Kesin Gol Sayısı', 1, 1),
(15, 'İlk Yarı Sonucu/Her İki Takım Gol', 1, 1),
(16, 'İlk Yarı İki Takım da Gol Atarmı', 1, 1),
(17, ' İlk Yarı Kornerler', 1, 1),
(18, 'İlk Yarı Handikap', 1, 1),
(19, ' İlk Yarı Alternatif Handikap', 1, 1),
(20, ' İkinci Yarı Sonucu', 1, 1),
(21, 'İkinci Yarı Toplam Alt/Üst', 1, 1),
(22, 'İkinci Yarı Tek/Çift', 1, 1),
(23, 'İkinci Yarı Kesin Gol Sayısı', 1, 1),
(24, 'İkinci Yarı İki Takım da Gol Atarmı', 1, 1),
(25, 'Toplam Alt/Üst 2.5', 1, 1),
(26, 'Toplam Gol Alt/Üst', 1, 1),
(27, ' Kesin Skor', 1, 1),
(28, 'Tek/Çift', 1, 1),
(29, 'Kazanma Aralığı', 1, 1),
(30, 'İlk Golü Hangi Takım Atar', 1, 1),
(31, ' Son Golü Hangi Takım Atar', 1, 1),
(32, 'İki Takım da Gol Atarmı', 1, 1),
(33, ' İlk Yarı/İkinci Yarı Her İki Takım Gol', 1, 1),
(34, 'Hangi Takım Gol Atar', 1, 1),
(35, 'Hangi Yarı Daha Çok Gol Olur', 1, 1),
(36, 'Evsahibi Tek/Çift', 1, 1),
(37, 'Evsahibi Kesin Gol Sayısı', 1, 1),
(38, 'Evsahibi Hangi Devre Çok Gol Atar', 1, 1),
(39, 'Deplasman Tek/Çift', 1, 1),
(40, 'Deplasman Kesin Gol Sayısı', 1, 1),
(41, 'Deplasman Hangi Devre Çok Gol Atar', 1, 1),
(42, 'Toplam Kornerler', 1, 1),
(43, 'Kornerler 3 lü', 1, 1),
(44, 'Kornerler 2 li', 1, 1),
(45, 'İlk Korner', 1, 1),
(46, 'Son Korner', 1, 1),
(47, 'İlk Yarı Kornerler', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `betweenmsg` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sender` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `msg` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `readed` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sender` (`sender`),
  KEY `receiver` (`receiver`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `scores`
--

DROP TABLE IF EXISTS `scores`;
CREATE TABLE IF NOT EXISTS `scores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` int(4) NOT NULL DEFAULT '0',
  `score` char(10) COLLATE utf8_turkish_ci NOT NULL DEFAULT '0',
  `status` char(10) COLLATE utf8_turkish_ci NOT NULL DEFAULT '0',
  `minute` char(4) COLLATE utf8_turkish_ci DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `timesettings`
--

DROP TABLE IF EXISTS `timesettings`;
CREATE TABLE IF NOT EXISTS `timesettings` (
  `user` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `admin` varchar(50) COLLATE utf8_turkish_ci NOT NULL DEFAULT 'guest',
  `superadmin` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `ilkcba` tinyint(2) UNSIGNED DEFAULT '0',
  `ilkcbk` tinyint(2) UNSIGNED NOT NULL DEFAULT '45',
  `ikicba` tinyint(2) UNSIGNED DEFAULT '45',
  `ikicbk` tinyint(2) UNSIGNED NOT NULL DEFAULT '0',
  `sa` datetime DEFAULT NULL,
  `sk` datetime DEFAULT NULL,
  PRIMARY KEY (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Dumping data for table `timesettings`
--

INSERT INTO `timesettings` (`user`, `admin`, `superadmin`, `ilkcba`, `ilkcbk`, `ikicba`, `ikicbk`, `sa`, `sk`) VALUES
('hamit', 'sami', 'ali', 0, 45, 45, 0, NULL, NULL),
('selim', 'sami', 'ali', 0, 45, 45, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `nick` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `pass` varchar(100) COLLATE utf8_turkish_ci NOT NULL,
  `admin` varchar(50) COLLATE utf8_turkish_ci NOT NULL DEFAULT 'no',
  `superadmin` varchar(50) COLLATE utf8_turkish_ci NOT NULL DEFAULT 'no',
  `credit` mediumint(11) DEFAULT '0',
  `creditused` float NOT NULL DEFAULT '0',
  `creditremain` mediumint(9) DEFAULT '0',
  `role` varchar(5) COLLATE utf8_turkish_ci NOT NULL,
  `userlimit` tinyint(2) UNSIGNED DEFAULT '0',
  `remain` tinyint(4) UNSIGNED DEFAULT '0',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `state` char(10) COLLATE utf8_turkish_ci NOT NULL DEFAULT 'aktif',
  `payment` datetime DEFAULT NULL,
  `logincount` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `logincheck` char(10) COLLATE utf8_turkish_ci NOT NULL DEFAULT 'passive',
  `comission` tinyint(5) NOT NULL DEFAULT '40',
  `operate` char(8) COLLATE utf8_turkish_ci NOT NULL DEFAULT 'orjinal',
  `rate` char(5) COLLATE utf8_turkish_ci NOT NULL DEFAULT '0',
  `liveoperate` char(8) COLLATE utf8_turkish_ci NOT NULL DEFAULT 'orjinal',
  `liverate` char(5) COLLATE utf8_turkish_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`user`),
  UNIQUE KEY `user` (`user`),
  UNIQUE KEY `nick` (`nick`),
  KEY `credit` (`credit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user`, `nick`, `pass`, `admin`, `superadmin`, `credit`, `creditused`, `creditremain`, `role`, `userlimit`, `remain`, `date`, `state`, `payment`, `logincount`, `logincheck`, `comission`, `operate`, `rate`, `liveoperate`, `liverate`) VALUES
('ali', 'alo', '38db4b80c8c8cd3a8a1b39fe9a070cd27f38c754a837', 'mesto', '', NULL, 0, NULL, 'S3', 5, 4, '2019-12-05 00:56:02', 'aktif', '2019-12-05 03:56:03', 0, 'passive', 40, 'orjinal', '0', 'orjinal', '0'),
('hamit', 'hamo', '02d68e1268579a1b9da2229f8b0d836655b63a7cadc6', 'sami', 'ali', 9000, 40, 8960, 'U1', NULL, NULL, '2019-12-05 01:01:57', 'aktif', '2019-12-05 04:01:58', 0, 'passive', 40, 'orjinal', '0', 'orjinal', '0'),
('mesto', '1830', '27867f649f91e07dc27c415b356ff15514eeb4f5d23ceadd', '', 'no', 0, 0, 0, 'B4', 15, 11, '2018-11-04 22:00:00', 'aktif', '2018-11-05 00:39:32', 0, 'passive', 40, 'orjinal', '0', 'orjinal', '0'),
('sami', 'semo', '85c96a88fdb7f522eb849071187471d3d88687f7f037', 'ali', 'mesto', NULL, 0, NULL, 'A2', 5, 3, '2019-12-05 00:56:24', 'aktif', '2019-12-05 03:56:24', 0, 'passive', 40, 'orjinal', '0', 'orjinal', '0'),
('selim', 'selo', 'ee8f5c7d0776349658db41c566829b42b8dc4cab20df', 'sami', 'ali', 9000, 35, 8965, 'U1', NULL, NULL, '2019-12-05 01:02:16', 'aktif', '2019-12-05 04:02:17', 0, 'passive', 40, 'orjinal', '0', 'orjinal', '0');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
