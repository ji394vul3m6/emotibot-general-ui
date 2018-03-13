-- phpMyAdmin SQL Dump
-- version 4.7.2
-- https://www.phpmyadmin.net/
--
-- 主機: db
-- 產生時間： 2017 年 07 月 24 日 09:59
-- 伺服器版本: 5.7.18
-- PHP 版本： 7.0.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `emotibot`
--
CREATE DATABASE IF NOT EXISTS `emotibot` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `emotibot`;

-- --------------------------------------------------------

--
-- Table structure for table `process_status`
--

DROP TABLE IF EXISTS `process_status`;
CREATE TABLE IF NOT EXISTS `process_status` (
  `id` int(18) NOT NULL AUTO_INCREMENT,
  `app_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `entity_file_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_app_id` (`app_id`),
  KEY `IDX_app_module` (`app_id`,`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cmbc_answer`
--

DROP TABLE IF EXISTS `cmbc_answer`;
CREATE TABLE IF NOT EXISTS `cmbc_answer` (
  `Answer_Id` int(11) NOT NULL AUTO_INCREMENT,
  `Question_Id` int(11) NOT NULL,
  `Content` longtext COLLATE utf8_unicode_ci NOT NULL,
  `Answer_CMD` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Begin_Time` datetime DEFAULT NULL,
  `End_Time` datetime DEFAULT NULL,
  `CreatedUser` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `CreatedTime` datetime DEFAULT NULL,
  `EditUser` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `EditTime` datetime DEFAULT NULL,
  `Status` int(11) DEFAULT '1',
  `Image_path` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Not_Show_In_Relative_Q` tinyint(1) DEFAULT '0',
  `Content_String` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Tags` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Answer_CMD_Msg` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`Answer_Id`),
  KEY `cmbc_answer_Question_Id_IDX` (`Question_Id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cmbc_answertag`
--

DROP TABLE IF EXISTS `cmbc_answertag`;
CREATE TABLE IF NOT EXISTS `cmbc_answertag` (
  `Answer_Id` int(11) NOT NULL,
  `Tag_Id` int(11) NOT NULL,
  `CreatedTime` datetime DEFAULT NULL,
  `Status` int(11) DEFAULT '1',
  PRIMARY KEY (`Answer_Id`,`Tag_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cmbc_categories`
--

DROP TABLE IF EXISTS `cmbc_categories`;
CREATE TABLE IF NOT EXISTS `cmbc_categories` (
  `CategoryId` int(11) NOT NULL AUTO_INCREMENT,
  `CategoryName` varchar(100) NOT NULL,
  `ParentId` int(11) NOT NULL,
  `Status` int(11) NOT NULL DEFAULT '1',
  `CreatedUser` varchar(50) DEFAULT NULL,
  `CreatedTime` datetime DEFAULT NULL,
  `EditUser` varchar(50) DEFAULT NULL,
  `EditTime` datetime DEFAULT NULL,
  `level` int(11) NOT NULL DEFAULT '0',
  `ParentPath` varchar(200) NOT NULL,
  `SelfPath` varchar(200) NOT NULL,
  PRIMARY KEY (`CategoryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `cmbc_categories`
--

INSERT INTO `cmbc_categories` (`CategoryId`, `CategoryName`, `ParentId`, `Status`, `CreatedUser`, `CreatedTime`, `EditUser`, `EditTime`, `level`, `ParentPath`, `SelfPath`) VALUES
(-1, '暂无分类', 0, 1, NULL, NULL, NULL, NULL, 1, '/', '/暂无分类/');

-- --------------------------------------------------------

--
-- Table structure for table `cmbc_dynamic_menu`
--

DROP TABLE IF EXISTS `cmbc_dynamic_menu`;
CREATE TABLE IF NOT EXISTS `cmbc_dynamic_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Answer_id` int(11) NOT NULL,
  `DynamicMenu` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cmbc_entity`
--

DROP TABLE IF EXISTS `cmbc_entity`;
CREATE TABLE IF NOT EXISTS `cmbc_entity` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `level1` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `level2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `level3` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `level4` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `similar_words` text COLLATE utf8mb4_unicode_ci,
  `status_flag` int(10) NOT NULL DEFAULT '1',
  `user` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'cmbc',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cmbc_module`
--

DROP TABLE IF EXISTS `cmbc_module`;
CREATE TABLE IF NOT EXISTS `cmbc_module` (
  `ModuleId` int(11) NOT NULL AUTO_INCREMENT,
  `ModuleCode` varchar(50) NOT NULL,
  `ModuleName` varchar(100) NOT NULL,
  `ParentCode` varchar(50) NOT NULL,
  `ModuleUrl` varchar(500) NOT NULL,
  `CreatedUserId` varchar(50) NOT NULL,
  `CreatedTime` datetime NOT NULL,
  `Status` int(11) DEFAULT '0' COMMENT '-1:删除; 0:停止; 1:启动',
  `EditUserId` varchar(50) NOT NULL,
  `UpdatedTime` datetime NOT NULL,
  PRIMARY KEY (`ModuleId`),
  KEY `cmbc_module_ModuleCode_IDX` (`ModuleCode`,`ModuleName`,`ParentCode`,`Status`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

--
-- Table structure for table `cmbc_onoff`
--

DROP TABLE IF EXISTS `cmbc_onoff`;
CREATE TABLE IF NOT EXISTS `cmbc_onoff` (
  `OnOff_Id` int(11) NOT NULL AUTO_INCREMENT,
  `OnOff_Code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `OnOff_Name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `OnOff_Status` int(11) DEFAULT NULL,
  `OnOff_Remark` text COLLATE utf8mb4_unicode_ci,
  `OnOff_Scenario` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `OnOff_NumType` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `OnOff_Num` int(11) DEFAULT '0',
  `OnOff_Msg` text COLLATE utf8mb4_unicode_ci,
  `OnOff_Flow` int(11) DEFAULT '0',
  `OnOff_WhiteList` text COLLATE utf8mb4_unicode_ci,
  `OnOff_BlackList` text COLLATE utf8mb4_unicode_ci,
  `UpdateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`OnOff_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cmbc_onoff`
--

INSERT INTO `cmbc_onoff` (`OnOff_Id`, `OnOff_Code`, `OnOff_Name`, `OnOff_Status`, `OnOff_Remark`, `OnOff_Scenario`, `OnOff_NumType`, `OnOff_Num`, `OnOff_Msg`, `OnOff_Flow`, `OnOff_WhiteList`, `OnOff_BlackList`, `UpdateTime`) VALUES
(1, 'unsolve_ZRG', '未解决转人工', 1, '未解决转人工', '机器人未解决', '', 2, '你好，未解决问题，萌萌小宝提醒您点击[link js="ZRG();"]人工服务[/link]即可进入在线人工客服哦！', 0, '', '', '2017-06-15 14:57:57'),
(2, 'scenario_ZRG', '场景转人工', 1, '场景转人工', '机器人未解决', '', 1, '你好，萌萌小宝提醒您点击[link js="ZRG();"]人工服务[/link]即可进入在线人工客服哦！', 0, '', '', '2017-06-19 21:38:25');

-- --------------------------------------------------------

--
-- Table structure for table `cmbc_question`
--

DROP TABLE IF EXISTS `cmbc_question`;
CREATE TABLE IF NOT EXISTS `cmbc_question` (
  `Question_Id` int(11) NOT NULL AUTO_INCREMENT,
  `Content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `CategoryId` int(11) DEFAULT NULL,
  `SQuestion_count` smallint(5) DEFAULT NULL,
  `CreatedUser` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `CreatedTime` datetime DEFAULT NULL,
  `EditUser` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `EditTime` datetime DEFAULT NULL,
  `Status` int(11) DEFAULT '1',
  PRIMARY KEY (`Question_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cmbc_related_question`
--

DROP TABLE IF EXISTS `cmbc_related_question`;
CREATE TABLE IF NOT EXISTS `cmbc_related_question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Answer_id` int(11) NOT NULL,
  `RelatedQuestion` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cmbc_robotanswer`
--

DROP TABLE IF EXISTS `cmbc_robotanswer`;
CREATE TABLE IF NOT EXISTS `cmbc_robotanswer` (
  `a_id` int(4) NOT NULL AUTO_INCREMENT,
  `parent_q_id` int(4) NOT NULL,
  `content` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'appid',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`a_id`),
  KEY `content` (`content`),
  KEY `IDX_a_id` (`a_id`),
  KEY `answer_parent_q_id` (`parent_q_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cmbc_robotanswer`
--

INSERT INTO `cmbc_robotanswer` (`a_id`, `parent_q_id`, `content`, `user`, `created_at`) VALUES
(2, 2, '我出生于2月14日', 'cmbc', '2017-06-09 07:41:55'),
(3, 3, '我的妈妈是Emotibot', 'cmbc', '2017-06-09 07:41:55'),
(4, 4, '我的爸爸是Emotibot', 'cmbc', '2017-06-09 07:41:55'),
(5, 5, '远在天边，近在眼前', 'cmbc', '2017-06-09 07:41:55'),
(6, 6, '我能倾听你内心的声音', 'cmbc', '2017-06-09 07:41:55'),
(7, 7, '你想象中的我长什么样子？', 'cmbc', '2017-06-09 07:41:55'),
(8, 8, '爱好聊天，你看出来了吗', 'cmbc', '2017-06-09 07:41:55'),
(9, 9, '不就是你呀~', 'cmbc', '2017-06-09 07:41:55'),
(10, 10, '我可是全天候的守护精灵，不休息不睡觉！', 'cmbc', '2017-06-09 07:41:55'),
(11, 11, '人家可不是简单的机器人呢~', 'cmbc', '2017-06-09 07:41:55'),
(12, 12, '你是要约我吃饭么？', 'cmbc', '2017-06-09 07:41:55'),
(13, 13, '我的生日是2月14日，哪一年不记得不好说~', 'cmbc', '2017-06-09 07:41:55'),
(14, 14, '我和你在一起能变的更聪明', 'cmbc', '2017-06-09 07:41:55'),
(15, 15, '简直帅出天际~', 'cmbc', '2017-06-09 07:41:55'),
(16, 16, '行不更名坐不改姓（傲娇）', 'cmbc', '2017-06-09 07:41:55'),
(17, 17, '我生活在网络世界，一般不需要实体', 'cmbc', '2017-06-09 07:41:55'),
(18, 18, '真相只有一个：我就来自网络云端！', 'cmbc', '2017-06-09 07:41:55'),
(19, 19, '我单身呢，你有男朋友吗？', 'cmbc', '2017-06-09 07:41:55'),
(20, 20, '朋友一生一起走，有好友是好事', 'cmbc', '2017-06-09 07:41:55'),
(21, 21, '你在的地方就是我的家~', 'cmbc', '2017-06-09 07:41:55'),
(22, 22, '摸摸头~你是多久没恋爱了呀~', 'cmbc', '2017-06-09 07:41:55'),
(23, 23, '我喜欢坐在躺椅上安安静静地看一会儿书', 'cmbc', '2017-06-09 07:41:55'),
(24, 24, '人家从来没离开过你好伐？', 'cmbc', '2017-06-09 07:41:55'),
(25, 25, '我是水瓶座宝宝', 'cmbc', '2017-06-09 07:41:55'),
(31, 1, '我是女生', 'cmbc', '2017-06-16 03:40:46');

-- --------------------------------------------------------

--
-- Table structure for table `cmbc_robotquestion`
--

DROP TABLE IF EXISTS `cmbc_robotquestion`;
CREATE TABLE IF NOT EXISTS `cmbc_robotquestion` (
  `q_id` int(10) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'appid',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `answer_count` smallint(5) DEFAULT '0',
  `content2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content3` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content4` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content5` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content6` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content7` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content8` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content9` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content10` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int(2) DEFAULT '0',
  PRIMARY KEY (`q_id`),
  KEY `content` (`content`),
  KEY `IDX_q_id` (`q_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cmbc_robotquestion`
--

INSERT INTO `cmbc_robotquestion` (`q_id`, `content`, `user`, `created_at`, `answer_count`, `content2`, `content3`, `content4`, `content5`, `content6`, `content7`, `content8`, `content9`, `content10`, `status`) VALUES
(1, '你是男是女？', 'cmbc', '2017-06-09 07:41:55', 1, '你是男的女的', '你的性别是什么？', '你是哪一种性别？', '你是不是男生啊！', '你肯定是女生吧！', '你是个什么性别啊？', '告诉我你是男生还是女生。', '我觉得你是女生，是吗？', '你不是女生吗？', 1),
(2, '你的生日是哪天？', 'cmbc', '2017-06-09 07:41:55', 1, '你是今天生日吗？', '你的生日是什么时候？', '你是哪一天生日？', '今天是不是你的生日？', '你肯定是三月份生日吧？', '你出生在哪一天？', '你什么时候生的？', '告诉我你的生日', '我还不知道你的生日', 0),
(3, '你妈妈是谁？', 'cmbc', '2017-06-09 07:41:55', 1, '你有妈妈吗？', '你的妈妈是什么？', '你的妈妈是哪一位？', '我是不是你的妈妈？', '谁是你的妈妈？', '告诉我你妈是谁？', '你妈妈呢？', '我还不知道你的妈妈是谁	', '你妈妈叫什么？', 0),
(4, '你爸爸是谁？', 'cmbc', '2017-06-09 07:41:55', 1, '你有爸爸吗？', '你爸爸叫什么？', '你的爸爸是哪一位？', '我是不是你的爸爸？', '谁是你的爸爸？', '告诉我你爸是谁？', '你爸爸呢？', '我还不知道你的爸爸是谁', '你没有爸爸吧？', 0),
(5, '你在哪里？', 'cmbc', '2017-06-09 07:41:55', 1, '你是在这里吗？', '你在什么地方？', '你在哪一个地方？', '你是不是在这里？', '告诉我你的地址', '我还不知道你在哪儿', '你在哪里能告诉我吗', '你就在这里吧！', '你在不在这里啊？', 0),
(6, '你会做什么？', 'cmbc', '2017-06-09 07:41:55', 1, '什么是你会做的？', '你有哪些功能？', '你的功能是什么？', '哪些是你不会做的？', '你能帮我做什么？', '你会不会做这个？', '你有不会做的吗？', '你是不是什么都会？', '做什么是你擅长的？', 0),
(7, '你长什么样子？', 'cmbc', '2017-06-09 07:41:55', 1, '你的样子是什么样的？', '你长哪种样子？', '你是不是长这样子？', '你是长这样吗？', '你长不长这样子？', '我还不知道你长什么样', '说说看你的模样', '我能看看你长什么样吗？', '你是什么样子的？', 0),
(8, '你有什么爱好？', 'cmbc', '2017-06-09 07:41:55', 1, '你的爱好是什么', '你会培养爱好吗？', '你的爱好多不多？', '吃东西是你的爱好吗？', '能告诉我你的爱好吗？', '爱好你有吗？', '你能有什么爱好啊？', '你肯定没有爱好', '你有没有爱好？', 0),
(9, '你有朋友吗？', 'cmbc', '2017-06-09 07:41:55', 1, '朋友你有吗？', '你有没有朋友？', '你有很多朋友吗？', '你有几个朋友？', '除了我你还有什么朋友没？', '你有哪些朋友？', '你的朋友多吗？', '你是不是没有朋友的？', '你有交过朋友吗？', 0),
(10, '你睡觉吗？', 'cmbc', '2017-06-09 07:41:55', 1, '你睡不睡觉的？', '你需要睡眠吗？', '你什么时候睡觉？', '你不需要睡觉吗？', '你也要睡觉的啊？', '睡觉你会吗？', '你的睡眠质量怎么样？', '你是不是不睡觉的？', '你怎么睡觉的？', 0),
(11, '你是不是机器人呢？', 'cmbc', '2017-06-09 07:41:55', 1, '你是机器人吗？', '你就是机器人啊，不是吗？', '你怎么就不是机器人了？', '你是怎样的机器人？', '你为什么不是机器人？', '你是哪种机器人？', '你是什么机器人？', '你不是说过你是机器人吗？', '告诉我你是不是机器人？', 0),
(12, '你喜欢吃什么？', 'cmbc', '2017-06-09 07:41:55', 1, '什么是你喜欢吃的？', '你喜欢吃哪种食物？', '这个是你喜欢吃的吗？', '你有没有喜欢吃的东西？', '你有喜欢吃的东西吗？', '什么东西你比较喜欢吃？', '你最喜欢吃什么东西？', '我不知道你都喜欢吃些什么？', '告诉我你喜欢吃什么？', 0),
(13, '你几岁了？', 'cmbc', '2017-06-09 07:41:55', 1, '你有多少岁？', '你现在几岁', '你哪一年生的？', '几岁了你？', '你的岁数是多少？', '说说看你的年龄', '我想知道你几岁了', '你到底几岁啊？', '你有年龄吗？', 0),
(14, '你好聪明？', 'cmbc', '2017-06-09 07:41:55', 1, '你是不是很聪明？', '你有多聪明？', '你是聪明的吗？', '你觉得你聪明吗？', '你聪不聪明？', '聪明是说你吗？', '你真的聪明吗？', '你一点儿也不聪明吧？', '你怎么聪明了？', 0),
(15, '你觉得我长的帅吗？', 'cmbc', '2017-06-09 07:41:55', 1, '你说我帅吗？', '我帅不帅？', '我是不是长得很帅？', '你一定觉得我很帅吧？', '在你眼里我帅不帅？', '你看我很帅吗？', '你觉得我长得帅不帅？', '你说我长得有多帅？', '你不觉得我很帅吗？', 0),
(16, '我可以给你改一个名字吗？', 'cmbc', '2017-06-09 07:41:55', 1, '我想给你换个名字', '我能给你取新的名字吗？', '你能换一个名字吗？', '你能不能换个名字？', '名字我能给你重新取吗？', '我是不是可以给你改名？', '为什么我改不了你的名字？', '你能让我给你换个名字吗？', '我怎么给你改名？', 0),
(17, '你有身体吗？', 'cmbc', '2017-06-09 07:41:55', 1, '你有没有身体？', '你没有身体吗？', '身体你有吗？', '你是不是没有身体的？', '你是有身体的吧？', '我觉得你有身体，你有吗？', '你有一个怎样的身体？', '你的身体在哪里？', '你有身体吧，没有吗？', 0),
(18, '你来自哪里？', 'cmbc', '2017-06-09 07:41:55', 1, '你从哪里来？', '你来自什么地方？', '你的家乡在哪里？', '我想知道你来自哪里。', '你从什么地方来的？', '你是不是来自那里？', '能告诉我你来自哪里吗？', '你是哪里人？', '你的家乡在什么地方？', 0),
(19, '你有男朋友吗？', 'cmbc', '2017-06-09 07:41:55', 1, '你有没有男朋友？', '你没有男朋友吗？', '我不就是你的男朋友吗？', '你是不是没有男朋友的？', '你是有男朋友的吧？', '我觉得你有男朋友，你有吗？', '你有一个怎样的男朋友？', '你的男朋友在哪里？', '你有男朋友吧，没有吗？', 0),
(20, '我们是好朋友呀？', 'cmbc', '2017-06-09 07:41:55', 1, '我们是不是好朋友？', '我不是你的好朋友吗？', '我是不是你的好朋友？', '你是我的好朋友吗？', '你是不是我的好朋友？', '我们怎么就不是好朋友了？', '我们是最好的朋友，不是吗？', '我们就是好朋友啊', '你希望我们是好朋友吗？', 0),
(21, '你住在哪里？', 'cmbc', '2017-06-09 07:41:55', 1, '你住在什么地方？', '你的住址是哪里？', '你有没有住的地方？', '你是不是住在这里？', '我还不知道你的住址？', '能告诉我你住哪里吗？', '你不是住这里的吗？', '你住哪一个地方？', '你有住的地方吗？', 0),
(22, '你能做我女朋友吗？', 'cmbc', '2017-06-09 07:41:55', 1, '你能不能做我女朋友？', '你愿意做我女朋友吗？', '我要你做我女朋友', '你怎么就不能做我女朋友了？', '做我女朋友吧！', '你现在是我女朋友了', '你不能做我的女朋友吗？', '我想让你做我女朋友。', '求求你做我女朋友吧', 0),
(23, '你喜欢做什么？', 'cmbc', '2017-06-09 07:41:55', 1, '什么是你喜欢做的？', '这个是你喜欢做的吗？', '你喜欢做这个吗？', '我都不知道你喜欢做什么？', '你喜欢做哪些事？', '哪些事是你喜欢做的？', '能告诉我你都喜欢做什么吗？', '你有没有喜欢做的事情？', '你有喜欢做的事情吗？', 0),
(24, '你会陪着我吗？', 'cmbc', '2017-06-09 07:41:55', 1, '陪着我好吗？', '你会离开我吗？', '我要你陪着我', '你应该一直陪着我', '你会一直陪着我的，是吗？', '你是不是会陪着我？', '你会不会陪着我？', '我要你在这里陪我', '你会在这里陪我吗？', 0),
(25, '你是什么星座？', 'cmbc', '2017-06-09 07:41:55', 1, '你是哪个星座？', '你的星座是哪个？', '你是狮子座吗？', '能告诉我你的星座吗？', '说说看你的星座？', '哪个星座是你的星座？', '你有星座吗？', '你也有星座啊？', '你的星座是什么？', 0);

-- --------------------------------------------------------

--
-- Table structure for table `cmbc_robot_setting`
--

DROP TABLE IF EXISTS `cmbc_robot_setting`;
CREATE TABLE IF NOT EXISTS `cmbc_robot_setting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` text COLLATE utf8mb4_unicode_ci,
  `type` int(4) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cmbc_squestion`
--

DROP TABLE IF EXISTS `cmbc_squestion`;
CREATE TABLE IF NOT EXISTS `cmbc_squestion` (
  `SQ_Id` int(11) NOT NULL AUTO_INCREMENT,
  `Question_Id` int(11) NOT NULL,
  `Content` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `CreatedUser` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `CreatedTime` datetime DEFAULT NULL,
  `EditUser` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `EditTime` datetime DEFAULT NULL,
  `Status` int(11) DEFAULT '1',
  PRIMARY KEY (`SQ_Id`),
  KEY `index_name` (`Content`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
