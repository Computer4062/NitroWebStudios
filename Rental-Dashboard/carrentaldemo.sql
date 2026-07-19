-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jul 19, 2026 at 10:04 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `carrentaldemo`
--

-- --------------------------------------------------------

--
-- Table structure for table `page_visits`
--

CREATE TABLE `page_visits` (
  `id` int(11) NOT NULL,
  `path` varchar(255) NOT NULL,
  `last_visited` datetime NOT NULL,
  `todays_hits` int(11) NOT NULL DEFAULT 0,
  `hits` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`hits`)),
  `created_at` datetime NOT NULL,
  `version` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `page_visits`
--

INSERT INTO `page_visits` (`id`, `path`, `last_visited`, `todays_hits`, `hits`, `created_at`, `version`) VALUES
(1, '/inventory/1', '2026-06-17 09:53:28', 50, '[]', '2026-06-17 09:53:28', 0),
(2, '/inventory/2', '2026-06-17 10:08:27', 100, '[{\"date\": \"2026-06-12\", \"count\": 142}, {\"date\": \"2026-06-13\", \"count\": 98}, {\"date\": \"2026-06-14\", \"count\": 115}, {\"date\": \"2026-06-15\", \"count\": 184}, {\"date\": \"2026-06-16\", \"count\": 210}]', '2026-06-17 10:08:19', 1),
(3, '/inventory/3', '2026-06-17 10:20:22', 31, '[]', '2026-06-17 10:08:33', 1),
(4, '/inventory/4', '2026-06-17 10:20:13', 20, '[]', '2026-06-17 10:20:13', 0),
(5, '/inventory/5', '2026-06-17 10:20:18', 25, '[]', '2026-06-17 10:20:18', 0),
(6, '/inventory/6', '2026-06-17 10:20:28', 30, '[]', '2026-06-17 10:20:28', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(24) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT 0,
  `technician` tinyint(1) NOT NULL DEFAULT 0,
  `profile_img` varchar(100) DEFAULT 'default.jpg',
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `verification_token` varchar(100) DEFAULT NULL,
  `verification_token_expires` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `admin`, `technician`, `profile_img`, `first_name`, `last_name`, `is_verified`, `verification_token`, `verification_token_expires`, `created_at`, `updated_at`) VALUES
('69a543d3db542db03098a733', 'Mihan', '$2b$10$7RkHT2xMcjQVhB8VBvYtLOGMkqisjpoltt1ddd5IZa.o6/wFG1X6S', 'mihan.edirisinghe@gmail.com', 1, 1, 'Mihan.jpg', 'Mihan', 'Edirisinghe', 0, NULL, NULL, '2026-03-02 08:01:23', '2026-07-19 11:54:03'),
('69a5989e377687b553689749', 'Akindu', '$2b$10$Ti5mlX8nNkfGTohRzRaGnuNS/zMeyCODDtMNZ4.O2lTuaIz2MeJGm', 'akindubasnayake@gmail.com', 1, 0, 'default.jpg', 'Akindu', 'Basnayaka', 0, '963415', '2026-03-02 14:13:23', '2026-03-02 14:03:10', '2026-03-02 14:03:23'),
('69f36e2576bd803304e1ee89', 'root', '$2b$10$CxayrUC0WyXPcCSJQV1vhO3JQfyDilHI7Q6JJUF56bCL060aHQa7i', 'mihan.edirisinghe@gmail.com', 1, 0, 'root.jpg', 'root', 'root', 0, NULL, '2026-06-15 06:32:35', '2026-04-30 14:58:45', '2026-06-15 06:23:18'),
('6a48072e6c5b1a0b159fbdc0', 'jdoe', '$2b$10$nWU6ViSa2PluP1zsu6US0.5v9NxIAupX7VhzRb3UnDYOQZZDpbXTa', 'mihan.edirisinghe@gmail.com', 0, 0, 'default.jpg', 'Joe', 'Doe', 0, NULL, '2026-07-03 19:12:26', '2026-07-03 19:02:06', '2026-07-03 19:02:46');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `brand` varchar(100) NOT NULL,
  `type` varchar(50) NOT NULL,
  `fuel_type` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'Available',
  `days_left` int(11) DEFAULT NULL,
  `seats` int(11) NOT NULL,
  `gearbox` varchar(20) NOT NULL,
  `price` int(11) NOT NULL,
  `img` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`img`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `draft` tinyint(1) NOT NULL DEFAULT 0,
  `user` varchar(100) NOT NULL DEFAULT 'Mihan',
  `highlight` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`id`, `name`, `brand`, `type`, `fuel_type`, `status`, `days_left`, `seats`, `gearbox`, `price`, `img`, `created_at`, `draft`, `user`, `highlight`) VALUES
