-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 20, 2024 at 12:53 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `faktura`
--

-- --------------------------------------------------------

--
-- Table structure for table `fakturas`
--

CREATE TABLE `fakturas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `datum` date DEFAULT NULL,
  `napomena` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total` decimal(8,2) DEFAULT NULL,
  `kupacid` bigint(20) UNSIGNED NOT NULL,
  `zaposleniid` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `fakturas`
--

INSERT INTO `fakturas` (`id`, `datum`, `napomena`, `total`, `kupacid`, `zaposleniid`, `created_at`, `updated_at`) VALUES
(1, '2023-09-05', 'Lorem ipsum dolor sit amet', '3100.00', 1, 1, NULL, '2024-02-20 10:39:01'),
(4, '2023-09-07', 'Napomena o kupovini 2', '1700.00', 1, 6, '2023-09-14 11:44:02', '2024-02-19 21:25:51'),
(14, '2024-02-13', 'Napomena 2', '800.00', 2, 1, '2024-02-02 11:25:52', '2024-02-06 16:05:33'),
(20, '2024-01-31', 'Napomena o kupovini 2.6', '1500.00', 5, 6, '2024-02-06 15:06:17', '2024-02-19 21:25:59'),
(22, '2024-02-21', NULL, '700.00', 5, 1, '2024-02-10 15:30:16', '2024-02-10 15:30:16'),
(23, '2024-02-07', 'Edit napomena', '300.00', 9, 6, '2024-02-10 15:31:49', '2024-02-10 15:34:08'),
(24, '2024-01-31', 'Random napomena', '600.00', 1, 6, '2024-02-10 15:33:14', '2024-02-10 15:33:14'),
(25, '2024-02-07', 'Napomena 11.3', '800.00', 9, 1, '2024-02-11 15:14:09', '2024-02-17 14:10:28'),
(26, '2024-02-13', 'Napomena 2', '1900.00', 10, 1, '2024-02-19 07:27:51', '2024-02-19 07:29:48');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `fakturas`
--
ALTER TABLE `fakturas`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `fakturas`
--
ALTER TABLE `fakturas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
