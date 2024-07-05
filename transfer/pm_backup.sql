-- MySQL dump 10.13  Distrib 8.0.37, for Win64 (x86_64)
--
-- Host: localhost    Database: pm
-- ------------------------------------------------------
-- Server version	8.0.37

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
-- Current Database: `pm`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `pm` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `pm`;

--
-- Table structure for table `admin_data`
--

DROP TABLE IF EXISTS `admin_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` text NOT NULL,
  `emp_id` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_data`
--

LOCK TABLES `admin_data` WRITE;
/*!40000 ALTER TABLE `admin_data` DISABLE KEYS */;
INSERT INTO `admin_data` VALUES (1,'nithin','IN011472'),(2,'kalyan','IN011479');
/*!40000 ALTER TABLE `admin_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blocks`
--

DROP TABLE IF EXISTS `blocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blocks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blocks`
--

LOCK TABLES `blocks` WRITE;
/*!40000 ALTER TABLE `blocks` DISABLE KEYS */;
INSERT INTO `blocks` VALUES (12,'Number of versions to be prepared in June'),(13,'Versions in July');
/*!40000 ALTER TABLE `blocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `immediate_milestones`
--

DROP TABLE IF EXISTS `immediate_milestones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `immediate_milestones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_name` varchar(45) DEFAULT 'DEFAULT',
  `str` varchar(45) DEFAULT '...',
  `deadline` varchar(45) DEFAULT '...',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `immediate_milestones`
--

LOCK TABLES `immediate_milestones` WRITE;
/*!40000 ALTER TABLE `immediate_milestones` DISABLE KEYS */;
INSERT INTO `immediate_milestones` VALUES (1,'Zhaoyun_U','STR 5','06/10'),(2,'Panther_U','STR 4','06/12'),(3,'Oscar_U','STR 5','06/13');
/*!40000 ALTER TABLE `immediate_milestones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `input_fields`
--

DROP TABLE IF EXISTS `input_fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `input_fields` (
  `id` int NOT NULL AUTO_INCREMENT,
  `version_block_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `version_block_id` (`version_block_id`),
  CONSTRAINT `input_fields_ibfk_1` FOREIGN KEY (`version_block_id`) REFERENCES `version_block` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `input_fields`
--