(1, 'Model 3', 'Tesla', 'Sedan', 'Electric', 'Available', NULL, 5, 'Automatic', 79, '[\"/uploads/products/669030-ezwn.png\"]', '2026-07-18 13:17:03', 0, 'Mihan', 1),
(2, 'Elantra Grand', 'Hyundai', 'Sedan', 'Petrol/Diesel', 'Available', NULL, 5, 'Automatic', 49, '[\"elantra_grand-img.png\"]', '2026-07-18 13:17:03', 0, 'Mihan', 0),
(3, 'Range Sovereign', 'Land Rover', 'SUV', 'Petrol/Diesel', 'Rented', 4, 7, 'Automatic', 89, '[\"range_sovereign-img.png\"]', '2026-07-18 13:17:03', 0, 'Mihan', 0),
(4, 'Velocity GT', 'Ford', 'Sports', 'Petrol/Diesel', 'Available', NULL, 2, 'Manual', 129, '[\"velocity_gt-img.png\"]', '2026-07-18 13:17:03', 0, 'Mihan', 0),
(5, 'Monarch Sedan', 'Mercedes-Benz', 'Luxury', 'Petrol/Diesel', 'Rented', 12, 5, 'Automatic', 149, '[\"monarch_sedan-img.png\"]', '2026-07-18 13:17:03', 0, 'Mihan', 0),
(6, 'Model X', 'Tesla', 'SUV', 'Electric', 'Rented', 2, 6, 'Automatic', 139, '[\"model_x-img.png\"]', '2026-07-18 13:17:03', 0, 'Mihan', 0),
(7, 'Civic Pulse', 'Honda', 'Hatchback', 'Petrol/Diesel', 'Available', NULL, 5, 'Manual', 39, '[\"civic_pulse-img.png\"]', '2026-07-18 13:17:03', 0, 'Mihan', 0),
(8, 'Ioniq Volt', 'Hyundai', 'Hatchback', 'Electric', 'Available', NULL, 5, 'Automatic', 55, '[\"ioniq_volt-img.png\"]', '2026-07-18 13:17:03', 0, 'Mihan', 0),
(9, 'Continental X5', 'BMW', 'SUV', 'Petrol/Diesel', 'Rented', 25, 5, 'Automatic', 119, '[\"continental_x5-img.png\"]', '2026-07-18 13:17:03', 0, 'Mihan', 0),
(10, 'Sonic Coupe', 'BMW', 'Sports', 'Petrol/Diesel', 'Available', NULL, 4, 'Automatic', 99, '[\"sonic_coupe-img.png\"]', '2026-07-18 13:17:03', 0, 'Mihan', 0),
(11, 'Cee\'d Voyager', 'Kia', 'Sedan', 'Petrol/Diesel', 'Rented', 7, 5, 'Manual', 45, '[\"ceed_voyager-img.png\"]', '2026-07-18 13:17:03', 0, 'Mihan', 0),
(12, 'Model S', 'Tesla', 'Luxury', 'Electric', 'Available', NULL, 5, 'Automatic', 159, '[\"model_s-img.png\"]', '2026-07-18 13:17:03', 0, 'Mihan', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `page_visits`
--
ALTER TABLE `page_visits`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
