-- ═══════════════════════════════════════════════════════════════════════
-- BANDHAN MATRIMONY — Complete MySQL Schema
-- Import via: GoDaddy cPanel → phpMyAdmin → Select bandhan_db → Import
-- ═══════════════════════════════════════════════════════════════════════

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Create database (if not done already in cPanel)
-- CREATE DATABASE bandhan_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- USERS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `users` (
  `id`                 VARCHAR(36)  NOT NULL PRIMARY KEY,
  `email`              VARCHAR(191) UNIQUE,
  `mobile`             VARCHAR(20)  UNIQUE,
  `password`           VARCHAR(255),
  `google_id`          VARCHAR(191) UNIQUE,
  `gender`             ENUM('Bride','Groom') NOT NULL,
  `is_email_verified`  TINYINT(1)   NOT NULL DEFAULT 0,
  `is_mobile_verified` TINYINT(1)   NOT NULL DEFAULT 0,
  `is_approved`        TINYINT(1)   NOT NULL DEFAULT 0,
  `profile_complete`   TINYINT(1)   NOT NULL DEFAULT 0,
  `login_method`       ENUM('email','mobile','google') DEFAULT 'email',
  `otp_code`           VARCHAR(6),
  `otp_expires_at`     DATETIME,
  `last_login_at`      DATETIME,
  `is_active`          TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_mobile` (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- PROFILES TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `profiles` (
  `id`                 VARCHAR(36)  NOT NULL PRIMARY KEY,
  `user_id`            VARCHAR(36)  NOT NULL UNIQUE,
  `full_name`          VARCHAR(150) NOT NULL,
  `dob`                DATE,
  `height_cm`          INT,
  `religion`           VARCHAR(50)  DEFAULT 'Hindu',
  `caste`              VARCHAR(100),
  `mother_tongue`      VARCHAR(50),
  `education`          VARCHAR(200),
  `occupation`         VARCHAR(200),
  `annual_income`      VARCHAR(100),
  `city`               VARCHAR(100),
  `state`              VARCHAR(100),
  `country`            VARCHAR(100) DEFAULT 'India',
  `is_nri`             TINYINT(1)   DEFAULT 0,
  `about_me`           TEXT,
  `photo_url`          VARCHAR(500),
  `photos`             JSON,
  `rashi`              VARCHAR(50),
  `nakshatra`          VARCHAR(50),
  `gotra`              VARCHAR(100),
  `manglik`            ENUM('Yes','No','Partial') DEFAULT 'No',
  `diet`               ENUM('Vegetarian','Non-Vegetarian','Eggetarian','Vegan') DEFAULT 'Vegetarian',
  `match_score`        INT DEFAULT 0,
  `lat`                FLOAT,
  `lng`                FLOAT,
  `is_verified`        TINYINT(1)   DEFAULT 0,
  `lifestyle_video_url` VARCHAR(500),
  `family_details`     JSON,
  `created_at`         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_religion` (`religion`),
  INDEX `idx_city` (`city`),
  INDEX `idx_match_score` (`match_score` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- PARTNER PREFERENCES TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `partner_preferences` (
  `id`                VARCHAR(36)  NOT NULL PRIMARY KEY,
  `user_id`           VARCHAR(36)  NOT NULL UNIQUE,
  `min_age`           INT          DEFAULT 22,
  `max_age`           INT          DEFAULT 35,
  `min_height_cm`     INT          DEFAULT 155,
  `max_height_cm`     INT          DEFAULT 185,
  `religion`          VARCHAR(100) DEFAULT 'Any',
  `caste`             VARCHAR(200) DEFAULT 'Any',
  `education`         VARCHAR(200) DEFAULT 'Any',
  `income_min`        VARCHAR(100),
  `manglik`           VARCHAR(20)  DEFAULT 'Any',
  `diet`              VARCHAR(50)  DEFAULT 'Any',
  `preferred_cities`  TEXT,
  `nri_preference`    ENUM('Yes','No','Any') DEFAULT 'Any',
  `created_at`        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- INTERESTS TABLE (Express Interest)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `interests` (
  `id`          VARCHAR(36)  NOT NULL PRIMARY KEY,
  `sender_id`   VARCHAR(36)  NOT NULL,
  `receiver_id` VARCHAR(36)  NOT NULL,
  `status`      ENUM('sent','accepted','declined') DEFAULT 'sent',
  `message`     TEXT,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`sender_id`)   REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_sender`   (`sender_id`),
  INDEX `idx_receiver` (`receiver_id`),
  UNIQUE KEY `uniq_interest` (`sender_id`, `receiver_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- MESSAGES TABLE (Chat)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `messages` (
  `id`          VARCHAR(36)  NOT NULL PRIMARY KEY,
  `room_id`     VARCHAR(191) NOT NULL COMMENT 'Sorted concat of sender+receiver IDs',
  `sender_id`   VARCHAR(36)  NOT NULL,
  `receiver_id` VARCHAR(36)  NOT NULL,
  `content`     TEXT         NOT NULL,
  `type`        ENUM('text','image','location','audio','file') DEFAULT 'text',
  `status`      ENUM('sent','delivered','read') DEFAULT 'sent',
  `file_url`    VARCHAR(500),
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_room`   (`room_id`),
  INDEX `idx_sender` (`sender_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- PROFILE VISITS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `profile_visits` (
  `id`               VARCHAR(36)  NOT NULL PRIMARY KEY,
  `visitor_id`       VARCHAR(36)  NOT NULL,
  `profile_id`       VARCHAR(36)  NOT NULL,
  `visit_date`       DATE         NOT NULL,
  `visit_count`      INT          NOT NULL DEFAULT 1,
  `first_visit_time` DATETIME,
  `last_visit_time`  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `created_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`visitor_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uniq_visit` (`visitor_id`, `profile_id`, `visit_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- AI MATCH SCORES TABLE (Gemini Cache)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `ai_match_scores` (
  `id`          VARCHAR(36)  NOT NULL PRIMARY KEY,
  `user_id`     VARCHAR(36)  NOT NULL,
  `target_id`   VARCHAR(36)  NOT NULL,
  `score`       INT          NOT NULL,
  `dimensions`  JSON,
  `verdict`     TEXT,
  `expires_at`  DATETIME,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`)   REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`target_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uniq_match` (`user_id`, `target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ═══════════════════════════════════════════════════════════════════════
-- END OF SCHEMA
-- Next steps:
-- 1. Import this file via GoDaddy cPanel → phpMyAdmin → bandhan_db → Import
-- 2. Create MySQL user: CREATE USER 'bandhan_user'@'localhost' IDENTIFIED BY 'YourPassword';
-- 3. Grant permissions: GRANT ALL PRIVILEGES ON bandhan_db.* TO 'bandhan_user'@'localhost';
-- 4. FLUSH PRIVILEGES;
-- ═══════════════════════════════════════════════════════════════════════
