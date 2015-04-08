-- phpMyAdmin SQL Dump
-- version 3.4.10.1
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2015 年 04 月 08 日 03:06
-- 服务器版本: 5.5.20
-- PHP 版本: 5.3.10

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `blog`
--

-- --------------------------------------------------------

--
-- 表的结构 `blog`
--

CREATE TABLE IF NOT EXISTS `blog` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id，自增',
  `title` varchar(100) NOT NULL COMMENT '标题',
  `content` text NOT NULL,
  `create_time` datetime NOT NULL,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `catagoryId` int(11) NOT NULL,
  `tagId` text NOT NULL,
  `commentId` int(11) NOT NULL,
  `click` int(11) NOT NULL DEFAULT '0' COMMENT '点击量',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=26 ;

--
-- 转存表中的数据 `blog`
--

INSERT INTO `blog` (`id`, `title`, `content`, `create_time`, `update_time`, `catagoryId`, `tagId`, `commentId`, `click`) VALUES
(2, 'fdsafd', '放大师傅放大师傅放大师傅放大师傅放大师傅放大师傅放大师傅', '2015-03-26 00:00:00', '2015-04-08 02:47:55', 1, '1,2', 1, 55),
(4, '热饭哈师大范德萨', '热饭哈师大范德萨热f', '2015-03-01 00:00:00', '2015-04-08 02:47:02', 2, '2,4,5', 3, 26),
(5, '反对法', '发大水发的撒法第三发大水发的萨芬的撒的份上范德萨范德萨否', '2015-03-20 00:00:00', '2015-04-08 02:35:43', 2, '1,2,3', 3, 88),
(6, '看好机会', '看好机会看好机会看好机会看好机会看好机会看好机会看好机会', '2015-02-02 00:00:00', '2015-04-08 02:48:32', 2, '2,3', 1, 33),
(7, 'UI语句', '范德萨发的范德萨放大师傅范德萨发的范德萨放大师傅范德萨发的范德萨放大师傅范德萨发的范德萨放大师傅', '2015-03-13 00:00:00', '2015-04-08 02:45:47', 3, '1', 1, 13),
(14, 'aaaa', 'aaaaaa', '2015-04-07 08:53:38', '2015-04-08 02:34:46', 1, '', 0, 3),
(15, 'xxx', 'xxxxxxx', '2015-04-07 09:39:53', '2015-04-07 09:39:53', 1, '', 0, 0),
(16, '范德萨发大厦', '否打算分手', '2015-04-07 10:07:50', '2015-04-08 02:36:43', 1, '', 0, 5),
(17, 'fdsaf ds', 'fdsafdsafdsafds', '2015-04-07 10:57:06', '2015-04-07 10:57:07', 2, '', 0, 1),
(18, 'rewrew', 'rewfewrew', '2015-04-07 10:57:12', '2015-04-07 10:57:13', 2, '', 0, 1),
(19, 'rewrew', 'fdsafdasereasfds', '2015-04-07 10:57:19', '2015-04-08 02:46:56', 2, '', 0, 6),
(20, 'fdsafdsa1111', 'fdsafdsafdsafdsafds', '2015-04-07 10:58:04', '2015-04-08 02:37:03', 2, '', 0, 3),
(21, '旺旺', '发的发的发', '2015-04-08 02:35:55', '2015-04-08 02:36:05', 2, '', 0, 2),
(22, '热热', '规范的施工', '2015-04-08 02:36:11', '2015-04-08 02:36:17', 2, '', 0, 2),
(23, '太热太热', '规范升高', '2015-04-08 02:36:23', '2015-04-08 02:36:24', 2, '', 0, 1),
(24, 'iuyiuy', ' 就发计划', '2015-04-08 02:36:31', '2015-04-08 02:36:32', 2, '', 0, 1),
(25, '规范的施工方', '个电饭锅发给', '2015-04-08 02:37:10', '2015-04-08 02:47:12', 2, '', 0, 2);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
