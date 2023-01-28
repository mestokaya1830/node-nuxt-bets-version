-- MySQL dump 10.13  Distrib 8.0.26, for Linux (x86_64)
--
-- Host: localhost    Database: gasvet
-- ------------------------------------------------------
-- Server version	8.0.26-0ubuntu0.20.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `anons`
--

DROP TABLE IF EXISTS `anons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anons` (
  `anons` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anons`
--

LOCK TABLES `anons` WRITE;
/*!40000 ALTER TABLE `anons` DISABLE KEYS */;
/*!40000 ALTER TABLE `anons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `basketfixtures`
--

DROP TABLE IF EXISTS `basketfixtures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `basketfixtures` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fixtureid` int unsigned NOT NULL,
  `RegionId` int unsigned NOT NULL,
  `RegionName` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `startdate` varchar(20) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `leagueid` int unsigned NOT NULL,
  `leaguename` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `HomeTeam` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT NULL,
  `AwayTeam` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT NULL,
  `home` char(6) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT '-',
  `away` char(6) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT '-',
  `under` varchar(20) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT '-',
  `underodds` char(6) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT NULL,
  `over` varchar(20) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT '-',
  `overodds` char(6) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT NULL,
  `han1` char(6) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT '-',
  `han1attr` char(6) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT NULL,
  `han2` char(6) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT '-',
  `han2attr` char(6) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fid` (`fixtureid`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_turkish_ci ROW_FORMAT=FIXED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `basketfixtures`
--

LOCK TABLES `basketfixtures` WRITE;
/*!40000 ALTER TABLE `basketfixtures` DISABLE KEYS */;
INSERT INTO `basketfixtures` VALUES (1,10292429,173,'New Zealand','2020-07-23T05:30:00Z',5220,'NBL','Franklin Bulls','Steelformers Taranaki Mountainairs','2.20','1.62','Under 182,5','1.72','Over 182,5','2.05','1.72','+4,5','2.05','-4,5'),(2,10292430,173,'New Zealand','2020-07-23T07:30:00Z',5220,'NBL','Otago Nuggets','Manawatu Jets','2.00','1.75','Under 199,5','1.91','Over 199,5','1.83','1.90','+1,5','1.83','-1,5'),(3,10292540,57,'China','2020-07-23T08:00:00Z',14386,'Chinese Basketball Association','Jilin','Zhejiang Guangsha Lions','3.00','1.3','Under 203,5','1.85','Over 203,5','1.85','1.85','+5,5','1.85','-5,5'),(4,10292541,57,'China','2020-07-23T11:35:00Z',14386,'Chinese Basketball Association','Xinjiang','Guangzhou Long-Lions','1.11','5.5','Under 206,5','1.85','Over 206,5','1.87','1.75','-11,5','1.95','+11,5'),(5,10292542,57,'China','2020-07-23T12:00:00Z',14386,'Chinese Basketball Association','Guangdong Southern Tigers','Nanjing Monkey King','1.05','6.5','Under 222,5','2.05','Over 222,5','1.70','1.80','-17,5','1.90','+17,5'),(6,10292222,62,'Israel','2020-07-23T16:25:00Z',3705,'Premier League','Hapoel Holon','Gilboa Galil','3.30','1.28','Under 169.5','1.53','Over 169,5','2.35','2.55','+3,5','1.45','-3,5'),(7,10292223,62,'Israel','2020-07-23T18:15:00Z',3705,'Premier League','Maccabi Electra Tel Aviv','Hapoel Tel Aviv','1.28','3.3','Under 166,5','1.70','Over 166,5','2.05','2.60','-12,5','1.44','+12,5');
/*!40000 ALTER TABLE `basketfixtures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `basketinplaymarkets`
--

DROP TABLE IF EXISTS `basketinplaymarkets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `basketinplaymarkets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` char(2) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL DEFAULT '-',
  `mid` int NOT NULL,
  `mn` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `admin1` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`mid`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `basketinplaymarkets`
--

LOCK TABLES `basketinplaymarkets` WRITE;
/*!40000 ALTER TABLE `basketinplaymarkets` DISABLE KEYS */;
INSERT INTO `basketinplaymarkets` VALUES (1,'-',15025,'Maç Bahsi 3 lü',1),(2,'-',66,'Maç Bahsi 2 li',1),(3,'-',3450,'Maç Bahsi (USA)',1),(4,'-',19849,'İlk Yarı Bahsi 3 lü',1),(5,'-',13974,'İlk Yarı Bahsi 2 li',1),(6,'-',7763,'İlk Yarı Bahsi 2 li',1),(7,'-',6710,'İlk Yarı Toplam Sayı Alt/Üst',1),(8,'-',15038,'İlk Yarı Toplam Sayı Alt/Üst',1),(9,'-',12173,'İlk Yarı Toplam Sayı Tek/Çift',1),(10,'-',31512,'İlk Çeyrek Bahsi 3 lü',1),(11,'-',14610,'İlk Çeyrek Bahsi 2 li',1),(12,'-',7356,'İlk Çeyrek Toplam Sayı Alt/Üst',1),(13,'-',12426,'Evsahibi Toplam Sayı Alt/Üst',1),(14,'-',18188,'Evsahibi İlk Yarı Toplam Sayı Alt/Üst',1),(15,'-',12811,'Evsahibi İlk Yarı Toplam Sayı Alt/Üst',1),(16,'-',12812,'Evsahibi İkinci Yarı Toplam Sayı Alt/Üst',1),(17,'-',18190,'Deplasman İkinci Yarı Toplam Sayı Alt/Üst',1),(18,'-',12813,'Evsahibi İlk Çeyrek Toplam Sayı Alt/Üst',1),(19,'-',18191,'Deplasman Toplam Sayı Alt/Üst',1),(20,'-',18189,'Deplasman İlk Çeyrek Toplam Sayı Alt/Üst',1),(21,'-',19952,'Maç Sonu Toplam Sayı Aralğı',1),(22,'-',19901,'Maç Sonu Toplam Sayı Aralğı',1),(23,'-',12140,'İlk Çeyrek Toplam Sayı Tek/Çift',1),(24,'-',31511,'İkinci Yarı Bahsi 3 lü',1),(25,'-',7764,'İkinci Yarı Bahsi 2 li',1),(26,'-',24557,'İkinci Yarı Bahsi 2 li',1),(27,'-',20127,'2. Çeyrek Bahsi 2 li',1),(28,'-',31513,'2. Çeyrek Bahsi 3 lü',1),(29,'-',12141,'2. Çeyrek Toplam Sayı Tek/Çift',1),(30,'-',17588,'2. Çeyrek Toplam Sayı Alt/Üst',1),(31,'-',20128,'3.Çeyrek Bahsi 2 li',1),(32,'-',24555,'3.Çeyrek Bahsi 2 li',1),(33,'-',31514,'3.Çeyrek Bahsi 3 lü',1),(34,'-',7970,'Toplam Sayı Tek/Çift',1),(35,'-',12174,'İkinci Yarı Toplam Sayı Tek/Çift',1),(36,'-',12142,'3.Çeyrek Toplam Sayı Tek/Çift',1),(37,'-',102,'Toplam Sayı Alt/Üst',1),(38,'-',11577,'Toplam Sayı Alt/Üst',1),(39,'-',7353,'İkinci Yarı Toplam Sayı Alt/Üst',1),(40,'-',17589,'3.Çeyrek Toplam Say Alt/Üst',1),(41,'-',31515,'4.Çeyrek Maç Bahsi 3 lü',1),(42,'-',20129,'4.Çeyrek Maç Bahsi 2 li',1),(43,'-',17590,'4.Çeyrek Toplam Sayı Alt/Üst',1),(44,'-',12143,'4.Çeyrek Toplam Sayı Tek/Çift',1),(45,'-',4860,'Kazanma Marjı',1),(46,'-',31520,'3.Çeyrek Handikap',1),(47,'-',31521,'3.Çeyrek Sayı Yarışı 5',1),(48,'-',31641,'İlk Yarı Sayı Yarışı 35',1),(49,'-',31639,'İlk Yarı Sayı Yarışı 25',1),(50,'-',31642,'İlk Yarı Sayı Yarışı 40',1),(51,'-',31643,'İlk Yarı Sayı Yarışı 45',1),(52,'-',5613,'Sayı Yarışı 10',1),(53,'-',2833,'Sayı Yarışı 20',1),(54,'-',7698,'İlk Yarı Handikap',1),(55,'-',7332,'İlk Çeyrek Handikap',1),(56,'-',31517,'1.Çeyrek Sayı Yarışı 5',1),(57,'-',7372,'1.Çeyrek Sayı Yarışı 10',1),(58,'-',31516,'1.Çeyrek Sayı Yarışı 15',1),(59,'-',31609,'1.Çeyrek Sayı Yarışı 20',1),(60,'-',31621,'1.Çeyrek Sayı Yarışı 25',1),(61,'-',31640,'1.Çeyrek Sayı Yarışı 30',1),(62,'-',7374,'3.Çeyrek Sayı Yarışı 10',1),(63,'-',31623,'2.Çeyrek Sayı Yarışı',1),(64,'-',31519,'2.Çeyrek Sayı Yarışı 5',1),(65,'-',7373,'2.Çeyrek Sayı Yarışı 10',1),(66,'-',31518,'2.Çeyrek Sayı Yarışı 15',1),(67,'-',31610,'2.Çeyrek Sayı Yarışı 20',1),(68,'-',31624,'2.Çeyrek Sayı Yarışı 25',1),(69,'-',7357,'2.Çeyrek Handikap',1),(70,'-',11306,'3.Çeyrek Sayı Yarışı 15',1),(71,'-',31611,'3.Çeyrek Sayı Yarışı 20',1),(72,'-',31625,'3.Çeyrek Sayı Yarışı 25',1),(73,'-',7375,'4.Çeyrek Sayı Yarışı 10',1),(74,'-',31523,'4.Çeyrek Sayı Yarışı 5',1),(75,'-',31522,'4.Çeyrek Sayı Yarışı 15',1),(76,'-',31612,'4.Çeyrek Sayı Yarışı 20',1),(77,'-',14017,'İkinci Yarı Sayı Yarışı 10',1),(78,'-',31630,'İkinci Yarı Sayı Yarışı 15',1),(79,'-',31631,'İkinci Yarı Sayı Yarışı 25',1),(80,'-',31632,'İkinci Yarı Sayı Yarışı 30',1),(81,'-',31633,'İkinci Yarı Sayı Yarışı 35',1),(82,'-',11305,'İkinci Yarı Handikap',1),(83,'-',2837,'4. Çeyrek Handikap',1);
/*!40000 ALTER TABLE `basketinplaymarkets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `basketmarkets`
--

DROP TABLE IF EXISTS `basketmarkets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `basketmarkets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mid` int NOT NULL,
  `mn` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `admin1` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`mid`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `basketmarkets`
--

LOCK TABLES `basketmarkets` WRITE;
/*!40000 ALTER TABLE `basketmarkets` DISABLE KEYS */;
INSERT INTO `basketmarkets` VALUES (1,15025,'Maç Bahsi 3 lü',1),(2,66,'Maç Bahsi 2 li',1),(3,3450,'Maç Bahsi (USA)',1),(4,19849,'İlk Yarı Bahsi 3 lü',1),(5,13974,'İlk Yarı Bahsi 2 li',1),(6,7763,'İlk Yarı Bahsi 2 li',1),(7,6710,'İlk Yarı Toplam Sayı Alt/Üst',1),(8,15038,'İlk Yarı Toplam Sayı Alt/Üst',1),(9,12173,'İlk Yarı Toplam Sayı Tek/Çift',1),(10,31512,'İlk Çeyrek Bahsi 3 lü',1),(11,14610,'İlk Çeyrek Bahsi 2 li',1),(12,7356,'İlk Çeyrek Toplam Sayı Alt/Üst',1),(13,12426,'Evsahibi Toplam Sayı Alt/Üst',1),(14,18188,'Evsahibi İlk Yarı Toplam Sayı Alt/Üst',1),(15,12811,'Evsahibi İlk Yarı Toplam Sayı Alt/Üst',1),(16,12812,'Evsahibi İkinci Yarı Toplam Sayı Alt/Üst',1),(17,18190,'Deplasman İkinci Yarı Toplam Sayı Alt/Üst',1),(18,12813,'Evsahibi İlk Çeyrek Toplam Sayı Alt/Üst',1),(19,18191,'Deplasman Toplam Sayı Alt/Üst',1),(20,18189,'Deplasman İlk Çeyrek Toplam Sayı Alt/Üst',1),(21,19952,'Maç Sonu Toplam Sayı Aralğı',1),(22,19901,'Maç Sonu Toplam Sayı Aralğı',1),(23,12140,'İlk Çeyrek Toplam Sayı Tek/Çift',1),(24,31511,'İkinci Yarı Bahsi 3 lü',1),(25,7764,'İkinci Yarı Bahsi 2 li',1),(26,24557,'İkinci Yarı Bahsi 2 li',1),(27,20127,'2. Çeyrek Bahsi 2 li',1),(28,31513,'2. Çeyrek Bahsi 3 lü',1),(29,12141,'2. Çeyrek Toplam Sayı Tek/Çift',1),(30,17588,'2. Çeyrek Toplam Sayı Alt/Üst',1),(31,20128,'3.Çeyrek Bahsi 2 li',1),(32,24555,'3.Çeyrek Bahsi 2 li',1),(33,31514,'3.Çeyrek Bahsi 3 lü',1),(34,7970,'Toplam Sayı Tek/Çift',1),(35,12174,'İkinci Yarı Toplam Sayı Tek/Çift',1),(36,12142,'3.Çeyrek Toplam Sayı Tek/Çift',1),(37,102,'Toplam Sayı Alt/Üst',1),(38,11577,'Toplam Sayı Alt/Üst',1),(39,7353,'İkinci Yarı Toplam Sayı Alt/Üst',1),(40,17589,'3.Çeyrek Toplam Say Alt/Üst',1),(41,31515,'4.Çeyrek Maç Bahsi 3 lü',1),(42,20129,'4.Çeyrek Maç Bahsi 2 li',1),(43,17590,'4.Çeyrek Toplam Sayı Alt/Üst',1),(44,12143,'4.Çeyrek Toplam Sayı Tek/Çift',1),(45,4860,'Kazanma Marjı',1),(46,31520,'3.Çeyrek Handikap',1),(47,31521,'3.Çeyrek Sayı Yarışı 5',1),(48,31641,'İlk Yarı Sayı Yarışı 35',1),(49,31639,'İlk Yarı Sayı Yarışı 25',1),(50,31642,'İlk Yarı Sayı Yarışı 40',1),(51,31643,'İlk Yarı Sayı Yarışı 45',1),(52,5613,'Sayı Yarışı 10',1),(53,2833,'Sayı Yarışı 20',1),(54,7698,'İlk Yarı Handikap',1),(55,7332,'İlk Çeyrek Handikap',1),(56,31517,'1.Çeyrek Sayı Yarışı 5',1),(57,7372,'1.Çeyrek Sayı Yarışı 10',1),(58,31516,'1.Çeyrek Sayı Yarışı 15',1),(59,31609,'1.Çeyrek Sayı Yarışı 20',1),(60,31621,'1.Çeyrek Sayı Yarışı 25',1),(61,31640,'1.Çeyrek Sayı Yarışı 30',1),(62,7374,'3.Çeyrek Sayı Yarışı 10',1),(63,31623,'2.Çeyrek Sayı Yarışı',1),(64,31519,'2.Çeyrek Sayı Yarışı 5',1),(65,7373,'2.Çeyrek Sayı Yarışı 10',1),(66,31518,'2.Çeyrek Sayı Yarışı 15',1),(67,31610,'2.Çeyrek Sayı Yarışı 20',1),(68,31624,'2.Çeyrek Sayı Yarışı 25',1),(69,7357,'2.Çeyrek Handikap',1),(70,11306,'3.Çeyrek Sayı Yarışı 15',1),(71,31611,'3.Çeyrek Sayı Yarışı 20',1),(72,31625,'3.Çeyrek Sayı Yarışı 25',1),(73,7375,'4.Çeyrek Sayı Yarışı 10',1),(74,31523,'4.Çeyrek Sayı Yarışı 5',1),(75,31522,'4.Çeyrek Sayı Yarışı 15',1),(76,31612,'4.Çeyrek Sayı Yarışı 20',1),(77,14017,'İkinci Yarı Sayı Yarışı 10',1),(78,31630,'İkinci Yarı Sayı Yarışı 15',1),(79,31631,'İkinci Yarı Sayı Yarışı 25',1),(80,31632,'İkinci Yarı Sayı Yarışı 30',1),(81,31633,'İkinci Yarı Sayı Yarışı 35',1),(82,11305,'İkinci Yarı Handikap',1),(83,2837,'4. Çeyrek Handikap',1);
/*!40000 ALTER TABLE `basketmarkets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bets`
--

DROP TABLE IF EXISTS `bets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `betid` int NOT NULL,
  `code` char(4) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `user` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `admin` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `superadmin` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `matches` varchar(100) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `games` varchar(100) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `options` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `rate` decimal(10,2) unsigned NOT NULL,
  `state` varchar(10) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `stream` char(10) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `scoreid` int unsigned NOT NULL DEFAULT '0',
  `eventtime` varchar(30) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL DEFAULT '00:00',
  `score` char(10) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL DEFAULT '-',
  PRIMARY KEY (`id`),
  KEY `betref` (`betid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bets`
--

LOCK TABLES `bets` WRITE;
/*!40000 ALTER TABLE `bets` DISABLE KEYS */;
/*!40000 ALTER TABLE `bets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `betsummary`
--

DROP TABLE IF EXISTS `betsummary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `betsummary` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `admin` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `superadmin` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `betscount` tinyint unsigned NOT NULL,
  `betscountremain` int unsigned NOT NULL,
  `amount` decimal(10,2) unsigned DEFAULT '0.00',
  `rate` decimal(10,2) unsigned DEFAULT '0.00',
  `earn` decimal(10,2) unsigned DEFAULT '0.00',
  `baseearn` decimal(10,2) unsigned DEFAULT '0.00',
  `owner` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT 'Yok',
  `state` varchar(20) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `userpay` char(5) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL DEFAULT 'no',
  `adminpay` char(5) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL DEFAULT 'no',
  `stream` char(10) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `role` char(4) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL DEFAULT 'U1',
  `woncount` tinyint NOT NULL DEFAULT '0',
  `lostcount` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user` (`user`),
  KEY `admin` (`admin`),
  KEY `state` (`state`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `betsummary`
--

LOCK TABLES `betsummary` WRITE;
/*!40000 ALTER TABLE `betsummary` DISABLE KEYS */;
/*!40000 ALTER TABLE `betsummary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branch`
--

DROP TABLE IF EXISTS `branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branch` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bid` int NOT NULL,
  `bn` varchar(50) NOT NULL,
  `admin1` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch`
--

LOCK TABLES `branch` WRITE;
/*!40000 ALTER TABLE `branch` DISABLE KEYS */;
INSERT INTO `branch` VALUES (7,1,'Futbol Liste',1),(8,2,'Futbol Canli',1),(9,3,'Basketbol Liste',1),(10,4,'Basketbol Canli',1);
/*!40000 ALTER TABLE `branch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `creditlog`
--

DROP TABLE IF EXISTS `creditlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `creditlog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `admin` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL DEFAULT 'no',
  `superadmin` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL DEFAULT 'no',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `amount` decimal(10,2) unsigned DEFAULT '0.00',
  `credit` decimal(10,2) unsigned DEFAULT '0.00',
  `creditremain` decimal(10,2) DEFAULT '0.00',
  `ope` varchar(20) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `des` varchar(20) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user` (`user`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `creditlog`
--

LOCK TABLES `creditlog` WRITE;
/*!40000 ALTER TABLE `creditlog` DISABLE KEYS */;
INSERT INTO `creditlog` VALUES (8,'subadmin','admin1','super1','2021-07-31 22:42:20',5000.00,5000.00,5000.00,'Limit','Yeni Kayıt'),(9,'member1','admin1','super1','2021-07-31 22:42:43',5000.00,5000.00,5000.00,'Limit','Yeni Kayıt'),(10,'submember1','subadmin','admin1','2021-07-31 22:43:33',500.00,500.00,500.00,'Limit','Yeni Kayıt');
/*!40000 ALTER TABLE `creditlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gamelog`
--

DROP TABLE IF EXISTS `gamelog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gamelog` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `betsumid` int NOT NULL,
  `user` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `admin` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL DEFAULT 'no',
  `superadmin` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL DEFAULT 'no',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `amount` decimal(10,2) unsigned DEFAULT '0.00',
  `creditremain` decimal(10,2) DEFAULT '0.00',
  `ope` varchar(20) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `des` varchar(20) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gamelog`
--

LOCK TABLES `gamelog` WRITE;
/*!40000 ALTER TABLE `gamelog` DISABLE KEYS */;
/*!40000 ALTER TABLE `gamelog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loginlog`
--

DROP TABLE IF EXISTS `loginlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loginlog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `admin` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL DEFAULT 'no',
  `superadmin` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL DEFAULT 'no',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `proccess` char(10) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `ip` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17904 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loginlog`
--

LOCK TABLES `loginlog` WRITE;
/*!40000 ALTER TABLE `loginlog` DISABLE KEYS */;
INSERT INTO `loginlog` VALUES (17098,'tevye','no','no','2020-08-23 00:17:05','Online','127.0.0.1'),(17099,'tevye','no','no','2020-08-23 00:17:28','Offline','127.0.0.1'),(17850,'tevye','no','no','2020-09-17 15:50:10','Online','127.0.0.1'),(17851,'tevye','no','no','2020-09-17 15:51:28','Offline','127.0.0.1'),(17852,'tevye','no','no','2020-09-17 15:51:51','Online','127.0.0.1'),(17853,'tevye','no','no','2020-09-17 15:55:58','Offline','127.0.0.1'),(17866,'tevye','no','no','2020-09-17 16:41:14','Online','127.0.0.1'),(17867,'tevye','no','no','2020-09-17 16:46:49','Offline','127.0.0.1'),(17870,'tevye','no','no','2020-09-17 16:47:51','Online','127.0.0.1'),(17871,'tevye','no','no','2020-09-17 16:50:07','Offline','127.0.0.1'),(17874,'tevye','no','no','2020-09-17 16:50:47','Online','127.0.0.1'),(17875,'tevye','no','no','2020-09-17 16:52:56','Offline','127.0.0.1'),(17878,'tevye','no','no','2020-09-17 16:55:23','Online','127.0.0.1'),(17879,'tevye','no','no','2020-09-17 16:55:49','Offline','127.0.0.1'),(17880,'tevye','no','no','2021-07-08 22:19:51','Online','127.0.0.1'),(17881,'tevye','no','no','2021-07-08 22:20:21','Offline','127.0.0.1'),(17882,'tevye','no','no','2021-07-09 20:01:39','Online','127.0.0.1'),(17883,'tevye','no','no','2021-07-09 20:06:12','Offline','127.0.0.1'),(17884,'tevye','no','no','2021-07-09 21:01:34','Online','127.0.0.1'),(17885,'tevye','no','no','2021-07-09 21:01:51','Offline','127.0.0.1'),(17886,'superadmin','tevye','no','2021-07-09 21:01:59','Online','127.0.0.1'),(17887,'superadmin','tevye','no','2021-07-09 21:02:28','Offline','127.0.0.1'),(17888,'tevye','no','no','2021-07-19 22:50:23','Online','127.0.0.1'),(17889,'tevye','no','no','2021-07-19 23:02:12','Online','127.0.0.1'),(17890,'tevye','no','no','2021-07-19 23:07:22','Offline','127.0.0.1'),(17891,'superadmin','tevye','no','2021-07-19 23:07:29','Online','127.0.0.1'),(17892,'superadmin','tevye','no','2021-07-19 23:07:41','Offline','127.0.0.1'),(17893,'tevye','no','no','2021-07-31 22:36:08','Online','127.0.0.1'),(17894,'tevye','no','no','2021-07-31 22:36:23','Offline','127.0.0.1'),(17895,'Boss','no','no','2021-07-31 22:38:26','Online','127.0.0.1'),(17896,'Boss','no','no','2021-07-31 22:40:40','Online','127.0.0.1'),(17897,'Boss','no','no','2021-07-31 22:41:07','Offline','127.0.0.1'),(17898,'super1','Boss','no','2021-07-31 22:41:13','Online','127.0.0.1'),(17899,'super1','Boss','no','2021-07-31 22:41:45','Offline','127.0.0.1'),(17900,'admin1','super1','Boss','2021-07-31 22:41:52','Online','127.0.0.1'),(17901,'admin1','super1','Boss','2021-07-31 22:42:48','Offline','127.0.0.1'),(17902,'subadmin','admin1','super1','2021-07-31 22:42:58','Online','127.0.0.1'),(17903,'subadmin','admin1','super1','2021-07-31 22:43:41','Offline','127.0.0.1');
/*!40000 ALTER TABLE `loginlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `setlimit`
--

DROP TABLE IF EXISTS `setlimit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `setlimit` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `admin` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `minms` tinyint unsigned DEFAULT '0',
  `maxms` tinyint unsigned DEFAULT '0',
  `minkm` tinyint unsigned DEFAULT '5',
  `maxkm` mediumint unsigned DEFAULT '1000',
  `maxrate` decimal(10,2) unsigned DEFAULT '1000.00',
  `maxearn` decimal(10,2) unsigned NOT NULL DEFAULT '10000.00',
  `maxkis` tinyint unsigned DEFAULT '0',
  `maxkisremain` tinyint unsigned DEFAULT '0',
  `cminms` tinyint unsigned DEFAULT '0',
  `cmaxms` tinyint unsigned DEFAULT '0',
  `cminkm` tinyint unsigned DEFAULT '5',
  `cmaxkm` decimal(10,2) unsigned DEFAULT '1000.00',
  `cmaxrate` decimal(10,2) unsigned DEFAULT '1000.00',
  `cmaxearn` decimal(10,2) unsigned NOT NULL DEFAULT '10000.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin` (`user`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `setlimit`
--

LOCK TABLES `setlimit` WRITE;
/*!40000 ALTER TABLE `setlimit` DISABLE KEYS */;
INSERT INTO `setlimit` VALUES (15,'admin1','super1',0,0,5,1000,1000.00,10000.00,0,0,0,0,5,1000.00,1000.00,10000.00);
/*!40000 ALTER TABLE `setlimit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settime`
--

DROP TABLE IF EXISTS `settime`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settime` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL DEFAULT 'guest',
  `admin` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `ilkcba` tinyint unsigned DEFAULT '0',
  `ilkcbk` tinyint unsigned NOT NULL DEFAULT '0',
  `ikicba` tinyint unsigned DEFAULT '0',
  `ikicbk` tinyint unsigned NOT NULL DEFAULT '0',
  `sk` char(6) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL DEFAULT '00:00',
  `sa` char(6) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL DEFAULT '00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin` (`user`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settime`
--

LOCK TABLES `settime` WRITE;
/*!40000 ALTER TABLE `settime` DISABLE KEYS */;
INSERT INTO `settime` VALUES (15,'admin1','super1',0,0,0,0,'00:00','00:00');
/*!40000 ALTER TABLE `settime` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `admin` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `type` char(5) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `operate` char(6) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT '-',
  `filterid` int unsigned NOT NULL,
  `rate` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1910 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_turkish_ci ROW_FORMAT=FIXED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `soccerfixtures`
--

DROP TABLE IF EXISTS `soccerfixtures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `soccerfixtures` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fixtureid` int unsigned NOT NULL,
  `RegionId` int unsigned NOT NULL,
  `RegionName` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `startdate` varchar(20) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `leagueid` int unsigned NOT NULL,
  `leaguename` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `HomeTeam` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT NULL,
  `AwayTeam` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT NULL,
  `home` char(6) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT '---',
  `draw` char(6) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT '---',
  `away` char(6) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT '---',
  `under` char(6) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT '---',
  `over` char(6) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT '---',
  `yes` char(6) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT '---',
  `no` char(6) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT '---',
  PRIMARY KEY (`id`),
  UNIQUE KEY `fid` (`fixtureid`)
) ENGINE=MyISAM AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_turkish_ci ROW_FORMAT=FIXED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `soccerfixtures`
--

LOCK TABLES `soccerfixtures` WRITE;
/*!40000 ALTER TABLE `soccerfixtures` DISABLE KEYS */;
INSERT INTO `soccerfixtures` VALUES (1,10285377,33,'Brezilya','2020-07-23T00:30:00Z',123,'Campeonato Paulista','Corinthians','Palmeiras','3.25','2.85','2.25','1.48','2.45','2.10','1.65'),(2,10290000,33,'Brezilya','2020-07-23T00:30:00Z',5397,'Campeonato Gaucho','SC Internacional Porto Alegre','Gremio RS','2.70','2.90','2.60','1.40','2.75','2.25','1.57'),(3,10289557,39,'USA','2020-07-23T02:00:00Z',76409,'NWSL Challenge Cup','Chicago Red Stars','Sky Blue FC','2.10','3.00','3.30','1.34','3.00','2.55','1.45'),(4,10259522,9,'Kuzey Amerika','2020-07-23T02:30:00Z',76318,'MLS is Back Tournament','Colorado Rapids','Minnesota United FC','2.95','3.70','2.25','2.15','1.65','1.57','2.25'),(5,10262011,224,'Vietnam','2020-07-23T09:30:00Z',50659,'V-League 2','Binh Dinh','Tay Ninh','1.75','3.30','4.33','1.75','1.95','1.87','1.83'),(6,10262012,224,'Vietnam','2020-07-23T10:00:00Z',50659,'V-League 2','Binh Phuoc','Dak Lak','1.53','3.80','5.25','1.85','1.85','1.95','1.75'),(7,10268034,224,'Vietnam','2020-07-23T10:00:00Z',8527,'V-League','Thanh Hoa','Hoang Anh Gia Lai','2.25','3.20','2.85','1.57','2.25','2.00','1.72'),(8,10268035,224,'Vietnam','2020-07-23T11:00:00Z',8527,'V-League','Nam Dinh','Becamex BD','2.75','3.20','2.30','1.75','1.95','1.75','1.95'),(9,10268036,224,'Vietnam','2020-07-23T12:15:00Z',8527,'V-League','Viettel FC','Da Nang','1.72','3.40','4.25','2.30','1.55','1.53','2.35'),(10,10285165,9,'Kuzey Amerika','2020-07-23T13:00:00Z',76318,'MLS is Back Tournament','Chicago Fire','Vancouver Whitecaps FC','1.57','4.50','5.25','2.15','1.65','1.75','1.95'),(11,10292195,209,'Tanzanya','2020-07-23T13:00:00Z',57304,'Ligi Kuu Bara','Alliance FC','Ndanda','2.10','2.90','3.50','1.40','2.75','1.75','1.95'),(12,10292196,209,'Tanzanya','2020-07-23T13:00:00Z',57304,'Ligi Kuu Bara','Coastal Union FC','Simba SC','2.90','3.20','2.20','1.65','2.10','1.75','1.95'),(13,10292197,209,'Tanzanya','2020-07-23T13:00:00Z',57304,'Ligi Kuu Bara','LIPULI FC','Ruvu Shooting','1.72','3.25','4.50','1.50','2.40','1.75','1.95'),(14,10292198,209,'Tanzanya','2020-07-23T13:00:00Z',57304,'Ligi Kuu Bara','Polisi Tanzania','JKT Tanzania','2.15','2.95','3.30','1.40','2.75','1.75','1.95'),(15,10267777,53,'Ukrayna','2020-07-23T14:00:00Z',6772,'Persha Liga','FC Ingulets Petrovo','Chernomorets Odessa','1.50','3.90','5.25','1.95','1.75','1.87','1.85'),(16,10291826,206,'Suriye','2020-07-23T14:00:00Z',7919,'Syrian League','Al Jaish','Jabala','2.40','3.20','2.60','1.65','2.10','1.90','1.80'),(17,10291827,206,'Suriye','2020-07-23T14:00:00Z',7919,'Syrian League','Tishreen','Al-Ittihad SC Aleppo','1.36','4.25','7.25','1.65','2.10','2.55','1.45'),(18,10291828,206,'Suriye','2020-07-23T14:00:00Z',7919,'Syrian League','Al Wathbah','Al Shorta Damascus','1.25','4.75','10.00','1.80','1.91','2.65','1.42'),(19,10291830,206,'Suriye','2020-07-23T14:00:00Z',7919,'Syrian League','Al Wahda Damascus','Foutoua','1.91','3.20','3.60','1.60','2.20','2.05','1.70'),(20,10291831,206,'Suriye','2020-07-23T14:00:00Z',7919,'Syrian League','Al-Nawaeir','Al-Karamah','1.72','3.40','4.33','1.50','2.40','2.30','1.55'),(21,10291832,206,'Suriye','2020-07-23T14:00:00Z',7919,'Syrian League','Al-Sahel','Taliya SC','1.60','3.50','5.00','1.62','2.15','2.20','1.60'),(22,10291833,206,'Suriye','2020-07-23T14:00:00Z',7919,'Syrian League','Al-Jazeera Hasakah','Hutteen SC','13.50','6.00','1.15','1.95','1.75','3.00','1.34'),(23,10292128,33,'Brezilya','2020-07-23T14:00:00Z',5397,'Campeonato Gaucho','EC Juventude RS','Caxias do Sul','2.70','3.00','2.55','1.55','2.30','2.00','1.72'),(24,10267023,151,'Litvanya','2020-07-23T15:00:00Z',5405,'A Lyga','Kauno Zalgiris','FK Panevezys','1.36','4.75','6.00','1.95','1.75','2.10','1.65'),(25,10292925,15,'Finlandiya','2020-07-23T15:30:00Z',76237,'Kolmonen','TPS II','Peimari United','1.95','3.75','3.00','3.20','1.30','1.30','3.20'),(26,10292036,15,'Finlandiya','2020-07-23T15:40:00Z',76237,'Kolmonen','VJS Vantaan Jalkapalloseura','JoKi','1.48','4.50','4.75','4.00','1.20','1.30','3.20'),(27,10291959,136,'İran','2020-07-23T15:45:00Z',5552,'Pro League','Shahr Khodrou','Tractor Sazi','2.40','2.75','3.00','1.44','2.60','2.15','1.62'),(28,10291960,136,'İran','2020-07-23T15:45:00Z',5552,'Pro League','Machine Sazi Tabriz','Gol Gohar Sirjan','2.25','2.75','3.30','1.40','2.70','2.25','1.57'),(29,10260448,13,'Danimarka','2020-07-23T16:00:00Z',143,'1st Division','FC Fredericia','Nykobing FC','1.67','4.40','4.10','2.70','1.40','1.48','2.50'),(30,10263166,12,'Çek Cumhuriyeti','2020-07-23T16:00:00Z',445,'1. Liga','Fastav Zlin','MFK Karvina','3.90','3.80','1.72','2.00','1.72','1.72','2.00'),(31,10263167,12,'Çek Cumhuriyeti','2020-07-23T16:00:00Z',445,'1. Liga','SFC Opava','SK Sigma Olomouc','1.22','6.50','8.00','2.45','1.48','2.05','1.70'),(32,10263195,61,'Estonya','2020-07-23T16:00:00Z',16387,'Esiliiga','FC Elva','Nomme United','2.45','3.70','2.25','2.40','1.50','1.48','2.45'),(33,10267024,151,'Litvanya','2020-07-23T16:00:00Z',5405,'A Lyga','Suduva','FK Banga Gargzdai','1.20','6.00','9.25','2.10','1.65','2.40','1.50'),(34,10284959,13,'Danimarka','2020-07-23T16:00:00Z',70435,'Superligaen - Playoffs','Odense BK','AC Horsens','1.95','3.40','3.80','1.70','2.05','1.91','1.80'),(35,10289305,12,'Çek Cumhuriyeti','2020-07-23T16:00:00Z',445,'1. Liga','1. FK Pribram','FK Teplice','1.28','5.25','7.75','2.20','1.60','2.05','1.70'),(36,10292037,15,'Finlandiya','2020-07-23T16:00:00Z',76237,'Kolmonen','AC Barca','Kings SC Kuopio','1.67','4.40','3.50','3.20','1.30','2.05','1.70'),(37,10292038,15,'Finlandiya','2020-07-23T16:00:00Z',76237,'Kolmonen','TKT','Saaksjaerven Loiske','5.00','4.20','1.48','4.00','1.20','2.05','1.70'),(38,10292039,15,'Finlandiya','2020-07-23T16:00:00Z',76237,'Kolmonen','TP-T','Pato','1.36','4.75','6.00','3.80','1.22','2.05','1.70'),(39,10292199,209,'Tanzanya','2020-07-23T16:00:00Z',57304,'Ligi Kuu Bara','Azam FC','Mbeya City','1.40','4.10','6.50','1.55','2.30','2.05','1.70'),(40,10292926,15,'Finlandiya','2020-07-23T16:00:00Z',76237,'Kolmonen','Paiha','FC Inter II','3.25','4.40','1.75','4.00','1.20','1.26','3.50'),(41,10291961,136,'İran','2020-07-23T16:15:00Z',5552,'Pro League','Sepahan','Sanat Naft Novin Abadan','1.67','3.20','5.00','1.50','2.40','2.35','1.53'),(42,10291962,136,'İran','2020-07-23T16:30:00Z',5552,'Pro League','Esteghlal','Nassaji Mazandaran','1.55','3.40','5.75','1.70','2.05','2.10','1.65'),(43,10291963,136,'İran','2020-07-23T16:30:00Z',5552,'Pro League','Foolad Khouzestan FC','Zob Ahan','2.10','2.95','3.40','1.53','2.35','2.05','1.70'),(44,10291974,136,'İran','2020-07-23T16:30:00Z',5552,'Pro League','Shahin Bushehr','SaiPa','2.75','2.60','2.75','1.57','2.25','1.87','1.83'),(45,10291975,136,'İran','2020-07-23T16:30:00Z',5552,'Pro League','Paykan','Pars Jonoubi Jam FC','2.50','2.75','2.90','1.48','2.45','2.05','1.70'),(46,10267025,151,'Litvanya','2020-07-23T17:00:00Z',5405,'A Lyga','Zalgiris Vilnius','FK Riteriai','1.20','6.00','9.25','2.25','1.57','2.20','1.60'),(47,10267368,29,'İsveç','2020-07-23T17:00:00Z',103,'Allsvenskan','Helsingborgs IF','Orebro SK','2.25','3.30','3.10','1.75','1.95','1.75','1.95'),(48,10267369,29,'İsveç','2020-07-23T17:00:00Z',103,'Allsvenskan','IFK Göteborg','Falkenbergs FF','1.70','3.60','5.00','1.72','2.00','1.95','1.75'),(49,10267370,29,'İsveç','2020-07-23T17:00:00Z',103,'Allsvenskan','Kalmar FF','IK Sirius FK','3.20','3.20','2.25','1.70','2.05','1.83','1.87'),(50,10267371,29,'İsveç','2020-07-23T17:00:00Z',103,'Allsvenskan','Malmo FF','Hammarby','1.70','3.80','4.60','2.05','1.70','1.70','2.05'),(51,10267372,29,'İsveç','2020-07-23T17:00:00Z',103,'Allsvenskan','Mjällby AIF','IF Elfsborg','2.60','3.10','2.75','1.62','2.15','1.87','1.85'),(52,10289805,31,'Türkiye','2020-07-23T17:00:00Z',39470,'3. League - Playoffs','Somaspor SK','Muglaspor','2.55','2.95','2.65','1.62','2.15','1.87','1.83'),(53,10292058,29,'İsveç','2020-07-23T17:00:00Z',9615,'1st Division Norra','Nykopings BIS','IF Karlstad','4.75','4.40','1.48','3.00','1.34','1.44','2.60'),(54,10292164,6,'Dünya','2020-07-23T17:00:00Z',755,'Club Friendlies','Eintracht Mahlsdorf','SV Lichtenberg 47','10.50','8.50','1.11','5.75','1.10','1.44','2.60'),(55,10292298,116,'Faroe Adaları','2020-07-23T17:00:00Z',27831,'Betrideildin','HB Torshavn','B36 Torshavn','2.00','3.60','3.00','2.40','1.50','1.48','2.50'),(56,10292040,15,'Finlandiya','2020-07-23T17:15:00Z',76237,'Kolmonen','FC Espoo II','FC Pohu','1.30','5.75','6.00','2.95','1.35','1.48','2.50'),(57,10292041,15,'Finlandiya','2020-07-23T17:15:00Z',76237,'Kolmonen','Töölön Taisto','Herto','2.00','4.50','2.60','3.20','1.30','1.48','2.50'),(58,10206089,20,'İtalya','2020-07-23T17:30:00Z',42,'Serie A','Udinese','Juventus','6.00','4.00','1.57','2.10','1.67','1.72','2.00'),(59,10258228,13,'Danimarka','2020-07-23T18:00:00Z',3902,'Superligaen','Aalborg BK','FC Copenhagen','3.10','3.50','2.15','2.05','1.70','1.60','2.20'),(60,10265006,49,'İzlanda','2020-07-23T18:00:00Z',17954,'Urvalsdeild','IA Akranes','Stjarnan','3.75','3.80','1.75','2.60','1.45','1.48','2.50'),(61,10289726,28,'İspanya','2020-07-23T18:00:00Z',3735,'Segunda B - Promotion play-off','CD Atletico Baleares','UE Cornella','1.80','3.10','4.25','1.70','2.05','1.91','1.80'),(62,10289727,28,'İspanya','2020-07-23T18:00:00Z',3735,'Segunda B - Promotion play-off','FC Barcelona B','CD Badajoz','1.95','3.10','3.60','1.55','2.30','2.05','1.70'),(63,10292115,33,'Brezilya','2020-07-23T18:00:00Z',123,'Campeonato Paulista','Agua Santa','Mirassol','1.53','3.40','6.50','1.53','2.35','2.45','1.48'),(64,10259297,30,'İsviçre','2020-07-23T18:30:00Z',1455,'Super League','Neuchatel Xamax','BSC Young Boys','6.00','4.60','1.45','2.75','1.40','1.55','2.30'),(65,10264962,49,'İzlanda','2020-07-23T19:00:00Z',50097,'3. Deild','Einherji','Alftanes','2.10','3.75','2.70','3.10','1.33','1.33','3.10'),(66,10289806,31,'Türkiye','2020-07-23T19:00:00Z',39470,'3. League - Playoffs','Pazarspor','Nevsehir Spor Genclik','2.50','3.20','2.50','1.70','2.05','1.85','1.85'),(67,10292093,33,'Brezilya','2020-07-23T19:00:00Z',19510,'Campeonato Baiano','EC Vitoria Salvador','Bahia de Feira','2.15','3.40','2.85','1.75','1.95','1.83','1.87'),(68,10292096,33,'Brezilya','2020-07-23T19:00:00Z',19510,'Campeonato Baiano','Alagoinhas AC BA','Bahia/BA','3.80','3.40','1.80','1.85','1.85','1.80','1.91'),(69,10265007,49,'İzlanda','2020-07-23T19:15:00Z',17954,'Urvalsdeild','Grotta','Vikingur Reykjavik','7.00','4.75','1.34','2.65','1.45','1.70','2.05'),(70,10265008,49,'İzlanda','2020-07-23T19:15:00Z',17954,'Urvalsdeild','Valur Reykjavik','Fylkir Reykjavik','1.40','4.40','6.25','2.95','1.36','1.50','2.40'),(71,10206090,20,'İtalya','2020-07-23T19:45:00Z',42,'Serie A','Lazio Rome','Cagliari','1.45','4.60','7.00','2.45','1.50','1.65','2.10'),(72,10264966,49,'İzlanda','2020-07-23T20:00:00Z',50097,'3. Deild','KV Vesturbaer','Aegir Thorlakshofn','1.33','5.25','6.00','3.60','1.25','1.44','2.60'),(73,10289728,28,'İspanya','2020-07-23T20:00:00Z',3735,'Segunda B - Promotion play-off','CD Castellon','SCR Pena Deportiva','1.60','3.60','4.75','1.75','1.95','2.00','1.72'),(74,10289729,28,'İspanya','2020-07-23T20:00:00Z',3735,'Segunda B - Promotion play-off','Cultural Leonesa','Sabadell','1.80','3.30','4.00','1.65','2.10','2.00','1.72'),(75,10293088,49,'İzlanda','2020-07-23T20:00:00Z',50099,'4. Deild','Stokkseyri','Alafoss','1.78','4.75','3.00','4.00','1.20','2.00','1.72'),(76,10265009,49,'İzlanda','2020-07-23T20:15:00Z',17954,'Urvalsdeild','Hk Kopavogs','Breidablik Kopavogur','6.00','4.50','1.40','2.80','1.40','1.55','2.30'),(77,10292116,33,'Brezilya','2020-07-23T20:30:00Z',123,'Campeonato Paulista','Inter de Limeira','Oeste','2.15','3.20','3.10','1.50','2.40','2.15','1.62');
/*!40000 ALTER TABLE `soccerfixtures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `soccerinplaymarkets`
--

DROP TABLE IF EXISTS `soccerinplaymarkets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `soccerinplaymarkets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mid` int unsigned NOT NULL,
  `mn` varchar(60) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT NULL,
  `admin1` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `betid` (`mid`)
) ENGINE=InnoDB AUTO_INCREMENT=1092 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `soccerinplaymarkets`
--

LOCK TABLES `soccerinplaymarkets` WRITE;
/*!40000 ALTER TABLE `soccerinplaymarkets` DISABLE KEYS */;
INSERT INTO `soccerinplaymarkets` VALUES (971,118,'G 1.Gol',1),(972,119,'B 1.Korner',1),(973,12119,'İ Beraberlikte İade',1),(974,3187,'S çifte Şans',1),(975,19705,'D Delasman Her İki Devre Gol',1),(976,17673,'D Deplasman Devre Gol',1),(977,16455,'D Deplasman Gol Alt/Üst 1.5',1),(978,20085,'D Deplasman Gol Alt/Üst 2.5',1),(979,11086,'D Deplasman Gol Atarmı',1),(980,4727,'D Deplasman Gol Sayısı (3+)',1),(981,15052,'D Deplasman Gol Yemeden Kazanırmı',1),(982,4785,'B Deplasman Toplam Korner Alt/Üst 5.5',1),(983,4792,'B Deplasman İkinci Yarı Toplam Korner Alt/Üst 2.5',1),(984,1329,'G Hangi Devre Gol Çok Olur?',1),(985,4794,'B Hangi Devre Çok Korner Olur?',1),(986,4793,'B En Çok Korner',1),(987,17672,'E Evsahibi Devre Gol',1),(988,11087,'E Evsahibi Gol Atarmı',1),(989,4726,'E Evsahibi Gol Sayısı (3+)',1),(990,15051,'E Evsahibi Gol Yemeden Kazanırmı',1),(991,19704,'E Evsahibi Her İki Devre Gol',1),(992,16456,'E Evsahibi Toplam Gol Alt/Üst 1.5',1),(993,24138,'E Evsahibi Toplam Gol Alt/Üst 2.5',1),(994,4784,'B Evsahibi Toplam Korner Alt/Üst 3.5',1),(995,4791,'B Evsahibi İkinci Yarı Toplam Korner Alt/Üst 2.5',1),(996,4787,'B Evsahibi İlk Yarı Toplam Korner Alt/Üst 1.5',1),(997,52,'H Handikap 0:1',1),(998,54,'H Handikap 1:0',1),(999,501,'H Handikap 0:2',1),(1000,502,'H Handikap 2:0',1),(1001,4778,'G İkinci Yarı Hangi Takım Daha Çok Gol Atar?',1),(1002,1107,'B İkinci Yarı 1. Korner',1),(1003,4734,'D İkinci Yarı Deplasman Gol Sayısı (3+)',1),(1004,19897,'B İkinci Yarı En Çok Korner',1),(1005,4733,'E İkinci Yarı Evsahibi Gol Sayısı (3+)',1),(1006,4732,'G İkinci Yarı Gol Sayısı (3+)',1),(1007,11595,'G İkinci Yarı Toplam Gol Alt/Üst 0.5',1),(1008,11596,'G İkinci Yarı Toplam Gol Alt/Üst 1.5',1),(1009,11597,'G İkinci Yarı Toplam Gol Alt/Üst 2.5',1),(1010,20506,'G İkinci Yarı Toplam Gol Alt/Üst 3.5',1),(1011,4790,'B İkinci Yarı Toplam Korner Alt/Üst',1),(1012,4728,'G İkinci Yarı İlk Golü Hangi Takım Atar',1),(1013,4956,'G İlk Yarı 1.Gol',1),(1014,4721,'D İlk Yarı Deplasman Gol Sayısı (3+)',1),(1015,31319,'D İlk Yarı Deplasman Toplam Gol Alt/Üst 0.5',1),(1016,31320,'D İlk Yarı Deplasman Toplam Gol Alt/Üst 1.5',1),(1017,13497,'B İlk Yarı En Çok Korner',1),(1018,4720,'E İlk Yarı Evsahibi Gol Sayısı (3+)',1),(1019,31316,'E İlk Yarı Evsahibi Toplam Gol Alt/Üst 0.5',1),(1020,31317,'E İlk Yarı Evsahibi Toplam Gol Alt/Üst 1.5',1),(1021,27536,'G İlk Yarı Gol Aralıgı (0-2+)',1),(1022,27537,'G İlk Yarı Gol Aralıgı (0-3+)',1),(1023,4718,'G İlk Yarı Gol Sayısı (3+)',1),(1024,15085,'G İlk Yarı Karşılıklı Gol',1),(1025,26644,'R İlk Yarı Kesin Skor',1),(1026,2488,'M İlk Yarı Bahsi',1),(1027,7688,'G İlk Yarı Toplam Gol Alt/Üst 0.5',1),(1028,7689,'G İlk Yarı Toplam Gol Alt/Üst 1.5',1),(1029,7690,'G İlk Yarı Toplam Gol Alt/Üst 2.5',1),(1030,7691,'G İlk Yarı Toplam Gol Alt/Üst 3.5',1),(1031,16449,'G İlk Yarı Toplam Gol Tek/Çift',1),(1032,4786,'B İlk Yarı Toplam Korner Alt/Üst',1),(1033,17931,'B İlk Yarı Toplam Korner Tek/Çift',1),(1034,21,'M İlk Yarı ve Maç Bahsi',1),(1035,11748,'Ş İlk Yarı Çifte Şans',1),(1036,7824,'G Karşılıklı Gol',1),(1037,19193,'R Kesin Skor',1),(1038,15491,'B Korner Yarışı',1),(1039,15492,'B Korner Yarışı İkinci Yarı',1),(1040,21043,'M Maç Bahsi ve Golcü',1),(1041,24392,'M Maç Bahsi ve Karşılıklı Gol',1),(1042,17,'M Maç Bahsi',1),(1043,20589,'M Maç Bahsi ve Toplam Gol Alt/Üst 2.5',1),(1044,20592,'M Maç Bahsi ve Toplam Gol Alt/Üst 3.5',1),(1045,4722,'G Son Golü Hangi Takım Atar',1),(1046,19508,'F Takımlardan Biri 1 Farkla Kazanırmı',1),(1047,19509,'F Takımlardan Biri 2 Farkla Kazanırmı',1),(1048,19510,'F Takımlardan Biri 3 Farkla Kazanırmı',1),(1049,7233,'G Toplam Gol Alt/Üst 0.5',1),(1050,1772,'G Toplam Gol Alt/Üst 1.5',1),(1051,173,'G Toplam Gol Alt/Üst 2.5',1),(1052,8933,'G Toplam Gol Alt/Üst 3.5',1),(1053,1791,'G Toplam Gol Alt/Üst 4.5',1),(1054,859,'G Toplam Gol Alt/Üst 5.5',1),(1055,27531,'G Toplam Gol Aralıgı (0-4+)',1),(1056,27534,'G Toplam Gol Aralıgı (0-5+)',1),(1057,27535,'G Toplam Gol Aralıgı (0-6+)',1),(1058,20095,'G Toplam Gol Sayısı (5+)',1),(1059,2196,'G Toplam Gol Sayısı (8+)',1),(1060,4665,'G Toplam Gol Tek/Çift',1),(1061,4523,'B Toplam Korner Alt/Üst',1),(1062,17925,'B Toplam Korner Tek/Çift',1),(1064,13461,'G İlk Yarı 2.Gol',1),(1065,13462,'G İlk Yarı 3.Gol',1),(1066,13463,'G İlk Yarı 4.Gol',1),(1067,313,'G Toplam Gol Alt/Üst 6.5',1),(1068,1983,'G Toplam Gol Alt/Üst 7.5',1),(1069,322,'G Toplam Gol Alt/Üst 8.5',1),(1070,4016,'G Toplam Gol Alt/Üst 9.5',1),(1071,1344,'G 2.Gol',1),(1072,1345,'G 3.Gol',1),(1073,1346,'G 4.Gol',1),(1074,1347,'G 5.Gol',1),(1075,1348,'G 6.Gol',1),(1076,2199,'G 7.Gol',1),(1077,20084,'E Evsahibi Gol Alt/Üst 0.5',1),(1078,20087,'E Evsahibi Gol Alt/Üst 3.5',1),(1079,20089,'E Evsahibi Gol Alt/Üst 4.5',1),(1080,27538,'E Evsahibi Gol Alt/Üst 5.5',1),(1081,20088,'D Deplasman Gol Alt/Üst 3.5',1),(1082,20090,'D Deplasman Gol Alt/Üst 4.5',1),(1083,27540,'D Deplasman Gol Alt/Üst 5.5',1),(1084,31318,'E İlk Yarı Evsahibi Gol Alt/Üst 2.5',1),(1085,31321,'D İlk Yarı Deplasman Gol Alt/Üst 2.5',1),(1086,19511,'F Takımlardan Biri 4 Farkla Kazanırmı',1),(1087,19512,'F Takımlardan Biri 5 Farkla Kazanırmı',1),(1088,20083,'E Evsahibi 0,5 Golle Kazanırmı',1),(1089,24599,'G İkinci Yarı Toplam Gol Alt/Üst 6.5',1),(1090,24600,'G İkinci Yarı Toplam Gol Alt/Üst 7.5',1),(1091,24601,'G İkinci Yarı Toplam Gol Alt/Üst 8.5',1);
/*!40000 ALTER TABLE `soccerinplaymarkets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `soccermarkets`
--

DROP TABLE IF EXISTS `soccermarkets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `soccermarkets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mid` int unsigned NOT NULL,
  `mn` varchar(60) CHARACTER SET utf8 COLLATE utf8_turkish_ci DEFAULT NULL,
  `admin1` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `betid` (`mid`)
) ENGINE=InnoDB AUTO_INCREMENT=1374 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `soccermarkets`
--

LOCK TABLES `soccermarkets` WRITE;
/*!40000 ALTER TABLE `soccermarkets` DISABLE KEYS */;
INSERT INTO `soccermarkets` VALUES (1281,118,'G 1.Gol',1),(1282,12119,'İ Beraberlikte İade',1),(1283,3187,'S Çifte Şans',1),(1284,19705,'D Deplasman Her İki Devre Gol',1),(1285,17673,'D Deplasman Devre Gol',1),(1286,16455,'D Deplasman Gol Alt/Üst 1.5',1),(1287,20085,'D Deplasman Gol Alt/Üst 2.5',1),(1288,11086,'D Deplasman Gol Atarmı',1),(1289,4727,'D Deplasman Gol Sayısı (3+)',1),(1290,15052,'D Deplasman Gol Yemeden Kazanırmı',1),(1291,4785,'B Deplasman Toplam Korner Alt/Üst 5.5',1),(1292,4792,'D Deplasman İkinci Yarı Toplam Korner Alt/Üst 2.5',1),(1293,4788,'B Deplasman İlk Yarı Toplam Korner Alt/Üst 2.5',1),(1294,1329,'G Hangi Devre Çok Gol Olur?',1),(1295,4794,'B Hangi Devre Çok Korner Olur?',1),(1296,4793,'B En Çok Korner',1),(1297,17672,'E Evsahibi Devre Gol',1),(1298,11087,'E Evsahibi Gol Atarmı',1),(1299,4726,'E Evsahibi Gol Sayısı (3+)',1),(1300,15051,'E Evsahibi Gol Yemeden Kazanırmı',1),(1301,19704,'E Evsahibi Her İki Devre Gol',1),(1302,16456,'E Evsahibi Gol Alt/Üst 1.5',1),(1303,24138,'E Evsahibi Gol Alt/Üst 2.5',1),(1304,4784,'B Evsahibi Toplam Korner Alt/Üst 3.5',1),(1305,4791,'B Evsahibi İkinci Yarı Toplam Korner Alt/Üst 2.5',1),(1306,4787,'B Evsahibi İlk Yarı Toplam Korner Alt/Üst 1.5',1),(1307,52,'H Handikap 0:1',1),(1308,54,'H Handikap 1:0',1),(1309,501,'H Handikap 0:2',1),(1310,502,'H Handikap 2:0',1),(1311,4778,'G İkinci Yarı Hangi Takım Daha Çok Gol Atar',1),(1312,1107,'B İkinci Yarı 1. Korner',1),(1313,4734,'D İkinci Yarı Deplasman Gol Sayısı (3+)',1),(1314,19897,'B İkinci Yarı En Çok Korner',1),(1315,4733,'E İkinci Yarı Evsahibi Gol Sayısı (3+)',1),(1316,4732,'G İkinci Yarı Gol Sayısı (3+)',1),(1317,11595,'G İkinci Yarı Toplam Gol Alt/Üst 0.5',1),(1318,11596,'G İkinci Yarı Toplam Gol Alt/Üst 1.5',1),(1319,11597,'G İkinci Yarı Toplam Gol Alt/Üst 2.5',1),(1320,20506,'G İkinci Yarı Toplam Gol Alt/Üst 3.5',1),(1321,4790,'B İkinci Yarı Toplam Korner Alt/Üst',1),(1322,4728,'G İkinci Yarı İlk Golü Hangi Takım Atar',1),(1323,4956,'G İlk Yarı 1.Gol',1),(1324,4721,'D İlk Yarı Deplasman Gol Sayısı (3+)',1),(1325,31319,'D İlk Yarı Deplasman Toplam Gol Alt/Üst 0.5',1),(1326,31320,'D İlk Yarı Deplasman Toplam Gol Alt/Üst 1.5',1),(1327,13497,'B İlk Yarı En Çok Korner',1),(1328,4720,'E İlk Yarı Evsahibi Gol Sayısı (3+)',1),(1329,31316,'E İlk Yarı Evsahibi Gol Alt/Üst 0.5',1),(1330,31317,'E İlk Yarı Evsahibi Gol Alt/Üst 1.5',1),(1331,27536,'G İlk Yarı Gol Aralıgı (0-2+)',1),(1332,27537,'G İlk Yarı Gol Aralıgı (0-3+)',1),(1333,4718,'G İlk Yarı Gol Sayısı (3+)',1),(1334,15085,'G İlk Yarı Karşılıklı Gol',1),(1335,26644,'R İlk Yarı Kesin Skor',1),(1336,2488,'M İlk Yarı Bahsi',1),(1337,7688,'G İlk Yarı Toplam Gol Alt/Üst 0.5',1),(1338,7689,'G İlk Yarı Toplam Gol Alt/Üst 1.5',1),(1339,7690,'G İlk Yarı Toplam Gol Alt/Üst 2.5',1),(1340,7691,'G İlk Yarı Toplam Gol Alt/Üst 3.5',1),(1341,16449,'G İlk Yarı Toplam Gol Tek/Çift',1),(1342,4786,'B İlk Yarı Toplam Korner Alt/Üst',1),(1343,17931,'B İlk Yarı Toplam Korner Tek/Çift',1),(1344,21,'M İlk Yarı ve Maç Bahsi',1),(1345,11748,'S İlk Yarı Çifte Şans',1),(1346,7824,'G Karşılıklı Gol',1),(1347,19193,'R Kesin Skor',1),(1348,15491,'B Korner Yarışı',1),(1349,15492,'B Korner Yarışı İkinci Yarı',1),(1350,21043,'M Maç Bahsi ve Golcü',1),(1351,24392,'M Maç Bahsi ve Karşılıklı Gol',1),(1352,17,'M Maç Bahsi',1),(1353,20589,'M Maç Bahsi ve Toplam Gol Alt/Üst 2.5',1),(1354,20592,'M Maç Bahsi ve Toplam Gol Alt/Üst 3.5',1),(1355,4722,'G Son Golü Hangi Takım Atar',1),(1356,19508,'F Takımlardan Biri 1 Farkla Kazanırmı',1),(1357,19509,'F Takımlardan Biri 2 Farkla Kazanırmı',1),(1358,19510,'F Takımlardan Biri 3 Farkla Kazanırmı',1),(1359,7233,'G Toplam Gol Alt/Üst 0.5',1),(1360,1772,'G Toplam Gol Alt/Üst 1.5',1),(1361,173,'G Toplam Gol Alt/Üst 2.5',1),(1362,8933,'G Toplam Gol Alt/Üst 3.5',1),(1363,1791,'G Toplam Gol Alt/Üst 4.5',1),(1364,859,'G Toplam Gol Alt/Üst 5.5',1),(1365,27531,'G Toplam Gol Aralıgı (0-4+)',1),(1366,27534,'G Toplam Gol Aralıgı (0-5+)',1),(1367,27535,'G Toplam Gol Aralıgı (0-6+)',1),(1368,20095,'G Toplam Gol Sayısı (5+)',1),(1369,2196,'G Toplam Gol Sayısı (8+)',1),(1370,4665,'G Toplam Gol Tek/Çift',1),(1371,4523,'B Toplam Korner Alt/Üst',1),(1372,17925,'B Toplam Korner Tek/Çift',1),(1373,22953,'G Karşılıklı Gol ve Toplam Gol Alt/Üst 3.5',1);
/*!40000 ALTER TABLE `soccermarkets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `nick` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `pass` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `admin` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL DEFAULT 'no',
  `superadmin` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL DEFAULT 'tevye',
  `credit` decimal(10,2) NOT NULL DEFAULT '0.00',
  `creditremain` decimal(10,2) NOT NULL DEFAULT '0.00',
  `role` varchar(15) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `userlimit` tinyint unsigned NOT NULL DEFAULT '0',
  `usedlimit` tinyint unsigned NOT NULL DEFAULT '0',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `state` char(10) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL DEFAULT 'aktif',
  `payment` datetime DEFAULT NULL,
  `usercomission` tinyint unsigned NOT NULL DEFAULT '40',
  `personcomission` tinyint unsigned NOT NULL DEFAULT '5',
  `fakelogin` tinyint unsigned NOT NULL DEFAULT '0',
  `logincount` tinyint unsigned NOT NULL DEFAULT '5',
  `logincheck` char(10) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL DEFAULT 'passive',
  `multilogin` tinyint(1) NOT NULL DEFAULT '1',
  `sessioncount` tinyint unsigned NOT NULL DEFAULT '0',
  `resetaccount` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `autopay` tinyint(1) NOT NULL DEFAULT '0',
  `usercancelbet` smallint unsigned NOT NULL DEFAULT '15',
  `personcancelbet` smallint unsigned NOT NULL DEFAULT '15',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user` (`user`),
  UNIQUE KEY `nick` (`nick`),
  UNIQUE KEY `id` (`id`),
  KEY `credit` (`credit`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Boss','1830','1a488092f9b8aac6962770c0ef4ee66a4d74c431','no','no',0.00,0.00,'Boss',40,2,'2020-02-08 22:39:43','aktif',NULL,40,5,0,5,'active',1,2,'2020-02-09 01:39:43',0,15,15),(100,'super1','super','4f46fb21d9e9a137e3a5c69f280550863b36c0a0','Boss','no',0.00,0.00,'Superadmin',5,1,'2021-07-31 22:41:01','aktif','2021-08-01 01:41:02',40,5,0,5,'passive',1,0,'2021-08-01 01:41:01',0,15,15),(101,'admin1','admin','fe8f0d3817f674446447c30251b1da45ede951cc','super1','Boss',0.00,0.00,'Admin',5,2,'2021-07-31 22:41:31','aktif','2021-08-01 01:41:32',40,5,0,5,'passive',1,0,'2021-08-01 01:41:31',0,15,15),(102,'subadmin','subadmin','90bdc62211547c4fff5f128ab63c931a418ff6ef','admin1','super1',5000.00,4500.00,'Subadmin',5,1,'2021-07-31 22:42:20','aktif','2021-08-01 01:42:20',40,5,0,5,'passive',1,0,'2021-08-01 01:42:20',0,15,15),(103,'member1','member','6500ea72ee0fd51936b3c4b176569b70dd84f2ce','admin1','super1',5000.00,5000.00,'Member',0,0,'2021-07-31 22:42:42','aktif','2021-08-01 01:42:43',40,5,0,5,'passive',1,0,'2021-08-01 01:42:42',0,15,15),(104,'submember1','submember','05fb669977df0f9d2352786fe578a92a39e74449','subadmin','admin1',500.00,500.00,'Submember',0,0,'2021-07-31 22:43:32','aktif','2021-08-01 01:43:33',40,5,0,5,'passive',1,0,'2021-08-01 01:43:32',0,15,15);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-08-01  1:45:18
