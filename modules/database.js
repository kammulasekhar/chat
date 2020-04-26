var mysql = require('mysql');

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sekhar",
    // database: 'chat_app_db'
});

db.query("CREATE DATABASE IF NOT EXISTS chat_app_db");
db.query("USE chat_app_db");
db.query("CREATE TABLE IF NOT EXISTS register (id int(11) NOT NULL AUTO_INCREMENT,name text NOT NULL,email text NOT NULL,mobilenumber varchar(20) NOT NULL,password longtext NOT NULL,image longtext NOT NULL,onlineindication varchar(20) NOT NULL,lastseen longtext NOT NULL,registeredon longtext NOT NULL,PRIMARY KEY (id))ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=latin1;");
// db.query("CREATE TABLE IF NOT EXISTS messages (me_user varchar(20) NOT NULL, me_fname varchar(20) NOT NULL, me_pic longtext NOT NULL, to_user varchar(20) NOT NULL, to_fname varchar(20) NOT NULL, to_pic longtext NOT NULL, message longtext NULL,attachment longtext NULL,type varchar(20) NULL, mst varchar(40) NOT NULL,reply longtext NULL,fname varchar(20) NULL,replytype varchar(20) NULL,replyattachment longtext NULL, status varchar(10) NOT NULL, callduration varchar(20) NOT NULL, fromdelete varchar(20) NULL, todelete varchar(20) NULL);");
// db.query("CREATE TABLE IF NOT EXISTS group_messages (messageId INT NOT NULL AUTO_INCREMENT PRIMARY KEY, groupId INT NOT NULL, groupname longtext, uniquegroupname longtext, senderpic longtext NOT NULL, senderUsername varchar(20) NOT NULL, senderfname varchar(20) NOT NULL, message longtext NULL, mst varchar(40) NOT NULL, attachment longtext NULL, type varchar(20) NULL, replygroupmessage longtext NULL, replygroupfname varchar(20) NULL, replygrouptype varchar(20) NULL,replygroupattachment longtext NULL);");
// db.query("CREATE TABLE IF NOT EXISTS groups (groupId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,admin varchar(20), groupname longtext, groupimage longtext, uniquegroupname longtext, gcd longtext NOT NULL);");
// db.query("CREATE TABLE IF NOT EXISTS sessions (username varchar(20) NOT NULL);");
// db.query("CREATE TABLE IF NOT EXISTS meetings (meetingId INT NOT NULL AUTO_INCREMENT PRIMARY KEY, meetadmin varchar(20),uniquemeetname longtext, meetsubject longtext NOT NULL, description longtext NOT NUll,date longtext NOT NULL,meetingtime longtext NOT NULL,uniquetime longtext NOT NULL,meetingattachment longtext NULL,type varchar(20) NULL,meetingtype varchar(20) NULL,momtoall longtext NULL,momshared varchar(20) NULL,meetingcmpltd longtext NULL);");
// db.query("CREATE TABLE IF NOT EXISTS meetingnotifications (organizer varchar(20) NOT NULL, participant varchar(20) NOT NULL,accept_or_reject varchar(20) NULL, reason longtext NULL, uniquemeetname longtext NOT NULL,meetingsubject longtext NOT NULL, status varchar(10) NOT NULL, proposedtime varchar(40)  NULL, proposeddate varchar(40)  NULL);");
// db.query("CREATE TABLE IF NOT EXISTS acceptordeclinefiles (me_user varchar(20) NOT NULL, to_user varchar(20) NOT NULL, acceptordeclinefile varchar(10) NOT NULL);");
// db.query("CREATE TABLE IF NOT EXISTS groupnotifications (groupnotificationId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,uniquegroupname longtext NULL, groupname longtext NULL, newadmin varchar(20) NULL, oldadmin varchar(20) NULL, time longtext NULL);")
// db.query("CREATE TABLE IF NOT EXISTS groupnewadminnotifications (groupnotificationId INT NOT NULL,oldadmin varchar(20) NOT NULL,newadmin varchar(20) NOT NULL,usersingroup varchar(20) NOT NULL, status varchar(20) NOT NULL)")
// db.query("CREATE TABLE IF NOT EXISTS quotes (quoteId INT NOT NULL AUTO_INCREMENT PRIMARY KEY, postedby text NOT NULL, quote longtext NOT NULL, date longtext NOT NULL, name text NOT NULL,userimage longtext NOT NULL );");
// db.query("CREATE TABLE IF NOT EXISTS information (informationId INT NOT NULL AUTO_INCREMENT PRIMARY KEY, postedby text NOT NULL, information longtext NOT NULL, date longtext NOT NULL, name text NOT NULL,userimage longtext NOT NULL );");
// db.query("CREATE TABLE IF NOT EXISTS informationnotifications (informationId INT NOT NULL,member varchar(20) NOT NULL, status varchar(10) NOT NULL );");

// db.query("CREATE TABLE IF NOT EXISTS sharefiles (uploadername varchar(20) NOT NULL, uploaderusername varchar(20) NOT NULL, file longtext NOT NULL, filetype longtext NOT NULL, fst longtext NOT NULL)");
// db.query("CREATE TABLE IF NOT EXISTS sharedfiles (uploadername varchar(20) NOT NULL, uploaderusername varchar(20) NOT NULL, file longtext NOT NULL, filetype longtext NOT NULL, fst longtext NOT NULL, fromname varchar(20) NOT NULL, fromusername varchar(20) NOT NULL, toname varchar(20) NOT NULL, tousername varchar(20) NOT NULL, status varchar(10) NOT NULL)")
// db.query("CREATE TABLE IF NOT EXISTS leaveletter (leaveId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,uniqueleavename longtext NULL,fromuname text NOT NULL, fromfname text NOT NULL, subject longtext NOT NULL, reason longtext NOT NULL, hours longtext NULL, fromdate longtext NULL, todate longtext NULL,currentdate longtext NOT NULL, fromdelete varchar(10) NULL);");
// db.query("CREATE TABLE IF NOT EXISTS leavereplys (uniqueleavename longtext NOT NULL,fromfname text NOT NULL,fromuname text NOT NULL,tofname text NOT NULL,touname text NOT NULL,replymessage longtext NOT NULL,rst longtext NOT NULL,replymsgId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,notification varchar(20) NOT NULL);");
// db.query("CREATE TABLE IF NOT EXISTS callhistroy (typeofcall varchar(20) NOT NULL,callerfname varchar(20) NOT NULL,calleruname varchar(20) NOT NULL,callerpic longtext NOT NULL,calleefname varchar(20) NOT NULL,calleeuname varchar(20) NOT NULL,calleepic longtext NOT NULL,callendtype text NOT NULL,callduration varchar(20) NULL,callstarttime varchar(40) NOT NULL, callendtime varchar(40) NULL, callersticky longtext NULL, calleesticky longtext NULL,callerdelete varchar(10) NULL, calleedelete varchar(10) NULL);");
// db.query("CREATE TABLE IF NOT EXISTS checkcallavailability (callunames varchar(20) NULL);");

module.exports = db;