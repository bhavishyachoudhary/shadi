-- Bandhan Matrimony - MySQL Database Schema Dump
-- Compatible with GoDaddy phpMyAdmin / MariaDB

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `interests`;
DROP TABLE IF EXISTS `profiles`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users Table
CREATE TABLE `users` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(15) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_by` ENUM('Self', 'Parent', 'Sibling', 'Friend', 'Relative') DEFAULT 'Self',
  `is_verified` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bride & Groom Profiles Table
CREATE TABLE `profiles` (
  `profile_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `gender` ENUM('Bride', 'Groom') NOT NULL,
  `age` INT NOT NULL,
  `height_cm` INT NOT NULL,
  `religion` VARCHAR(50) NOT NULL,
  `caste` VARCHAR(50) NOT NULL,
  `mother_tongue` VARCHAR(50) NOT NULL,
  `education` VARCHAR(100) NOT NULL,
  `occupation` VARCHAR(100) NOT NULL,
  `annual_income` VARCHAR(50) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `country` VARCHAR(100) DEFAULT 'India',
  `diet` VARCHAR(30) DEFAULT 'Vegetarian',
  `manglik` ENUM('No', 'Yes', 'Anshik', 'Don\'t Know') DEFAULT 'No',
  `rashi` VARCHAR(50),
  `nakshatra` VARCHAR(50),
  `about_me` TEXT,
  `family_details` TEXT,
  `photo_url` VARCHAR(255),
  `photo_privacy` ENUM('Public', 'Protected', 'Hidden') DEFAULT 'Public',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Express Interests Table
CREATE TABLE `interests` (
  `interest_id` INT AUTO_INCREMENT PRIMARY KEY,
  `sender_profile_id` INT NOT NULL,
  `receiver_profile_id` INT NOT NULL,
  `status` ENUM('Pending', 'Accepted', 'Declined') DEFAULT 'Pending',
  `message` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`sender_profile_id`) REFERENCES `profiles`(`profile_id`),
  FOREIGN KEY (`receiver_profile_id`) REFERENCES `profiles`(`profile_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Sample Users
INSERT INTO `users` (`user_id`, `full_name`, `email`, `phone`, `password_hash`, `is_verified`) VALUES
(1, 'Ananya Sharma', 'ananya@example.com', '+919876543210', 'hashed_pass_123', 1),
(2, 'Rohan Verma', 'rohan@example.com', '+919876543211', 'hashed_pass_456', 1),
(3, 'Priya Kapoor', 'priya@example.com', '+919876543212', 'hashed_pass_789', 1),
(4, 'Aditya Singhania', 'aditya@example.com', '+919876543213', 'hashed_pass_012', 1);

-- Insert Sample Profiles
INSERT INTO `profiles` (`profile_id`, `user_id`, `full_name`, `gender`, `age`, `height_cm`, `religion`, `caste`, `mother_tongue`, `education`, `occupation`, `annual_income`, `city`, `state`, `manglik`, `rashi`, `nakshatra`, `photo_url`) VALUES
(101, 1, 'Ananya Sharma', 'Bride', 26, 165, 'Hindu', 'Brahmin', 'Hindi', 'M.Tech Computer Science (IIT Delhi)', 'Senior AI Engineer at Microsoft', '₹28 - 35 Lakhs', 'Bengaluru', 'Karnataka', 'No', 'Tula', 'Chitra', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'),
(102, 2, 'Rohan Verma', 'Groom', 29, 178, 'Hindu', 'Kshatriya / Rajput', 'Hindi', 'MBA (IIM Ahmedabad) + B.Tech', 'Vice President at HDFC Bank', '₹40 - 50 Lakhs', 'Mumbai', 'Maharashtra', 'No', 'Vrishabha', 'Rohini', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'),
(103, 3, 'Priya Kapoor', 'Bride', 27, 162, 'Hindu', 'Punjabi Khatri', 'Punjabi', 'MD Pediatrics (AIIMS Delhi)', 'Pediatric Consultant Specialist', '₹30 - 40 Lakhs', 'New Delhi', 'Delhi NCR', 'No', 'Simha', 'Magha', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'),
(104, 4, 'Aditya Singhania', 'Groom', 30, 182, 'Hindu', 'Agarwal / Jain', 'Hindi', 'MS Data Analytics (Stanford USA)', 'Lead Data Architect (Silicon Valley NRI)', '₹80L - 1 Crore ($140k)', 'San Jose (NRI)', 'California', 'No', 'Mithuna', 'Ardra', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80');
