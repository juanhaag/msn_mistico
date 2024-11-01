-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-10-2024 a las 23:15:48
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `user_session`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `Admin` (IN `idUser` INT)   BEGIN
    SELECT * FROM group_user WHERE id_user = idUser AND id_group = 1;
END $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetActions` ()   BEGIN
    SELECT * from action ORDER BY action.id ASC;
END $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetActionsGroup` ()   BEGIN
    SELECT action.id, action.name, group_type.name AS groupName from action
          INNER JOIN group_action ON group_action.id_action = action.id
          INNER JOIN group_type ON group_type.id = group_action.id_group;
END $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetGroups` ()   BEGIN
    SELECT * from group_type;
END $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetGroupUsers` ()   BEGIN
    SELECT group_type.id, group_type.name, users.username from group_type
          INNER JOIN group_user ON group_user.id_group = group_type.id
          INNER JOIN users ON users.id = group_user.id_user;
END $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserByID` (IN `id_user` INT)   BEGIN
    SELECT * FROM users WHERE id = id_user;
END $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserByNameAndPass` (IN `_username` VARCHAR(50), IN `_password` VARCHAR(50))   BEGIN
    SELECT * FROM users WHERE username = _username AND password = _password;
END $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUsers` ()   BEGIN
   SELECT users.id, users.username, session.logged as isLogged from users INNER JOIN session ON session.id_user = users.id ORDER BY users.id ASC;
END $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUsersGroup` ()   BEGIN
    SELECT users.id, users.username, group_type.name AS groupName from users
          INNER JOIN group_user ON group_user.id_user = users.id
          INNER JOIN group_type ON group_type.id = group_user.id_group;
END $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `Register` (
    IN `_username` VARCHAR(50), 
    IN `_password` VARCHAR(50), 
    IN `_email` VARCHAR(100), 
    OUT `lastId` INT
)   
BEGIN
    INSERT INTO users (username, password, email) VALUES (_username, _password, _email);
    SET lastId = LAST_INSERT_ID();
END $$

CREATE PROCEDURE GetUserByEmail(IN userEmail VARCHAR(255))
BEGIN
    SELECT id, username, email, password, token
    FROM users
    WHERE email = userEmail;
END $$

CREATE PROCEDURE VerifyUser(IN p_email VARCHAR(255))
BEGIN
    -- Actualiza email_verified a true para el usuario con el email proporcionado
    UPDATE users SET email_verified = TRUE WHERE email = p_email;

    -- Selecciona el usuario para retornar
    SELECT * FROM users WHERE email = p_email;
END //

CREATE DEFINER=`root`@`localhost` PROCEDURE `Session` (IN `idUser` INT, IN `isLogged` TINYINT)   BEGIN
    INSERT INTO session (id_user, logged) VALUES (idUser, isLogged);
END $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SetActionGroups` (IN `idAction` INT, IN `idGroup` INT)   BEGIN
    INSERT INTO group_action (id_action, id_group) VALUES (idAction, idGroup);
END $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SetActions` (IN `nombre` VARCHAR(100), OUT `lastId` INT)   BEGIN
    INSERT INTO action (name) VALUES (nombre);
    SET lastId = LAST_INSERT_ID();
END $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SetGroups` (IN `nombre` VARCHAR(100))   BEGIN
    INSERT INTO group_type (name) VALUES (nombre);
END $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SetUser` (IN `userName` VARCHAR(100), OUT `lastId` INT)   BEGIN
    INSERT INTO users (name) VALUES (userName);
    SET lastId = LAST_INSERT_ID();
END $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SetUserGroups` (IN `idUser` INT, IN `idGroup` INT)   BEGIN
    INSERT INTO group_user (id_user, id_group) VALUES (idUser, idGroup);
END $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UserExists` (IN `_username` VARCHAR(50))   BEGIN
    SELECT * FROM users WHERE username = _username;
END $$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `action`
--

CREATE TABLE `action` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `action`
--

INSERT INTO `action` (`id`, `name`) VALUES
(1, 'ALL');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `group_action`
--

CREATE TABLE `group_action` (
  `id` int(11) NOT NULL,
  `id_action` int(11) NOT NULL,
  `id_group` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `group_action`
--

INSERT INTO `group_action` (`id`, `id_action`, `id_group`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `group_type`
--

CREATE TABLE `group_type` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `group_type`
--

INSERT INTO `group_type` (`id`, `name`) VALUES
(1, 'admin');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `group_user`
--

CREATE TABLE `group_user` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_group` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `group_user`
--

INSERT INTO `group_user` (`id`, `id_user`, `id_group`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `session`
--

CREATE TABLE `session` (
  `id` int(11) NOT NULL,
  `logged` tinyint(1) NOT NULL,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `session`
--

INSERT INTO `session` (`id`, `logged`, `id_user`) VALUES
(1, 0, 1),
(2, 0, 2),
(3, 0, 3),
(4, 1, 4),
(5, 0, 5),
(6, 0, 6),
(7, 0, 7),
(8, 0, 10),
(9, 1, 1),
(10, 1, 1),
(11, 1, 1),
(12, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'Tadeo', '1234'),
(2, 'Tadeus', '1234'),
(3, 'Tadeus0802', '1234'),
(4, 'Matias', '1234'),
(5, 'New user', '1234'),
(6, 'Usuario2', '1234'),
(7, 'Test', '1234'),
(8, 'Tade1234', '1234'),
(9, 'sdfgh', '123r'),
(10, 'Silvia', '1234');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `action`
--
ALTER TABLE `action`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `group_action`
--
ALTER TABLE `group_action`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_action` (`id_action`),
  ADD KEY `id_group` (`id_group`);

--
-- Indices de la tabla `group_type`
--
ALTER TABLE `group_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `group_user`
--
ALTER TABLE `group_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_group` (`id_group`);

--
-- Indices de la tabla `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`username`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `action`
--
ALTER TABLE `action`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `group_action`
--
ALTER TABLE `group_action`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `group_type`
--
ALTER TABLE `group_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `group_user`
--
ALTER TABLE `group_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `session`
--
ALTER TABLE `session`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `group_action`
--
ALTER TABLE `group_action`
  ADD CONSTRAINT `group_action_ibfk_1` FOREIGN KEY (`id_action`) REFERENCES `action` (`id`),
  ADD CONSTRAINT `group_action_ibfk_2` FOREIGN KEY (`id_group`) REFERENCES `group_type` (`id`);

--
-- Filtros para la tabla `group_user`
--
ALTER TABLE `group_user`
  ADD CONSTRAINT `group_user_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `group_user_ibfk_2` FOREIGN KEY (`id_group`) REFERENCES `group_type` (`id`);

--
-- Filtros para la tabla `session`
--
ALTER TABLE `session`
  ADD CONSTRAINT `session_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);
COMMIT;
ALTER TABLE users ADD COLUMN token VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN email VARCHAR(255) NULL;

ALTER TABLE users ADD COLUMN email_verified TINYINT(1) DEFAULT 0;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