LOCK TABLES `input_fields` WRITE;
/*!40000 ALTER TABLE `input_fields` DISABLE KEYS */;
INSERT INTO `input_fields` VALUES (1,3,'version preparation time','06/10'),(2,3,'Tag point','5/21'),(3,3,'security patch level','june-2025'),(9,14,'Version preparation time','06/10'),(10,14,'Tag point','05/21'),(11,14,'Security patch level','June-2024'),(12,14,'T+P task link','https://noah.myoas.com/micro-app/ccm/build?isOwnRecords=ownRecords'),(13,15,'version preparation ','06/10');
/*!40000 ALTER TABLE `input_fields` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `labels`
--

DROP TABLE IF EXISTS `labels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `labels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(255) DEFAULT NULL,
  `text` varchar(255) DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `tab` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `labels_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `menu_items` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `labels`
--

LOCK TABLES `labels` WRITE;
/*!40000 ALTER TABLE `labels` DISABLE KEYS */;
INSERT INTO `labels` VALUES (1,'Milestone','test',5,'Basic'),(2,'New deadline','',5,'Basic'),(3,'Current User','test2',5,'Basic'),(4,'New deadline','test3',5,'Basic'),(5,'Current User','test',5,'Basic'),(6,'Active users','testing',5,'Basic'),(7,'New deadline','now',5,'Basic'),(8,'Status update','nishanth',5,'Basic'),(9,'Status update','fadfa',5,'Basic'),(10,'Milestone','fafafa',5,'Basic'),(11,'Current User','fadfaafadad',5,'Basic');
/*!40000 ALTER TABLE `labels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_items`
--

DROP TABLE IF EXISTS `menu_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `labels` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `menu_items_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `menu_items` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_items`
--

LOCK TABLES `menu_items` WRITE;
/*!40000 ALTER TABLE `menu_items` DISABLE KEYS */;
INSERT INTO `menu_items` VALUES (1,'PDT',NULL,NULL,'folder',NULL,NULL),(2,'UPGRADE',NULL,NULL,'folder',NULL,NULL),(3,'Maintenance',NULL,NULL,'folder',NULL,NULL),(4,'MT6835',NULL,1,'folder',NULL,NULL),(5,'AVATAR MG',NULL,4,'file',1,'1'),(6,'AVATAR L5',NULL,4,'file',1,NULL),(7,'14+U',NULL,2,'folder',NULL,NULL),(8,'SM6375',NULL,7,'folder',NULL,NULL),(9,'COLOMBO',NULL,8,'file',1,NULL),(46,'Oscar',NULL,8,'file',NULL,NULL),(47,'15+V',NULL,2,'folder',NULL,NULL),(48,'SM6375',NULL,47,'folder',NULL,NULL),(49,'Colombo',NULL,48,'file',NULL,NULL),(51,'MT',NULL,3,'folder',NULL,NULL),(76,'demo',NULL,1,'file',NULL,NULL),(80,'new',NULL,51,'file',NULL,NULL);
/*!40000 ALTER TABLE `menu_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `usercount` int DEFAULT NULL,
  `kernelversion` varchar(255) DEFAULT NULL,
  `labels` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (5,'Avatar',10,'3.3.3','[{\"tab\": \"Basic\", \"text\": \"28 jun\", \"label\": \"Deadlines\"}]'),(9,'Colombo',25,'4.5.5','[{\"tab\": \"Basic\", \"text\": \"SRF6\", \"label\": \"Milestone\"}, {\"tab\": \"Regions\", \"text\": \"code pushed\", \"label\": \"United States\"}, {\"tab\": \"Specifications\", \"text\": \"Oneplus\", \"label\": \"Brand\"}, {\"tab\": \"Specifications\", \"text\": \"Nord\", \"label\": \"Model\"}, {\"tab\": \"Operators\", \"text\": \"USA\", \"label\": \"Head Quarters\"}, {\"tab\": \"VersionQuality\", \"text\": \"4.4.5\", \"label\": \"Model version\"}, {\"tab\": \"VersionQuality\", \"text\": \"24 june\", \"label\": \"Launch date\"}]');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status_bars`
--

DROP TABLE IF EXISTS `status_bars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status_bars` (
  `project_id` int NOT NULL,
  `Pre_XTS` json DEFAULT NULL,
  `Preparation` json DEFAULT NULL,
  `Selfcheck` json DEFAULT NULL,
  `Testing` json DEFAULT NULL,
  `OTA_Released` json DEFAULT NULL,
  PRIMARY KEY (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_bars`
--

LOCK TABLES `status_bars` WRITE;
/*!40000 ALTER TABLE `status_bars` DISABLE KEYS */;
INSERT INTO `status_bars` VALUES (3,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(5,'{\"url\": \"https://text-compare.com/\", \"state\": \"completed\", \"status\": \"Pre-XTS\"}','{\"url\": \"\", \"state\": \"completed\", \"status\": \"Preparation\"}','{\"url\": \"\", \"state\": \"ongoing\", \"status\": \"Selfcheck\"}','{\"url\": \"\", \"state\": \"not started\", \"status\": \"Testing\"}','{\"url\": \"\", \"state\": \"not started\", \"status\": \"OTA-Released\"}'),(6,'{\"url\": \"\", \"state\": \"completed\", \"status\": \"Pre-XTS\"}','{\"url\": \"\", \"state\": \"completed\", \"status\": \"Preparation\"}','{\"url\": \"\", \"state\": \"not started\", \"status\": \"Selfcheck\"}','{\"url\": \"\", \"state\": \"not started\", \"status\": \"Testing\"}','{\"url\": \"\", \"state\": \"not started\", \"status\": \"OTA-Released\"}'),(9,'{\"url\": \"http://172.24.176.154:5000/xts?buildversion=PHS110domestic_11_14.0.0.900CN01_2024061922150090\", \"state\": \"not started\", \"status\": \"Pre-XTS\"}','{\"url\": \"https://noah.myoas.com/micro-app/ccm/build?isOwnRecords=ownRecords\", \"state\": \"completed\", \"status\": \"Preparation\"}','{\"url\": \"http://172.24.176.154:8082/rdSelfCheck-Summary?ID=SCTSK_00000135&Project=Colombo+Domestic&BuildVersion=14.0.0.900CN01_2024062411380090_noroot\", \"state\": \"ongoing\", \"status\": \"Selfcheck\"}','{\"url\": \"https://noah.myoas.com/micro-app/ccm/build?isOwnRecords=ownRecords\", \"state\": \"not started\", \"status\": \"Testing\"}','{\"url\": \"https://noah.myoas.com/micro-app/ccm/build?isOwnRecords=ownRecords\", \"state\": \"not started\", \"status\": \"OTA-Released\"}'),(14,'{\"url\": \"https://mov2.myoas.com/web/#/1f4vns2phwh7w1hhkw1eq41ep393dl4k14w0/sys-portal/1f5t4fht6wnewuj23w3n7a3gr2dbb5m21fw0\", \"state\": \"ongoing\", \"status\": \"Pre-XTS\"}','{\"url\": \"\", \"state\": \"not started\", \"status\": \"Preparation\"}','{\"url\": \"\", \"state\": \"not started\", \"status\": \"Selfcheck\"}','{\"url\": \"\", \"state\": \"not started\", \"status\": \"Testing\"}','{\"url\": \"\", \"state\": \"not started\", \"status\": \"OTA-Released\"}'),(15,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(22,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(23,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(25,'{\"url\": \"\", \"state\": \"ongoing\", \"status\": \"Pre-XTS\"}','{\"url\": \"\", \"state\": \"ongoing\", \"status\": \"Preparation\"}','{\"url\": \"\", \"state\": \"not started\", \"status\": \"Selfcheck\"}','{\"url\": \"\", \"state\": \"not started\", \"status\": \"Testing\"}','{\"url\": \"\", \"state\": \"not started\", \"status\": \"OTA-Released\"}'),(26,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(27,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(28,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(31,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(32,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(33,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(36,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(37,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(39,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(40,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(42,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(44,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(45,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(46,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(49,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(50,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(53,'{\"url\": \"\", \"state\": \"not started\", \"status\": \"Pre-XTS\"}','{\"url\": \"\", \"state\": \"not started\", \"status\": \"Preparation\"}','{\"url\": \"\", \"state\": \"not started\", \"status\": \"Selfcheck\"}','{\"url\": \"\", \"state\": \"not started\", \"status\": \"Testing\"}','{\"url\": \"\", \"state\": \"not started\", \"status\": \"OTA-Released\"}'),(54,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(55,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(56,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(57,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(59,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(61,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(62,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(63,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(64,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(65,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(66,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(67,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(68,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(69,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(70,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(71,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(73,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(74,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(75,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(76,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(78,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(79,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}'),(80,'{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}','{\"url\": \"\", \"state\": \"not started\"}');
/*!40000 ALTER TABLE `status_bars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `titles`
--

DROP TABLE IF EXISTS `titles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `titles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `pdt` int DEFAULT '0',
  `upgrade` int DEFAULT '0',
  `maintenance` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `titles`
--

LOCK TABLES `titles` WRITE;
/*!40000 ALTER TABLE `titles` DISABLE KEYS */;
INSERT INTO `titles` VALUES (1,'Version Plan','2024-07-15',0,0,0),(2,'Title 1','2024-08-15',0,0,0),(3,'Title 1','2024-10-15',0,0,0);
/*!40000 ALTER TABLE `titles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `urgent_tasks`
--

DROP TABLE IF EXISTS `urgent_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `urgent_tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_name` varchar(45) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `deadline` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `urgent_tasks`
--

LOCK TABLES `urgent_tasks` WRITE;
/*!40000 ALTER TABLE `urgent_tasks` DISABLE KEYS */;
INSERT INTO `urgent_tasks` VALUES (1,'15+V Burberry baseline upgrade','Basic function Porting','6/07');
/*!40000 ALTER TABLE `urgent_tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `version_block`
--

DROP TABLE IF EXISTS `version_block`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `version_block` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `version_block_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `menu_items` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `version_block`
--

LOCK TABLES `version_block` WRITE;
/*!40000 ALTER TABLE `version_block` DISABLE KEYS */;
INSERT INTO `version_block` VALUES (3,'Current version in market','MP3','','Delivered',5,'2024-07-01'),(14,'Next Version','MP 4','','To be Prepared',9,'2024-07-01'),(15,'current version ','MP','','To be Prepared',46,'2024-08-01'),(19,'new','demo','','To be Prepared',76,'2024-07-01'),(20,'New version added','MP3',NULL,'Delivered',5,'2024-07-01');
/*!40000 ALTER TABLE `version_block` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `version_scope`
--

DROP TABLE IF EXISTS `version_scope`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `version_scope` (
  `id` int NOT NULL AUTO_INCREMENT,
  `version_block_id` int DEFAULT NULL,
  `label` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `completed` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `version_block_id` (`version_block_id`),
  CONSTRAINT `version_scope_ibfk_1` FOREIGN KEY (`version_block_id`) REFERENCES `version_block` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `version_scope`
--

LOCK TABLES `version_scope` WRITE;
/*!40000 ALTER TABLE `version_scope` DISABLE KEYS */;
INSERT INTO `version_scope` VALUES (1,14,'Must fix.','https://noah.myoas.com/',1),(2,14,'security patches','https://text-compare.com/',1),(3,14,'MRQ2 Demands','https://noah.myoas.com/micro-app/ccm/build?isOwnRecords=ownRecords',1),(4,14,'New Requirements','https://noah.myoas.com/micro-app/ccm/build?isOwnRecords=ownRecords',0),(5,14,'Resolve rate','https://noah.myoas.com/micro-app/ccm/build?isOwnRecords=ownRecords',0),(6,3,'Must fix',NULL,NULL),(7,3,'security patches',NULL,NULL),(8,3,'MRQ2 Demands',NULL,NULL),(11,NULL,NULL,NULL,NULL),(12,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `version_scope` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `versions`
--

DROP TABLE IF EXISTS `versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `versions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `version_name` varchar(45) NOT NULL,
  `pdt` int NOT NULL,
  `upgrade` int NOT NULL,
  `maintenance` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `versions`
--

LOCK TABLES `versions` WRITE;
/*!40000 ALTER TABLE `versions` DISABLE KEYS */;
INSERT INTO `versions` VALUES (5,'new',0,0,0);
/*!40000 ALTER TABLE `versions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `widgets`
--

DROP TABLE IF EXISTS `widgets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `widgets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `block_id` int DEFAULT NULL,
  `label` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `block_id` (`block_id`),
  CONSTRAINT `widgets_ibfk_1` FOREIGN KEY (`block_id`) REFERENCES `blocks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `widgets`
--

LOCK TABLES `widgets` WRITE;
/*!40000 ALTER TABLE `widgets` DISABLE KEYS */;
INSERT INTO `widgets` VALUES (12,12,'PDT','4'),(13,12,'Upgrade projects','10'),(14,12,'Maintenance','30'),(15,13,'PDT','1'),(16,13,'UPGRADE','2'),(26,13,'MR','5');
/*!40000 ALTER TABLE `widgets` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-05 20:19:46
