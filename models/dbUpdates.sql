DROP TABLE IF EXISTS users;
CREATE TABLE users(
    userId SERIAL PRIMARY KEY,
    name varchar(50),
    facebook varchar(100),
    twitter varchar(100),
    dateRegistered DATE
);

DROP TABLE IF EXISTS faucets;
CREATE TABLE faucets(
    userId INT,
    faucetId INT
);

DROP TABLE IF EXISTS waterusage_by_session;
CREATE TABLE waterusage_by_session(
    sessionId SERIAL PRIMARY KEY,
    faucetId INT,
    userId INT,
    usage INT,
    date DATE
);

DROP TABLE IF EXISTS waterusage_by_day;
CREATE TABLE waterusage_by_day(
    userId INT,
    usage INT,
    date VARCHAR(10) -- in yyyy-mm-dd format
);

DROP TABLE IF EXISTS waterusage_by_month;
CREATE TABLE waterusage_by_month(
    userId INT,
    month VARCHAR(30),
    usage INT,
    lastUpdate DATE
);
