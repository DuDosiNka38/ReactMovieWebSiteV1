SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `Activities` (
  `Case_NAME` varchar(10) NOT NULL,
  `Activity_Name` varchar(200) NOT NULL,
  `Activity_Title` varchar(200) NOT NULL,
  `Activity_type` varchar(45) NOT NULL,
  `Owner` varchar(20) DEFAULT NULL,
  `Comments` varchar(4000) DEFAULT NULL,
  `Tentative_Calendar_name` varchar(20) DEFAULT 'DEFAULT_CALENDAR',
  `Tentative_date` datetime DEFAULT NULL,
  `Parent_Activity_Name` varchar(200) DEFAULT NULL,
  `Parent_Activity_type` varchar(200) DEFAULT NULL,
  `Time_estimate_days` int(11) DEFAULT NULL,
  `Responsible_Person_id` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `Activity_Docs_Xref` (
  `DOC_ID` int(11) NOT NULL,
  `Relation_type` varchar(10) NOT NULL,
  `Case_NAME` varchar(10) NOT NULL,
  `Activity_Name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `Activity_types` (
  `Activity_type` varchar(45) NOT NULL,
  `Description` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `Activity_types` (`Activity_type`, `Description`) VALUES
('ARRAIGNMENT', 'Arraignment'),
('DEPOSITION', 'Deposition'),
('EXPARTE', 'Exparte'),
('LAW_AND_MOTION_HEARING', 'Law and Motion Hearing'),
('LONG_CAUSE_HEARING', 'Long cause hearing'),
('MANDATORY_SETTLEMENT_CONFERENCE', 'Mandatory Settlement Conference'),
('SHORT_CAUSE_HEARING', 'Short cause Hearing'),
('STATUS_CONFERENCE', 'Status Conference');

CREATE TABLE `Act_Requirements` (
  `Case_Type` varchar(20) NOT NULL,
  `Parent_Activity_type` varchar(45) NOT NULL,
  `Child_Activity_type` varchar(45) NOT NULL,
  `Max_Days_before` int(11) DEFAULT NULL,
  `Min_days_before` int(11) DEFAULT NULL,
  `Max_Days_after` int(11) DEFAULT NULL,
  `Min_Days_after` int(11) DEFAULT NULL,
  `Additional_rules` varchar(4000) DEFAULT NULL,
  `Calendar_type` enum('BUSINESS_DAYS','CALENDAR_DAYS') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `Act_Requirements` (`Case_Type`, `Parent_Activity_type`, `Child_Activity_type`, `Max_Days_before`, `Min_days_before`, `Max_Days_after`, `Min_Days_after`, `Additional_rules`, `Calendar_type`) VALUES
('CIVIL', 'ARRAIGNMENT', 'ARRAIGNMENT', 0, 0, 0, 0, NULL, 'BUSINESS_DAYS'),
('CIVIL', 'ARRAIGNMENT', 'DEPOSITION', 0, 0, 0, 0, NULL, 'BUSINESS_DAYS'),
('CIVIL', 'ARRAIGNMENT', 'EXPARTE', 5, 5, 5, 5, NULL, 'BUSINESS_DAYS'),
('FAM', 'ARRAIGNMENT', 'DEPOSITION', 4, 4, 0, 0, NULL, 'BUSINESS_DAYS'),
('FAM', 'ARRAIGNMENT', 'LONG_CAUSE_HEARING', 3, 5, 3, 4, NULL, 'CALENDAR_DAYS'),
('FAM', 'EXPARTE', 'ARRAIGNMENT', 5, 5, 5, 5, NULL, 'BUSINESS_DAYS');

CREATE TABLE `Alerts` (
  `Alert_id` int(11) NOT NULL,
  `Alert_text` varchar(450) NOT NULL,
  `To_dos_to_do_id` int(11) NOT NULL,
  `Person_id` varchar(20) NOT NULL,
  `Case_NAME` varchar(100) NOT NULL,
  `Alert_Date` datetime DEFAULT NULL,
  `Alert_Showed` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `Calendars` (
  `Calendar_name` varchar(20) NOT NULL,
  `Description` varchar(45) NOT NULL,
  `Modifiable` enum('Y','N') DEFAULT 'Y'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `Calendars` (`Calendar_name`, `Description`, `Modifiable`) VALUES
('DEFAULT_CALENDAR', 'DEFAULT', 'N');

CREATE TABLE `Calendar_Types` (
  `Calendar_Type` varchar(100) NOT NULL,
  `Description` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `Calendar_Types` (`Calendar_Type`, `Description`) VALUES
('BUSINESS_DAYS', 'BUSINESS DAYS'),
('CALENDAR_DAYS', 'CALENDAR DAYS');

CREATE TABLE `Cases` (
  `Case_Short_NAME` varchar(100) NOT NULL,
  `Case_Full_NAME` varchar(100) NOT NULL,
  `Case_Number` varchar(45) DEFAULT NULL,
  `DESCRIPTION` varchar(500) DEFAULT NULL,
  `Status` varchar(100) DEFAULT 'ACTIVE',
  `Case_Type` varchar(20) NOT NULL DEFAULT 'FAM',
  `Department_id` varchar(20) DEFAULT 'DEFAULT_DEPARTMENT',
  `CaseBg` varchar(10) NOT NULL,
  `Case_CREATED_DATE` datetime NOT NULL DEFAULT current_timestamp(),
  `Case_LAST_CHANGED_DATE` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
DELIMITER $$
CREATE TRIGGER `Case_Actions_Log_Cases` AFTER INSERT ON `Cases` FOR EACH ROW INSERT INTO `Case_Actions_Log` SET `Case_NAME` = NEW.`Case_Short_NAME`, `Case_Action_NAME` = 'CREATE_CASE'
$$
DELIMITER ;

CREATE TABLE `Case_Actions` (
  `Action_NAME` varchar(100) NOT NULL,
  `Action_DESC` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `Case_Actions` (`Action_NAME`, `Action_DESC`) VALUES
('ADD_CASE_PARTICIPANT', 'ADD_CASE_PARTICIPANT'),
('CREATE_CASE', 'CREATE_CASE'),
('DELETE_CASE', 'DELETE_CASE'),
('DELETE_CASE_PARTICIPANT', 'DELETE_CASE_PARTICIPANT'),
('UPDATE_CASE', 'UPDATE_CASE'),
('UPDATE_CASE_PARTICIPANT', 'UPDATE_CASE_PARTICIPANT');

CREATE TABLE `Case_Actions_Log` (
  `Action_Log_ID` int(11) NOT NULL,
  `Case_NAME` varchar(100) NOT NULL,
  `Person_id` varchar(20) DEFAULT NULL,
  `Case_Action_NAME` varchar(100) NOT NULL,
  `Action_Log_DATE` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `Case_Participants` (
  `Person_id` varchar(20) NOT NULL,
  `Case_NAME` varchar(100) NOT NULL,
  `Start_date` datetime DEFAULT current_timestamp(),
  `End_Date` datetime DEFAULT NULL,
  `Case_Participant_ROLE` varchar(20) DEFAULT NULL,
  `Case_Participant_SIDE` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
DELIMITER $$
CREATE TRIGGER `Case_Actions_Log_Case_Participants` AFTER INSERT ON `Case_Participants` FOR EACH ROW INSERT INTO `Case_Actions_Log` SET `Case_NAME` = NEW.`Case_NAME`, `Case_Action_NAME` = 'ADD_CASE_PARTICIPANT', `Person_id` = NEW.`Person_id`
$$
DELIMITER ;

CREATE TABLE `Case_Roles` (
  `Role` varchar(20) NOT NULL,
  `Description` varchar(200) NOT NULL,
  `Show` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `Case_Roles` (`Role`, `Description`, `Show`) VALUES
('ADMIN', 'Administrator', 1),
('MANAGER', 'Manager', 1),
('OWNER', 'Owner', 0),
('WATCHER', 'Watcher', 1),
('WITNESS', 'Witness', 1);

CREATE TABLE `Case_Role_Privileges` (
  `row_id` int(11) NOT NULL,
  `Role` varchar(20) NOT NULL,
  `Privilege` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `Case_Sides` (
  `Side` varchar(20) NOT NULL,
  `Description` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `Case_Sides` (`Side`, `Description`) VALUES
('OFFICE', 'Office'),
('OPPOSITE', 'Opposite'),
('THIRD_PARTY', 'Third Party');

CREATE TABLE `Case_Statuses` (
  `Status` varchar(100) NOT NULL,
  `Status_Description` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `Case_Statuses` (`Status`, `Status_Description`) VALUES
('ACTIVE', 'Active'),
('CLOSED', 'Closed');

CREATE TABLE `Case_Types` (
  `Case_Type` varchar(20) NOT NULL,
  `Description` varchar(45) DEFAULT NULL,
  `Type_Color` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `Case_Types` (`Case_Type`, `Description`, `Type_Color`) VALUES
('CIVIL', 'Civil', '#4aa3ff'),
('FAM', 'Family Law', '#ff3d60'),
('OTHER', 'Other', '#d4d4d4'),
('PROBATE', 'Probate', '#1cbb8c');

CREATE TABLE `Computers` (
  `Person_id` varchar(20) NOT NULL,
  `Computer_id` varchar(45) NOT NULL,
  `Mac_Address` varchar(45) NOT NULL,
  `Computer_type` enum('DOCS_SERVER','CLIENT') NOT NULL DEFAULT 'CLIENT',
  `OS` varchar(45) NOT NULL,
  `Request_date` datetime NOT NULL DEFAULT current_timestamp(),
  `Approved_date` datetime DEFAULT NULL,
  `Computer_user` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `Departments` (
  `Department_id` varchar(20) NOT NULL,
  `Court_name` varchar(45) NOT NULL,
  `Department_Name` varchar(45) NOT NULL,
  `Judge_name` varchar(45) NOT NULL,
  `Download_Events_API` varchar(400) DEFAULT NULL,
  `Calendar_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `Documents` (
  `DOC_ID` int(11) NOT NULL,
  `DOCUMENT_NAME` varchar(100) NOT NULL DEFAULT 'UNKNOWN' COMMENT 'Description to be shown at search time\n',
  `Description` varchar(4000) NOT NULL DEFAULT 'UNKNOWN' COMMENT 'Full description of the document\n',
  `CREATED_DATE` datetime DEFAULT current_timestamp(),
  `FILED_DATE` datetime DEFAULT NULL,
  `Case_NAME` varchar(10) NOT NULL DEFAULT 'IR-SM',
  `Person_id` varchar(20) NOT NULL DEFAULT 'GG',
  `Form` varchar(100) DEFAULT NULL,
  `UPDATE_DATE` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='Generic Documents entity\n';
DELIMITER $$
CREATE TRIGGER `ADD_DOCUMENT_ACTION` AFTER INSERT ON `Documents` FOR EACH ROW INSERT INTO `Document_Actions_Log` SET `Document_Actions_Log`.`DOC_ID`=NEW.DOC_ID, `Document_Actions_Log`.`Person_id`=NEW.Person_id, `Document_Actions_Log`.`Document_Action_NAME` = "ADD_DOCUMENT"
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `UPDATE_DOCUMENT_ACTION` AFTER UPDATE ON `Documents` FOR EACH ROW INSERT INTO `Document_Actions_Log` SET `Document_Actions_Log`.`DOC_ID`=NEW.DOC_ID, `Document_Actions_Log`.`Person_id`=NEW.Person_id, `Document_Actions_Log`.`Document_Action_NAME` = "EDIT_DOCUMENT"
$$
DELIMITER ;

CREATE TABLE `Document_Actions` (
  `Action_NAME` varchar(200) NOT NULL,
  `Action_DESC` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `Document_Actions` (`Action_NAME`, `Action_DESC`) VALUES
('ADD_DOCUMENT', 'ADD_DOCUMENT'),
('EDIT_DOCUMENT', 'ADD_DOCUMENT');

CREATE TABLE `Document_Actions_Log` (
  `Action_Log_ID` int(11) NOT NULL,
  `DOC_ID` int(11) NOT NULL,
  `Person_id` varchar(20) NOT NULL,
  `Document_Action_NAME` varchar(200) NOT NULL,
  `Action_Log_DATE` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Doc_files` (
  `File_id` varchar(32) NOT NULL,
  `DOC_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `Doc_Keywords` (
  `DOC_ID` int(11) NOT NULL,
  `KEYWORDS` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `Errors` (
  `Error_Cat_NAME` varchar(30) NOT NULL,
  `Error_CODE` varchar(100) NOT NULL,
  `Error_MESSAGE` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `Error_Categories` (
  `Cat_NAME` varchar(30) NOT NULL,
  `Cat_DESC` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `Error_Categories` (`Cat_NAME`, `Cat_DESC`) VALUES
('CASE', 'Case category'),
('USER', 'User category');

CREATE TABLE `Event_Actions` (
  `Action_NAME` varchar(200) NOT NULL,
  `Action_DESC` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Files` (
  `File_id` varchar(32) NOT NULL,
  `Format` varchar(45) DEFAULT NULL,
  `Form` varchar(100) NOT NULL DEFAULT 'UNCLASSIFIED',
  `Size` int(11) NOT NULL,
  `CREATED_DATE` datetime NOT NULL DEFAULT current_timestamp(),
  `Preview_img` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `File_Formats` (
  `Format` varchar(20) NOT NULL,
  `Matchcode` varchar(100) NOT NULL,
  `Description` varchar(100) NOT NULL,
  `Format_subdir` varchar(45) NOT NULL,
  `disabled` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `File_Formats` (`Format`, `Matchcode`, `Description`, `Format_subdir`, `disabled`) VALUES
('csv', '.*\\csv', 'soffice', 'csv', 0),
('doc', '.*\\.doc', 'soffice', 'doc', 0),
('docx', '.*\\.docx', 'soffice', 'doc', 0),
('jpeg', '.*jpg|.*png', 'picture', 'jpg', 0),
('ocr.pdf', '.*OCR[^a-zA-Z0-9]\\.pdf', 'Searchable PDF', 'ocr_pdf', 0),
('odt', '.*\\odt', 'soffice', 'odt', 0),
('pdf', '.*\\.pdf', 'PDF', 'pdf', 0),
('rtf', '.*\\.rtf', 'soffice', 'ftf', 0),
('txt', '.*\\.txt', 'Text', 'txt', 0),
('xls', '.*\\xls', 'soffice', 'xls', 0),
('xlsx', '.*\\xlsx', 'soffice', 'xls', 0);

CREATE TABLE `File_Forms` (
  `Form` varchar(100) NOT NULL,
  `Description` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `File_Forms` (`Form`, `Description`) VALUES
('ADOPT-050-INFO', 'How to Adopt a Child in California'),
('ADOPT-200', 'Adoption Request'),
('ADOPT-205', 'Declaration Confirming Parentage in Stepparent Adoption'),
('ADOPT-206', 'Declaration Confirming Parentage in Stepparent Adoption: Gestational Surrogacy'),
('ADOPT-210', 'Adoption Agreement'),
('ADOPT-215', 'Adoption Order'),
('ADOPT-216', 'Verification of Compliance with Hague Adoption Convention Attachment'),
('ADOPT-220', 'Adoption of Indian Child'),
('ADOPT-225', 'Parent Of Indian Child Agrees To End Parental Rights'),
('ADOPT-230', 'Adoption Expenses'),
('ADOPT-310', 'Contact After Adoption Agreement'),
('ADOPT-315', 'Request to: Enforce, Change, End Contact After Adoption Agreement'),
('ADOPT-320', 'Answer to Request to: Enforce, Change, End Contact After Adoption Agreement'),
('ADOPT-325', 'Judge\'s Order to: Enforce, Change, End Contact After Adoption Agreement'),
('ADOPT-330', 'Request for Appointment of Confidential Intermediary'),
('ADOPT-331', 'Order for Appointment of Confidential Intermediary'),
('ADR-100', 'Statement of Agreement or Nonagreement'),
('ADR-101', 'ADR Information Form'),
('ADR-102', 'Request for Trial De Novo After Judicial Arbitration'),
('ADR-103', 'Petition to Confirm, Correct, or Vacate Attorney-Client Fee Arbitration Award'),
('ADR-104', 'Rejection of Award and Request for Trial After Attorney-Client Fee Arbitration'),
('ADR-105', 'Information Regarding Rights After Attorney-Client Fee Arbitration'),
('ADR-106', 'Petition to Confirm, Correct, or Vacate Contractual Arbitration Award'),
('ADR-107', 'Attendance Sheet for Court-Program Mediation of Civil Case'),
('ADR-109', 'Stipulation or Motion for Order Appointing Referee'),
('ADR-110', 'Order Appointing Referee'),
('ADR-111', 'Report of Referee'),
('ADR-200', 'Mediation Disclosure Notification and Acknowledgement'),
('APP-001-INFO', 'Information on Appeal Procedures for Unlimited Civil Cases'),
('APP-002', 'Notice of Appeal/Cross-Appeal (Unlimited Civil Case)'),
('APP-003', 'Appellant\'s Notice Designating Record on Appeal (Unlimited Civil Case)'),
('APP-004', 'Civil Case Information Statement (Appellate)'),
('APP-005', 'Abandonment of Appeal (Unlimited Civil Case)'),
('APP-006', 'Application for Extension of Time to File Brief (Civil Case)'),
('APP-007', 'Request for Dismissal of Appeal (Civil Case)'),
('APP-008', 'Certificate of Interested Entities or Persons'),
('APP-009', 'Proof of Service (Court of Appeal)'),
('APP-009-INFO', 'Information Sheet For Proof of Service (Court of Appeal)'),
('APP-009E', 'Proof of Electronic Service'),
('APP-010', 'Respondent\'s Notice Designating Record on Appeal (Unlimited Civil Case)'),
('APP-011', 'Respondent\'s Notice Electing to Use an Appendix (Unlimited Civil Case)'),
('APP-012', 'Stipulation of Extension of Time to File Brief (Civil Case)'),
('APP-013', 'Memorandum of Costs on Appeal'),
('APP-014', 'Appellant\'s Proposed Settled Statement (Unlimited Civil Case)'),
('APP-014-INFO', 'Information Sheet for Proposed Settled Statement'),
('APP-014A', 'Other Party and Nonparty Witness Testimony and other Evidence Attachment (Unlimited Civil Case)'),
('APP-015-INFO', 'Information Sheet on Waiver of Appellate Court Fees (Supreme Court, Court of Appeal, Appellate Division)'),
('APP-016', 'Order on Court Fee Waiver (Court of Appeal or Supreme Court)'),
('APP-016-GC', 'Order on Court Fee Waiver (Court of Appeal or Supreme Court) (Ward or Conservatee)'),
('APP-020', 'Response to Appellant\'s Proposed Settled Statement (Unlimited Civil Case)'),
('APP-022', 'Order on Appellant\'s Proposed Settled Statement (Unlimited Civil Case)'),
('APP-025', 'Appellant Motion to Use a Settled Statement (Unlimited Civil Case)'),
('APP-031A', 'Attached Declaration (Court of Appeal)'),
('APP-060', 'Notice of Appeal - Civil Commitment/Mental Health Proceedings'),
('APP-101-INFO', 'Information on Appeal Procedures for Limited Civil Cases'),
('APP-102', 'Notice of Appeal/Cross-Appeal (Limited Civil Case)'),
('APP-103', 'Appellant\'s Notice Designating Record on Appeal (Limited Civil Case)'),
('APP-104', 'Proposed Statement on Appeal (Limited Civil Case)'),
('APP-105', 'Order Concerning Appellant\'s Proposed Statement on Appeal (Limited Civil Case)'),
('APP-106', 'Application for Extension of Time to File Brief (Limited Civil Case)'),
('APP-107', 'Abandonment of Appeal (Limited Civil Case)'),
('APP-108', 'Notice of Waiver of Oral Argument (Limited Civil Case)'),
('APP-109', 'Proof of Service (Appellate Division)'),
('APP-109-INFO', 'What Is Proof of Service?'),
('APP-109E', 'Proof of Electronic Service (Appellate Division)'),
('APP-110', 'Respondent\'s Notice Designating Record on Appeal (Limited Civil Case)'),
('APP-111', 'Respondent\'s Notice Electing to Use an Appendix (Limited Civil Case)'),
('APP-150-INFO', 'Information on Writ Proceedings in Misdemeanor, Infraction, and Limited Civil Cases'),
('APP-151', 'Petition for Writ (Misdemeanor, Infraction, or Limited Civil Case)'),
('AT-105', 'Application for Right to Attach Order, Temporary Protective Order, etc.'),
('AT-115', 'Notice of Application and Hearing for Right to Attach Order and Writ of Attachment'),
('AT-120', 'Right to Attach Order After Hearing and Order for Issuance of Writ of Attachment'),
('AT-125', 'Ex Parte Right to Attach Order and Order for Issuance of Writ of Attachment (Resident)'),
('AT-130', 'Ex Parte Right to Attach Order and Order for Issuance of Writ of Attachment (Nonresident)'),
('AT-135', 'Writ of Attachment'),
('AT-138', 'Application and Order for Appearance and Examination'),
('AT-140', 'Temporary Protective Order'),
('AT-145', 'Application and Notice of Hearing for Order to Terminate, Modify, or Vacate Temporary Protective Order'),
('AT-150', 'Order to Terminate, Modify, or Vacate Temporary Protective Order'),
('AT-155', 'Notice of Opposition to Right to Attach Order and Claim of Exemption'),
('AT-160', 'Undertaking By Personal Sureties'),
('AT-165', 'Notice of Attachment'),
('AT-167', 'Memorandum Of Garnishee'),
('AT-170', 'Application to Set Aside Right to Attach Order and Release Attached Property, Etc.'),
('AT-175', 'Order to Set Aside Attachment, to Substitute Undertaking, Etc.'),
('AT-180', 'Notice of Lien'),
('BMD-001', 'Petition to Establish Fact, Time, and Place of Birth'),
('BMD-001A', 'Declaration in Support of Petition to Establish Fact, Time, and Place of Birth'),
('BMD-002', 'Petition to Establish Fact, Time, and Place of Marriage'),
('BMD-002A', 'Declaration in Support of Petition to Establish Fact, Time, and Place of Marriage'),
('BMD-003', 'Petition to Establish Fact, Date, and Place of Death'),
('BMD-003A', 'Declaration in Support of Petition to Establish Fact, Date, and Place of Death'),
('CD-100', 'Application For Writ of Possession'),
('CD-110', 'Notice of Application for Writ of Possession and Hearing'),
('CD-120', 'Order for Writ of Possession'),
('CD-130', 'Writ of Possession'),
('CD-140', 'Undertaking By Personal Sureties'),
('CD-160', 'Application and Notice of Application and Hearing for Order to Quash Ex Parte Writ of Possession'),
('CD-170', 'Order for Release and Redelivery of Property'),
('CD-180', 'Declaration for Ex Parte Writ of Possession'),
('CD-190', 'Application for Temporary Restraining Order'),
('CD-200', 'Temporary Restraining Order'),
('CH-100', 'Request For Civil Harassment Restraining Orders'),
('CH-100-INFO', 'Can a Civil Harassment Restraining Order Help Me?'),
('CH-109', 'Notice of Court Hearing'),
('CH-110', 'Temporary Restraining Order (CLETS-TCH)'),
('CH-115', 'Request to Continue Court Hearing (Temporary Restraining Order) (Civil Harassment Prevention)'),
('CH-115-INFO', 'How to Ask for a New Hearing Date (Civil Harassment Prevention)'),
('CH-116', 'Order on Request to Continue Hearing (Temporary Restraining Order) (CLETS-TCH) (Civil Harassment Prevention)'),
('CH-120', 'Response to Request for Civil Harassment Restraining Orders'),
('CH-120-INFO', 'How Can I Respond to a Request for Civil Harassment Restraining Orders?'),
('CH-130', 'Civil Harassment Restraining Order After Hearing (CLETS-CHO)'),
('CH-160', 'Fingerprint Form'),
('CH-160-INFO', 'Privacy Protection for a Minor (Person Under 18 Years Old)'),
('CH-165', 'Order on Request to Keep Minor\'s Information Confidential'),
('CH-170', 'Notice of Order Protecting Information of Minor'),
('CH-175', 'Cover Sheet for Confidential Information'),
('CH-176', 'Request for Release of Minor\'s Confidential Information'),
('CH-177', 'Notice of Request for Release of Minor\'s Confidential Information'),
('CH-178', 'Response to Request for Release of Minor\'s Confidential Information'),
('CH-179', 'Order on Request for Release of Minor\'s Confidential Information'),
('CH-200', 'Proof of Personal Service'),
('CH-200-INFO', 'What Is Proof of Personal Service?'),
('CH-250', 'Proof of Service of Response by Mail'),
('CH-260', 'Proof of Service of Order After Hearing by Mail'),
('CH-600', 'Request to Modify/Terminate Civil Harassment Restraining Order'),
('CH-610', 'Notice of Hearing on Request to Modify/Terminate Civil Harrassment Restraining Order'),
('CH-620', 'Response to Request to Modify/Terminate Civil Harassment Restraining Order'),
('CH-630', 'Order on Request to Modify/Terminate Civil Harassment Restraining Order'),
('CH-700', 'Request to Renew Restraining Order'),
('CH-710', 'Notice of Hearing to Renew Restraining Order'),
('CH-720', 'Response to Request to Renew Restraining Order'),
('CH-730', 'Order Renewing Civil Harassment Restraining Order (CLETS)'),
('CH-800', 'Proof of Firearms Turned In, Sold, or Stored'),
('CH-800-INFO', 'How Do I Turn In, Sell, or Store My Firearms?'),
('CIV-010', 'Application and Order for Appointment of Guardian Ad Litem—Civil'),
('CIV-020', 'Notice of Intent to Appear by Telephone'),
('CIV-025', 'Application and Order for Reissuance of Order to Show Cause and Temporary Restraining Order'),
('CIV-050', 'Statement of Damages (Personal Injury or Wrongful Death)'),
('CIV-090', 'Offer to Compromise and Acceptance Under Code of Civil Procedure Section 998'),
('CIV-100', 'Request for Entry of Default (Application to Enter Default)'),
('CIV-105', 'Request for Entry of Default (Fair Debt Buying Practices Act)'),
('CIV-110', 'Request for Dismissal'),
('CIV-120', 'Notice of Entry of Dismissal and Proof of Service'),
('CIV-130', 'Notice of Entry of Judgment or Order'),
('CIV-140', 'Declaration of Demurring Party Regarding Meet and ConfeR'),
('CIV-141', 'Declaration of Demurring Party in Support of Automatic Extension'),
('CIV-150', 'Notice of Limited Scope Representation'),
('CIV-151', 'Application to Be Relieved as Attorney on Completion of Limited Scope Representation'),
('CIV-152', 'Objection to Application to Be Relieved as Attorney on Completion of Limited Scope Representation'),
('CIV-153', 'Order on Application to Be Relieved as Attorney on Completion of Limited Scope Representation'),
('CIV-160', 'Petition for Order Striking and Releasing Lien, etc. (Government Employee)'),
('CIV-161', 'Order to Show Cause (Government Employee)'),
('CIV-165', 'Order on Unlawful Use of Personal Identifying Information'),
('CIV-170', 'Petition and Declaration Regarding Unresolved Claims and Deposit of Undistributed Surplus Proceeds of Trustee\'s Sale'),
('CLETS-001', 'Confidential CLETS Information'),
('CM-010', 'Civil Case Cover Sheet'),
('CM-011', 'Confidential Cover Sheet False Claims Action'),
('CM-015', 'Notice of Related Case'),
('CM-020', 'Ex Parte Application for Extension of Time to Serve Pleading and Orders'),
('CM-110', 'Case Management Statement'),
('CM-180', 'Notice of Stay of Proceedings'),
('CM-181', 'Notice of Termination or Modification of Stay'),
('CM-200', 'Notice of Settlement of Entire Case'),
('CP10', 'Claim of Right to Posession and notice of Hearing'),
('CP10.5', 'Prejudgment Claim of Right to Possession'),
('CR-100', 'Fingerprint Form'),
('CR-101', 'Plea Form, With Explanations and Waiver of Rights—Felony (Criminal)'),
('CR-102', 'Domestic Violence Plea Form With Waiver of Rights (Misdemeanor)'),
('CR-105', 'Defendant\'s Financial Statement on Eligibility for Appointment of Counsel and Reimbursement and Record on Appeal at Public Expense'),
('CR-106', 'Proof of Service - Criminal Record Clearing'),
('CR-106-INFO', 'Information on How to File a Proof of Service in Criminal Record Clearing Requests'),
('CR-110', 'Order for Victim Restitution'),
('CR-111', 'Abstract of Judgment—Restitution'),
('CR-112', 'Instructions: Order for Restitution and Abstract of Judgment'),
('CR-113', 'Instructions: Abstract of Judgment—Restitution'),
('CR-115', 'Defendant\'s Statement of Assets'),
('CR-117', 'Instructions: Defendant\'s Statement of Assets'),
('CR-118', 'Information Regarding Income Deduction Order (Pen.Code, § 1202.42)'),
('CR-119', 'Order For Income Deduction (Pen.Code, § 1202.42)'),
('CR-120', 'Notice of Appeal—Felony (Defendant)'),
('CR-125', 'Order to Attend Court or Provide Documents: Subpoena/Subpoena Duces Tecum'),
('CR-126', 'Application for Extension of Time to File Brief (Criminal Case)'),
('CR-131-INFO', 'Information on Appeal Procedures for Misdemeanors'),
('CR-132', 'Notice of Appeal (Misdemeanor)'),
('CR-133', 'Request for Court-Appointed Lawyer in Misdemeanor Appeal'),
('CR-134', 'Notice Regarding Record on Appeal (Misdemeanor)'),
('CR-135', 'Proposed Statement on Appeal (Misdemeanor)'),
('CR-136', 'Order Concerning Appellant\'s Proposed Statement on Appeal (Misdemeanor)'),
('CR-137', 'Abandonment of Appeal (Misdemeanor)'),
('CR-138', 'Notice of Waiver of Oral Argument (Misdemeanor)'),
('CR-141-INFO', 'Information on Appeal Procedures for Infractions'),
('CR-142', 'Notice of Appeal and Record on Appeal (Infraction)'),
('CR-143', 'Proposed Statement on Appeal (Infraction)'),
('CR-144', 'Order Concerning Appellant\'s Proposed Statement on Appeal (Infraction)'),
('CR-145', 'Abandonment of Appeal (Infraction)'),
('CR-150', 'Certificate of Identity Theft: Judicial Finding of Factual Innocence'),
('CR-151', 'Petition for Certificate of Identity Theft (Pen. Code, § 530.6)'),
('CR-160', 'Criminal Protective Order—Domestic Violence (CLETS—CPO)'),
('CR-161', 'Criminal Protective Order—Other Than Domestic Violence (CLETS—CPO)'),
('CR-162', 'Order to Surrender Firearms in Domestic Violence Case (CLETS—CPO)'),
('CR-165', 'Notice of Termination of Protective Order in Criminal Proceeding (CLETS-CANCEL)'),
('CR-168', 'Batterer Intervention Program Progress Report'),
('CR-170', 'Notification of Decision Whether to Challenge Recommendation (Pen. Code, § 2972.1)'),
('CR-173', 'Order for Commitment (Sexually Violent Predator)'),
('CR-174', 'Order for Extended Commitment (Sexually Violent Predator)'),
('CR-180', 'Petition for Dismissal'),
('CR-181', 'Order for Dismissal'),
('CR-183', 'Petition for Dismissal (Military Personnel)'),
('CR-184', 'Order for Dismissal (Military Personnel)'),
('CR-185', 'Petition for Expungement of DNA Profiles and Samples (Pen. Code, § 299)'),
('CR-186', 'Order for Expungement of DNA Profiles and Samples (Pen. Code, § 299)'),
('CR-187', 'Motion to Vacate Conviction or Sentence'),
('CR-188', 'Order on Motion to Vacate Conviction or Sentence'),
('CR-190', 'Order Appointing Counsel in Capital Case'),
('CR-191', 'Declaration of Counsel for Appointment in Capital Case'),
('CR-200', 'Form Interrogatories—Crime Victim Restitution'),
('CR-210', 'Prohibited Persons Relinquishment Form Findings'),
('CR-220', 'Proof of Enrollment or Completion (Alcohol or Drug Program)'),
('CR-221', 'Order to Install Ignition Interlock Device'),
('CR-222', 'Ignition Interlock Installation Verification'),
('CR-223', 'Ignition Interlock Calibration Verification'),
('CR-224', 'Ignition Interlock Noncompliance Report'),
('CR-225', 'Ignition Interlock Removal and Modification to Probation Order'),
('CR-226', 'Notice to Employers of Ignition Interlock Restriction'),
('CR-250', 'Notice and Motion for Transfer'),
('CR-251', 'Order for Transfer'),
('CR-252', 'Receiving Court Comment Form'),
('CR-290', 'Felony Abstract of Judgment—Prison Commitment—Determinate'),
('CR-290(A)', 'Felony Abstract of Judgment Attachment Page'),
('CR-290.1', 'Felony Abstract of Judgment—Prison Commitment—Determinate Single, Concurrent, or Full Term Consecutive Count Form'),
('CR-292', 'Abstract of Judgment - Prison Commitment - Indeterminate'),
('CR-300', 'Petition for Revocation'),
('CR-301', 'Warrant Request and Order'),
('CR-302', 'Request and Order to Recall Warrant'),
('CR-320', 'Can\'t Afford to Pay Fine: Traffic and Other Infractions'),
('CR-321', 'Can\'t Afford to Pay Fine: Traffic and Other Infractions (Court Order)'),
('CR-400', 'Petition/Application (Health and Safety Code, § 11361.8) Adult Crime(s)'),
('CR-401', 'Proof of Service for Petition/Application (Health and Safety Code, § 11361.8) Adult Crime(s)'),
('CR-402', 'Prosecuting Agency\'s Response to Petition/Application (Health and Safety Code, § 11361.8) Adult Crime(s)'),
('CR-403', 'Order After Petition/Application (Health and Safety Code § 11363.8) Adult Crimes'),
('CR-404', 'Petition/Application for Resentencing and Dismissal'),
('CR-405', 'Order After Petition/Application for Resentencing and Dismissal'),
('CR-409', 'Petition to Seal Arrest and Related Records'),
('CR-409-INFO', 'Information on How to File a Petition to Seal Arrest and Related Records Under Penal Code Section 851.91'),
('CR-410', 'Order to Seal Arrest and Related Records (Pen. Code, Sections 851.91, 851.92)'),
('CR-412', 'Petition for Resentencing Based on Health Conditions due to Military Service Listed in Penal Code Section 1170.91(b)'),
('CR-600', 'Capital Case Attorney Pretrial Checklist (Criminal)'),
('CR-601', 'Captal Case Attorney List of Appearances (Criminal)'),
('CR-602', 'Capital Case Attorney List of Exhibits (Criminal)'),
('CR-603', 'Capital Case Attorney List of Motions (Criminal)'),
('CR-604', 'Capital Case Attorney List of Jury Instructions (Criminal)'),
('CR-605', 'Capital Case Attorney Trial Checklist (Criminal)'),
('DAL-001', 'Important Information For Building Owners and Tenants'),
('DAL-002', 'Answer—Disability Access'),
('DAL-005', 'Defendant\'s Application for Stay of Proceedings and Early Evaluation Conference, Joint Inspection'),
('DAL-006', 'Confidential Cover Sheet and Declaration re Documents for Stay and Early Evaluation Conference'),
('DAL-010', 'Notice of Stay of Proceedings and Early Evaluation Conference, Joint Inspection'),
('DAL-012', 'Proof of Service—Disability Access Litigation'),
('DAL-015', 'Application for Mandatory Evaluation Conference Under Code of Civil Procedure Section 55.545'),
('DAL-020', 'Notice of Mandatory Evaluation Conference'),
('DE-111', 'Petition for Probate'),
('DE-111(A-3e)', 'Waiver of Bond by Heir or Beneficiary'),
('DE-115', 'Notice of Hearing on Petition to Determine Claim to Property'),
('DE-120', 'Notice of Hearing—Decedent\'s Estate or Trust'),
('DE-120(MA)', 'Attachment to Notice of Hearing Proof of Service by Mail'),
('DE-120(P)', 'Proof of Personal Service of Notice of Hearing—Decedent\'s Estate or Trust'),
('DE-120(PA)', 'Attachment to Notice of Hearing Proof of Personal Service'),
('DE-121', 'Notice of Petition to Administer Estate'),
('DE-121(MA)', 'Attachment to Notice of Petition to Administer Estate—Proof of Service by Mail'),
('DE-122', 'Citation—Probate'),
('DE-125', 'Summons (Probate)'),
('DE-131', 'Proof of Subscribing Witness'),
('DE-135', 'Proof of Holographic Instrument'),
('DE-140', 'Order for Probate'),
('DE-142', 'Waiver of Bond by Heir or Beneficiary'),
('DE-147', 'Duties and Liabilities of Personal Representative'),
('DE-147(S)', 'Confidential Supplement to Duties and Liabilities of Personal Representative'),
('DE-150', 'Letters'),
('DE-154', 'Request for Special Notice'),
('DE-157', 'Notice of Administration to Creditors'),
('DE-160', 'Inventory And Appraisal'),
('DE-161', 'Inventory and Appraisal Attachment'),
('DE-165', 'Notice of Proposed Action (Objection-Consent)'),
('DE-166', 'Waiver of Notice of Proposed Action'),
('DE-172', 'Creditor\'s Claim'),
('DE-174', 'Allowance or Rejection of Creditor\'s Claim'),
('DE-200', 'Order Prescribing Notice'),
('DE-221', 'Spousal or Domestic Partner Property Petition (Probate—Decedents Estates)'),
('DE-226', 'Spousal or Domestic Partner Property Order (Probate—Decedents Estates)'),
('DE-260', 'Report of Sale and Petition for Order Confirming Sale of Real Property'),
('DE-265', 'Order Confirming Sale of Real Property'),
('DE-270', 'Ex Parte Petition for Authority to Sell Securities and Order'),
('DE-275', 'Ex Parte Petition for Approval of Sale of Personal Property and Order'),
('DE-295', 'Ex Parte Petition for Final Discharge and Order'),
('DE-305', 'Affidavit re Real Property of Small Value ($55,425 or less)'),
('DE-310', 'Petition to Determine Succession to Real Property (Estates of $166,250 or Less)'),
('DE-315', 'Order Determining Succession to Real Property (Estates of $166,250 or Less)'),
('DE-350', 'Petition for Appointment of Guardian Ad Litem—Probate'),
('DE-351', 'Order Appointing Guardian Ad Litem—Probate'),
('DISC-001', 'Form Interrogatories—General'),
('DISC-002', 'Form Interrogatories—Employment Law'),
('DISC-003', 'Form Interrogatories—Unlawful Detainer'),
('DISC-004', 'Form Interrogatories—Limited Civil Cases (Economic Litigation)'),
('DISC-005', 'Form Interrogatories—Construction Litigation'),
('DISC-010', 'Case Questionnaire—For Limited Civil Cases (Under $25,000)'),
('DISC-015', 'Request for Statement of Witnesses and Evidence—For Limited Civil Cases (Under $25,000)'),
('DISC-020', 'Request For Admission'),
('DISC-030', 'Commission to Take Deposition Outside California'),
('DV-100', 'Request for Domestic Violence Restraining Order'),
('DV-101', 'Description of Abuse'),
('DV-105', 'Request for Child Custody and Visitation Orders'),
('DV-108', 'Request for Order: No Travel with Children'),
('DV-109', 'Notice of Court Hearing'),
('DV-110', 'Temporary Restraining Order (CLETS—TRO)'),
('DV-112', 'Waiver of Hearing on Denied Request for Temporary Restraining Order'),
('DV-115', 'Request to Continue Hearing (Temporary Restraining Order) (Domestic Violence Prevention)'),
('DV-115-INFO', 'How to Ask for a New Hearing Date (Domestic Violence Prevention)'),
('DV-116', 'Order on Request to Continue Hearing (Temporary Restraining Order) (CLETS-TRO) (Domestic Violence Prevention)'),
('DV-117', 'Order Granting Alternative Service'),
('DV-120', 'Response to Request for Domestic Violence Restraining Order'),
('DV-120-INFO', 'How Can I Respond to a Request for Domestic Violence Restraining Order?'),
('DV-130', 'Restraining Order After Hearing (CLETS—OAH)'),
('DV-140', 'Child Custody and Visitation Order'),
('DV-145', 'Order: No Travel With Children'),
('DV-150', 'Supervised Visitation and Exchange Order'),
('DV-160', 'Request to Keep Minor\'s Information Confidential'),
('DV-160-INFO', 'Privacy Protection for a Minor (Person Under 18 Years Old)'),
('DV-165', 'Order on Request to Keep Minor\'s Information Confidential '),
('DV-170', 'Notice of Order Protecting Information of Minor'),
('DV-175', 'Cover Sheet for Confidential Information'),
('DV-176', 'Request for Release of Minor\'s Confidential Information'),
('DV-177', 'Notice of Request for Release of Minor\'s Confidential Information'),
('DV-178', 'Response to Request for Release of Minor\'s Confidential Information'),
('DV-179', 'Order on Request for Release of Minor\'s Confidential Information'),
('DV-180', 'Agreement and Judgment of Parentage'),
('DV-200', 'Proof of Personal Service (CLETS)'),
('DV-200-INFO', 'What Is Proof of Personal Service? (Domestic Violence Prevention)'),
('DV-205-INFO', 'What if the Person I Want Protection From is Avoiding (Evading) Service? (Domestic Violence Prevention)'),
('DV-210', 'Summons (Domestic Violence Restraining Order)'),
('DV-250', 'Proof of Service by Mail (CLETS) (Domestic Violence Prevention)'),
('DV-400', 'Findings and Order to Terminate Restraining Order After Hearing (CLETS—CANCEL)'),
('DV-400-INFO', 'How Do I Ask to Change or End a Domestic Violence Restraining Order After Hearing?'),
('DV-500-INFO', 'Can a Domestic Violence Restraining Order Help Me?'),
('DV-505-INFO', 'How Do I Ask For a Temporary Restraining Order?'),
('DV-520-INFO', 'Get Ready for the Court Hearing'),
('DV-530-INFO', 'How to Enforce Your Restraining Order'),
('DV-570', 'Which Financial Form—FL-155 or FL-150? (Domestic Violence Prevention)'),
('DV-600', 'Order to Register Out-of-State or Tribal Court Protective/Restraining Order'),
('DV-610', 'Fax Transmission Cover Sheet for Registration of Tribal Court Protective Order'),
('DV-630', 'Order to Register Canadian Domestic Violence Protective/Restraining Order'),
('DV-700', 'Request to Renew Restraining Order'),
('DV-700-INFO', 'How Do I Ask the Court to Renew My Restraining Order?'),
('DV-710', 'Notice of Hearing to Renew Restraining Order'),
('DV-720', 'Response to Request to Renew Restraining Order'),
('DV-730', 'Order to Renew Domestic Violence Restraining Order'),
('DV-800', 'Proof of Firearms Turned In, Sold, or Stored'),
('DV-800-INFO', 'How Do I Turn In, Sell, or Store My Firearms?'),
('DV-805', 'Proof of Enrollment for Batterer Intervention Program'),
('DV-815', 'Batterer Intervention Program Progress Report'),
('DV-900', 'Order Transferring Wireless Phone Account'),
('DV-901', 'Attachment to Order Transferring Wireless Phone Account'),
('EA-100', 'Request for Elder or Dependent Adult Abuse Restraining Orders'),
('EA-100-INFO', 'Can a Restraining Order to Prevent Elder or Dependent Adult Abuse Help Me?'),
('EA-109', 'Notice of Court Hearing'),
('EA-110', 'Temporary Restraining Order (CLETS—TEA or TEF)'),
('EA-115', 'Request to Continue Court Hearing (Temporary Restraining Order) (Elder or Dependent Adult Abuse Prevention)'),
('EA-115-INFO', 'How to Ask For a New Hearing Date (Elder or Dependent Adult Abuse Prevention)'),
('EA-116', 'Order on Request to Continue Court Hearing (Temporary Restraining Order) (CLETS-TEA or TEF) (Elder or Dependent Adult Abuse Prevention)'),
('EA-120', 'Response to Request for Elder or Dependent Adult Abuse Restraining Orders'),
('EA-120-INFO', 'How Can I Respond to a Request for Elder or Dependent Adult Abuse Restraining Orders?'),
('EA-130', 'Elder or Dependent Adult Abuse Restraining Order After Hearing (CLETS—EAR or EAF)'),
('EA-200', 'Proof of Personal Service'),
('EA-200-INFO', 'What Is Proof of Personal Service?'),
('EA-250', 'Proof of Service of Response by Mail'),
('EA-260', 'Proof of Service of Order After Hearing by Mail'),
('EA-600', 'Request to Modify/Terminate Elder or Dependent Adult Abuse Restraining Order'),
('EA-610', 'Notice of Hearing to Modify/Terminate Elder or Dependent Adult Abuse Restraining Order'),
('EA-620', 'Response to Request to Modify/Terminate Elder or Dependent Adult Abuse Restraining Order'),
('EA-630', 'Order on Request to Modify/Terminate Elder or Dependent Adult Abuse Restraining Order'),
('EA-700', 'Request to Renew Restraining Order'),
('EA-710', 'Notice of Hearing to Renew Restraining Order'),
('EA-720', 'Response to Request to Renew Restraining Order'),
('EA-730', 'Order Renewing Elder or Dependent Adult Abuse Restraining Order'),
('EA-800', 'Proof of Firearms Turned In, Sold, or Stored'),
('EA-800-INFO', 'How Do I Turn In, Sell, or Store My Firearms?'),
('EFS-005-CV', 'Consent to Electronic Service and Notice of Electronic Notification Address'),
('EFS-005-JV', 'E-Mail Notice of Hearing: Consent, Withdrawal of Consent, Address Change'),
('EFS-006', 'Withdrawal of Consent to Electronic Service (Electronic Filing and Service)'),
('EFS-007', 'Request for Exemption from Mandatory Electronic Filing and Service'),
('EFS-008', 'Order of Exemption from Electronic Filing and Service'),
('EFS-010', 'Notice of Change of Electronic Service Address'),
('EFS-020', 'Proposed Order (Cover Sheet)'),
('EFS-050', 'Proof of Electronic Service'),
('EFS-050(D)', 'Attachment to Proof of Electronic Service (Documents Served)'),
('EFS-050(P)', 'Attachment to Proof of Electronic Service (Persons Served)'),
('EJ-001', 'Abstract of Judgment—Civil and Small Claims'),
('EJ-100', 'Acknowledgment of Satisfaction of Judgment'),
('EJ-105', 'Application for Entry of Judgment on Sister-State Judgment'),
('EJ-110', 'Notice of Entry of Judgment on Sister-State Judgment'),
('EJ-115', 'Notice of Application for Recognition and Entry of Tribal Court Money Judgment'),
('EJ-125', 'Application and Order for Appearance and Examination'),
('EJ-130', 'Writ of Execution'),
('EJ-150', 'Notice of Levy'),
('EJ-152', 'Memorandum of Garnishee'),
('EJ-155', 'Exemptions from The Enforcement of Judgments'),
('EJ-156', 'Current Dollar Amounts of Exemptions from Enforcement of Judgments'),
('EJ-157', 'Ex Parte Application for Order on Deposit Account Exemption'),
('EJ-157-INFO', 'Instructions for Ex Parte Application for Order on Deposit Account Exemption'),
('EJ-158', 'Declaration Regarding Notice and Service for Ex Parte Application for Order on Deposit Account Exemption'),
('EJ-159', 'Order on Application for Designation of Deposit Account Exemption'),
('EJ-160', 'Claim of Exemption (Enforcement of Judgment)'),
('EJ-165', 'Financial Statement'),
('EJ-170', 'Notice of Opposition to Claim of Exemption'),
('EJ-175', 'Notice of Hearing on Claim of Exemption'),
('EJ-180', 'Notice of Hearing on Right to Homestead Exemption'),
('EJ-182', 'Notice of Rehearing on Right to Homestead Exemption'),
('EJ-185', 'Notice of Lien'),
('EJ-190', 'Application for and Renewal of Judgment'),
('EJ-195', 'Notice of Renewal of Judgment'),
('EJT-001-INFO', 'Expedited Jury Trial Information Sheet'),
('EJT-003', 'Request to Opt Out of Mandatory Expedited Jury Trial Procedures'),
('EJT-004', 'Objection to Request to Opt Out of Mandatory Expedited Jury Trial Procedures'),
('EJT-018', 'Agreement of Parties (Mandatory Expedited Jury Trial Procedures)'),
('EJT-020', '[Proposed] Consent Order for Voluntary Expedited Jury Trial'),
('EJT-022A', 'Attachment to [Proposed] Consent OrderOr Agreemetn of Parties'),
('EM-100', 'Petition for Declaration of Emancipation of Minor, Order Prescribing Notice, Declaration of Emancipation, and Order Denying Petition'),
('EM-100-INFO', 'Emancipation Pamphlet'),
('EM-109', 'Notice of Hearing—Emancipation of Minor'),
('EM-115', 'Emancipation of Minor Income and Expense Declaration'),
('EM-130', 'Declaration of Emancipation of Minor After Hearing'),
('EM-140', 'Emancipated Minor\'s Application to California Department of Motor Vehicles'),
('EPO-001', 'Emergency Protective Order (CLETS-EPO)'),
('EPO-002', 'Gun Violence Emergency Protective Order (CLETS-EGV)'),
('FL-100', 'Petition—Marriage/Domestic Partnership (Family Law)'),
('FL-105', 'Declaration Under Uniform Child Custody Jurisdiction and Enforcement Act (UCCJEA)'),
('FL-105(A)', 'Attachment to Declaration Under Uniform Child Custody Jurisdiction and Enforcement Act (UCCJEA)'),
('FL-107-INFO', 'Legal Steps for a Divorce or Legal Separation'),
('FL-110', 'Summons'),
('FL-115', 'Proof of Service of Summons (Family Law-Uniform Parentage-Custody and Support)'),
('FL-117', 'Notice and Acknowledgment of Receipt'),
('FL-120', 'Response—Marriage/Domestic Partnership (Family Law)'),
('FL-130', 'Appearance, Stipulations, and Waivers (Family Law—Uniform Parentage—Custody and Support)'),
('FL-130(A)', 'Declaration and Conditional Waiver of Rights Under the Servicemembers Civil Relief Act of 2003'),
('FL-140', 'Declaration of Disclosure'),
('FL-141', 'Declaration Regarding Service of Declaration of Disclosure and Income and Expense Declaration'),
('FL-142', 'Schedule of Assets and Debts'),
('FL-144', 'Stipulation and Waiver of Final Declaration of Disclosure'),
('FL-145', 'Form Interrogatories—Family Law'),
('FL-150', 'Income and Expense Declaration'),
('FL-155', 'Financial Statement (Simplified)'),
('FL-157', 'Spousal or Domestic Partner Support Declaration Attachment'),
('FL-158', 'Supporting Declaration for Attorney\'s Fees and Costs Attachment'),
('FL-160', 'Property Declaration'),
('FL-161', 'Continuation of Property Declaration'),
('FL-165', 'Request to Enter Default (Uniform Parentage)'),
('FL-170', 'Declaration for Default or Uncontested Dissolution or Legal Separation (Family Law)'),
('FL-172', 'Case Information—Family Law'),
('FL-174', 'Family Centered Case Resolution Order'),
('FL-180', 'Judgment'),
('FL-182', 'Judgment Checklist—Dissolution/Legal Separation'),
('FL-190', 'Notice of Entry of Judgment (Uniform Parentage—Custody and Support)'),
('FL-191', 'Child Support Case Registry Form'),
('FL-192', 'Notice of Rights and Responsibilities (Health-Care Costs and Reimbursement Procedures)'),
('FL-195', 'Income Withholding for Support'),
('FL-196', 'Income Withholding for Support—Instructions'),
('FL-200', 'Petition to Determine Parental Relationship (Uniform Parentage)'),
('FL-210', 'Summons (Uniform Parentage—Petition for Custody and Support) (incl. Spanish)'),
('FL-220', 'Response to Petition to Determine Parental Relationship (Uniform Parentage)'),
('FL-230', 'Declaration for Default or Uncontested Judgment (Uniform Parentage—Custody and Support)'),
('FL-235', 'Advisement and Waiver of Rights Re: Determination of Parental Relationship (Uniform Parentage)'),
('FL-240', 'Stipulation for Entry of Judgment Re: Determination of Parental Relationship'),
('FL-250', 'Judgment (Uniform Parentage—Custody and Support)'),
('FL-260', 'Petition for Custody and Support of Minor Children'),
('FL-270', 'Response to Petition for Custody and Support of Minor Children'),
('FL-272', 'Notice of Motion to Cancel (Set Aside) Judgment of Parentage'),
('FL-273', 'Declaration in Support of Motion to Cancel (Set Aside) Judgment of Parentage (Family Law - Governmental)'),
('FL-274', 'Information Sheet for Completing Notice of Motion to Cancel (Set Aside) Judgment of Parentage'),
('FL-276', 'Response to Notice of Motion to Cancel (Set Aside) Judgment of Parentage'),
('FL-278', 'Order After Hearing on Motion to Cancel (Set Aside) Judgment of Parentage (Family Law - Governmental)'),
('FL-280', 'Request for Hearing and Application to Cancel (Set Aside) Voluntary Declaration of Parentage or Paternity'),
('FL-281', 'Information Sheet for Completing Request for Hearing and Application to Cancel (Set Aside) Voluntary Declaration of Parentage or Paternity (Family Law - Governmental)'),
('FL-285', 'Responsive Declaration to Application to Cancel (Set Aside) Voluntary Declaration of Parentage or Paternity'),
('FL-290', 'Order After Hearing on Motion to Cancel (Set Aside) Voluntary Declaration of Parentage or Paternity (Family Law - Governmental)'),
('FL-300', 'Request for Order'),
('FL-300-INFO', 'Information Sheet for Request for Order (Family Law)'),
('FL-303', 'Declaration Regarding Notice and Service of Request for Temporary Emergency (Ex Parte) Orders'),
('FL-304-INFO', 'How to Reschedule a Hearing in Family Court'),
('FL-305', 'Temporary Emergency (Ex Parte) Orders'),
('FL-306', 'Request to Reschedule Hearing (Family Law—Governmental—Uniform Parentage—Custody and Support)'),
('FL-307', 'Request to Reschedule Hearing Involving Temporary Emergency (Ex Parte) Orders (Family Law—Governmental—Uniform Parentage—Custody and Support)'),
('FL-308', 'Agreement and Order to Reschedule Hearing (Family Law—Governmental—Uniform Parentage—Custody and Support)'),
('FL-309', 'Order on Request to Reschedule Hearing (Family Law—Governmental—Uniform Parentage—Custody and Support)'),
('FL-310', 'Responsive Declaration to Request to Reschedule Hearing (Family Law—Governmental—Uniform Parentage—Custody and Support)'),
('FL-311', 'Child Custody and Visitation (Parenting Time) Application Attachment'),
('FL-312', 'Request for Child Abduction Prevention Orders'),
('FL-313-INFO', 'Child Custody Information Sheet—Recommending Counseling'),
('FL-314-INFO', 'Child Custody Information Sheet—Child Custody Mediation'),
('FL-315', 'Request or Response to Request for Separate Trial'),
('FL-316', 'Request for Orders Regarding Noncompliance With Disclosure Requirements'),
('FL-318-INFO', 'Retirement Plan Joinder—Information Sheet'),
('FL-319', 'Request for Attorney\'s Fees and Costs Attachment'),
('FL-320', 'Responsive Declaration to Request for Order'),
('FL-320-INFO', 'Information Sheet: Responsive Declaration to Request for Order'),
('FL-321', 'Witness List'),
('FL-322', 'Declaration of Counsel for a Child Regarding Qualifications'),
('FL-323', 'Order Appointing Counsel for a Child'),
('FL-323-INFO', 'Attorney for Child in a Family Law Case—Information Sheet'),
('FL-324(NP)', 'Declaration of Supervised Visitation Provider (NonProfessional)'),
('FL-324(P)', 'Declaration of Supervised Visitation Provider (Professional)'),
('FL-325', 'Declaration of Court-connected Child Custody Evaluator Regarding Qualifications'),
('FL-326', 'Declaration of Private Child Custody Evaluator Regarding Qualifications'),
('FL-327', 'Order Appointing Child Custody Evaluator'),
('FL-327(A)', 'Additional Orders Regarding Child Custody Evaluations Under Family Code Section 3118'),
('FL-328', 'Notice Regarding Confidentiality of Child Custody Evaluation Report'),
('FL-329', 'Confidential Child Custody Evaluation Report'),
('FL-329-INFO', 'Child Custody Evaluation Information Sheet'),
('FL-330', 'Proof of Personal Service'),
('FL-330-INFO', 'Information Sheet for Proof of Personal Service'),
('FL-334', 'Declaration Regarding Address Verification—Postjudgment Request to Modify a Child Custody, Visitation, or Child Support Order'),
('FL-335', 'Proof of Service by Mail'),
('FL-335-INFO', 'Information Sheet for Proof of Service by Mail'),
('FL-336', 'Order to Pay Waived Court Fees and Costs (Superior Court)'),
('FL-337', 'Application to Set Aside Order to Pay Waived Court Fees—Attachment'),
('FL-338', 'Order After Hearing on Motion to Set Aside Order to Pay Waived Court Fees (Superior Court)'),
('FL-340', 'Findings and Order After Hearing'),
('FL-341', 'Child Custody and Visitation (Parenting Time) Order Attachment'),
('FL-341(A)', 'Supervised Visitation Order'),
('FL-341(B)', 'Child Abduction Prevention Order Attachment'),
('FL-341(C)', 'Children\'s Holiday Schedule Attachment'),
('FL-341(D)', 'Additional Provisions—Physical Custody Attachment'),
('FL-341(E)', 'Joint Legal Custody Attachment'),
('FL-342', 'Child Support Information and Order Attachment'),
('FL-342(A)', 'Non-Guideline Support Findings Attachment'),
('FL-343', 'Spousal, Domestic Partner, or Family Support Order Attachment'),
('FL-344', 'Property Order Attachment to Findings and Order After Hearing'),
('FL-345', 'Property Order Attachment to Judgment'),
('FL-346', 'Attorney\'s Fees and Costs Order Attachment'),
('FL-347', 'Bifurcation of Status of Marriage or Domestic Partnership—Attachment'),
('FL-348', 'Pension Benefits—Attachment to Judgment (Attach to form FL-180)'),
('FL-349', 'Spousal or Domestic Partner Support Factors Under Family Code Section 4320—Attachment'),
('FL-350', 'Stipulation to Establish or Modify Child Support and Order'),
('FL-355', 'Stipulation and Order for Custody and/or Visitation of Children'),
('FL-356', 'Confidential Request for Special Immigrant Juvenile Findings—Family Law'),
('FL-357', 'Special Immigrant Juvenile Findings'),
('FL-358', 'Confidential Response to Request for Special Immigrant Juvenile Findings'),
('FL-360', 'Request for Hearing and Application to Set Aside Support Order Under Family Code Section 3691'),
('FL-365', 'Responsive Declaration to Application to Set Aside Support Order'),
('FL-367', 'Order After Hearing on Motion to Set Aside Support Order'),
('FL-370', 'Pleading on Joinder—Employees Benefit Plan'),
('FL-371', 'Notice of Motion and Declaration for Joinder'),
('FL-372', 'Request for Joinder of Employee Benefit Plan Order'),
('FL-373', 'Responsive Declaration to Motion for Joinder and Consent Order of Joinder'),
('FL-374', 'Notice of Appearance and Response of Employee Benefit Plan'),
('FL-375', 'Summons (Joinder)'),
('FL-380', 'Application for Expedited Child Support Order'),
('FL-381', 'Response to Application for Expedited Child Support Order and Notice of Hearing'),
('FL-382', 'Expedited Child Support Order'),
('FL-390', 'Notice of Motion and Motion for Simplified Modification of Order for Child, Spousal, or Family Support'),
('FL-391', 'Information Sheet—Simplified Way to Change Child, Spousal, or Family Support'),
('FL-392', 'Responsive Declaration to Motion for Simplified Modification of Order for Child, Spousal, or Family Support'),
('FL-393', 'Information Sheet—How to Oppose a Request to Change Child, Spousal, or Family Support'),
('FL-395', 'Ex Parte Application for Restoration of Former Name After Entry of Judgment and Order'),
('FL-396', 'Request for Production of an Income and Expense Declaration After Judgment'),
('FL-397', 'Request for Income and Benefit Information From Employer'),
('FL-398', 'Notice of Activation of Military Service and Deployment and Request to Modify a Support Order'),
('FL-400', 'Order for Child Support Security Deposit and Evidence of Deposit'),
('FL-401', 'Application for Disbursement and Order for Disbursement From Child Support Security Deposit'),
('FL-410', 'Order to Show Cause and Affidavit for Contempt'),
('FL-411', 'Affidavit of Facts Constituting Contempt (Financial and Injunctive Orders)'),
('FL-412', 'Affidavit of Facts Constituting Contempt (Domestic Violence/Custody and Visitation)'),
('FL-415', 'Findings and Order Regarding Contempt (Domestic Violence —Uniform Parentage—Governmental)'),
('FL-420', 'Declaration of Payment History (Governmental—Uniform Parentage Act)'),
('FL-421', 'Payment History Attachment (Governmental—Uniform Parentage Act)'),
('FL-430', 'Ex Parte Application to Issue, Modify, or Terminate an Earnings Assignment Order'),
('FL-435', 'Earnings Assignment Order for Spousal or Partner Support'),
('FL-440', 'Statement for Registration of California Support Order'),
('FL-445', 'Request for Hearing Regarding Registration of California Support Order (Family Law-Governmental)'),
('FL-450', 'Request for Hearing Regarding Earnings Assignment (Governmental—UIFSA)'),
('FL-455', 'Stay of Service of Earnings Assignment and Order'),
('FL-460', 'Qualified Domestic Relations Order for Support (Earnings Assignment Order for Support)'),
('FL-461', 'Attachment to Qualified Domestic Relations Order for Support (Earnings Assignment Order for Support)'),
('FL-470', 'Application And Order For Health Insurance Coverage'),
('FL-475', 'Employer\'s Health Insurance Return'),
('FL-478', 'Request and Notice of Hearing Regarding Health Insurance Assignment'),
('FL-478-INFO', 'Information Sheet and Instructions for Request and Notice of Hearing Regarding Health Insurance Assignment'),
('FL-480', 'Abstract of Support Judgment'),
('FL-485', 'Notice of Delinquency'),
('FL-490', 'Application to Determine Arrears'),
('FL-510', 'Summons (UIFSA)'),
('FL-520', 'Response to Uniform Support Petition (UIFSA)'),
('FL-530', 'Judgment Regarding Parental Obligations (UIFSA)'),
('FL-560', 'Ex Parte Application for Transfer and Order (UIFSA)'),
('FL-570', 'Notice of Registration of Out-of-State Support Order'),
('FL-575', 'Request for Hearing Regarding Registration of Out-Of-State Support Order'),
('FL-580', 'Registration of Out-of-State Custody Order'),
('FL-585', 'Request for Hearing Regarding Registration of Out-of-State Custody Decree'),
('FL-590A', 'UIFSA Child Support Order Jurisdictional Attachment'),
('FL-592', 'Notice of Registration of an International Hague Convention Support Order'),
('FL-594', 'Request for Heaing Regarding Registration of an International Hague Convention Support Order'),
('FL-600', 'Summons and Complaint or Supplemental Complaint Regarding Parental Obligations (Governmental)'),
('FL-605', 'Notice and Acknowledgment of Receipt'),
('FL-610', 'Answer to Complaint or Supplemental Complaint Regarding Parental Obligations (Governmental)'),
('FL-611', 'Information Sheet for Service of Process'),
('FL-615', 'Stipulation for Judgment or Supplemental Judgment Regarding Parental Obligations and Judgment (Governmental)'),
('FL-616', 'Declaration for Amended Proposed Judgment (Governmental)'),
('FL-618', 'Request for Dismissal (Governmental, UIFSA)'),
('FL-620', 'Request to Enter Default Judgment (Governmental)'),
('FL-625', 'Stipulation and Order (Governmental)'),
('FL-626', 'Stipulation and Order Waiving Unassigned Arrears (Governmental)'),
('FL-627', 'Order for Genetic (Parentage) Testing'),
('FL-630', 'Judgment Regarding Parental Obligations (Governmental)'),
('FL-632', 'Notice Regarding Payment of Support (Governmental)'),
('FL-634', 'Notice of Change of Responsibility for Managing Child Support Case (Governmental)'),
('FL-635', 'Notice of Entry of Judgment and Proof of Service by Mail (Governmental)'),
('FL-640', 'Notice and Motion to Cancel (Set Aside) Support Order Based on Presumed Income'),
('FL-640-INFO', 'Information Sheet for Notice and Motion to Cancel (Set Aside) Support Order Based on Presumed Income'),
('FL-643', 'Declaration of Obligor\'s Income During Judgment Period—Presumed Income Set-Aside Request'),
('FL-645', 'Notice to Local Child Support Agency of Intent to Take Independent Action to Enforce Support Order (Governmental)'),
('FL-646', 'Response of Local Child Support Agency to Notice of Intent to Take Independent Action to Enforce Support Order (Governmental)'),
('FL-650', 'Statement for Registration of California Support Order (Governmental)'),
('FL-651', 'Notice of Registration of California Support Order (Governmental)'),
('FL-660', 'Ex Parte Motion by Local Child Support Agency and Declaration for Joinder of Other Parent (Governmental)'),
('FL-661', 'Notice of Motion and Declaration for Joinder of Other Parent in Governmental Action'),
('FL-661-INFO', 'Information Sheet for Notice of Motion and Declaration for Joinder of Other Parent in Governmental Action'),
('FL-662', 'Responsive Declaration to Motion for Joinder of Other Parent—Consent Order of Joinder'),
('FL-662-INFO', 'Information Sheet for Responsive Declaration to Motion for Joinder of Other Parent—Consent Order of Joinder'),
('FL-663', 'Stipulation and Order for Joinder of Other Parent (Governmental)'),
('FL-665', 'Findings and Recommendation of Commissioner (Governmental)'),
('FL-666', 'Notice of Objection (Governmental)'),
('FL-667', 'Review of Commissioner\'s Findings of Fact and Recommendation (Governmental)'),
('FL-670', 'Notice of Motion for Judicial Review of License Denial (Governmental)'),
('FL-675', 'Order After Judicial Review of License Denial (Governmental)'),
('FL-676', 'Request for Determination of Support Arrears (Governmental)'),
('FL-676-INFO', 'Information Sheet: Request for Determination of Support Arrears (Governmental)'),
('FL-677', 'Notice of Opposition and Notice of Motion on Claim of Exemption'),
('FL-678', 'Order Determining Claim of Exemption or Third-Party Claim (Governmental)'),
('FL-679', 'Request for Telephone Appearance (Governmental)'),
('FL-679-INFO', 'Information Sheet—Request for Telephone Appearance (Governmental)'),
('FL-680', 'Notice of Motion'),
('FL-681', 'Clerk Calendar Cover Sheet (For Court Clerk Use Only)'),
('FL-683', 'Order to Show Cause (Governmental)'),
('FL-684', 'Request for Order and Supporting Declaration (Governmental)'),
('FL-685', 'Response to Governmental Notice of Motion or Order to Show Cause'),
('FL-686', 'Proof of Service by Mail (Governmental)'),
('FL-687', 'Order After Hearing (Governmental)'),
('FL-688', 'Short Form Order After Hearing (Governmental)'),
('FL-692', 'Minutes and Order or Judgment (Governmental)'),
('FL-693', 'Guideline Findings Attachment (Governmental)'),
('FL-694', 'Advisement and Waiver of Rights for Stipulation (Governmental)'),
('FL-697', 'Declaration for Default or Uncontested Judgment (Governmental)'),
('FL-800', 'Joint Petition for Summary Dissolution'),
('FL-810', 'Summary Dissolution Information'),
('FL-820', 'Request for Judgment, Judgment of Dissolution of Marriage, and Notice of Entry of Judgment'),
('FL-825', 'Judgment of Dissolution and Notice of Entry of Judgment'),
('FL-830', 'Notice of Revocation of Joint Petition for Summary Dissolution'),
('FL-910', 'Request of Minor to Marry or Establish a Domestic Partnership'),
('FL-912', 'Consent for Minor to Marry or Establish a Domestic Partnerhip'),
('FL-915', 'Order and Notices to Minor on Request to Marry or Establish a Domestic Partnership'),
('FL-920', 'Notice of Consolidation'),
('FL-935', 'Application and Order for Appointment of Guardian Ad Litem of Minor—Family Law'),
('FL-940', 'Office of the Family Law Facilitator Disclosure'),
('FL-945', 'Family Law Information Center Disclosure'),
('FL-950', 'Notice of Limited Scope Representation'),
('FL-955', 'Notice of Completion of Limited Scope Representation'),
('FL-955-INFO', 'Information for Client About Notice of Completion of Limited Scope Representation'),
('FL-956', 'Objection to Application to Be Relieved as Counsel Upon Completion of Limited Scope Representation'),
('FL-957', 'Response to Objection to Proposed Notice of Completion of Limited Scope Representation'),
('FL-958', 'Order on Completion of Limited Scope Representation'),
('FL-960', 'Notice of Withdrawal of Attorney of Record'),
('FL-970', 'Request and Declaration for Final Judgment of Dissolution of Marriage'),
('FL-980', 'Application for Order for Publication or Posting'),
('FL-982', 'Order for Publication or Posting'),
('FL-985', 'Proof of Service by Posting'),
('FW-001', 'Request to Waive Court Fees'),
('FW-001-GC', 'Request to Waive Court Fees (Ward or Conservatee)'),
('FW-001-INFO', 'Information Sheet on Waiver of Superior Court Fees and Costs'),
('FW-002', 'Request to Waive Additional Court Fees (Superior Court)'),
('FW-002-GC', 'Request to Waive Additional Court Fees (Superior Court) (Ward or Conservatee)'),
('FW-003', 'Order on Court Fee Waiver (Superior Court)'),
('FW-003-GC', 'Order on Court Fee Waiver (Superior Court) (Ward or Conservatee)'),
('FW-005', 'Notice: Waiver of Court Fees (Superior Court)'),
('FW-005-GC', 'Notice: Waiver of Court Fees (Superior Court) (Ward or Conservatee)'),
('FW-006', 'Request for Hearing About Court Fee Waiver Order (Superior Court)'),
('FW-006-GC', 'Request for Hearing About Court Fee Waiver Order (Superior Court) (Ward or Conservatee)'),
('FW-007', 'Notice on Hearing About Court Fees'),
('FW-007-GC', 'Notice on Hearing About Court Fees (Ward or Conservatee)'),
('FW-008', 'Order on Court Fee Waiver After Hearing (Superior Court)'),
('FW-008-GC', 'Order on Court Fee Waiver After Hearing (Superior Court) (Ward or Conservatee)'),
('FW-010', 'Notice to Court of Improved Financial Situation or Settlement'),
('FW-010-GC', 'Notice to Court of Improved Financial Situation or Settlement (Ward or Conservatee'),
('FW-011', 'Notice to Appear for Reconsideration of Fee Waiver'),
('FW-011-GC', 'Notice to Appear for Reconsideration of Fee Waiver (Ward or Conservatee)'),
('FW-012', 'Order on Court Fee Waiver After Reconsideration Hearing (Superior Court)'),
('FW-012-GC', 'Order on Court Fee Waiver After Reconsideration Hearing (Superior Court) (Ward or Conservatee)'),
('FW-015-INFO', 'Information Sheet on Waiver of Appellate Court Fees (Supreme Court, Court of Appeal, Appellate Division)'),
('FW-016', 'Order on Court Fee Waiver (Court of Appeal or Supreme Court)');
INSERT INTO `File_Forms` (`Form`, `Description`) VALUES
('FW-016-GC', 'Order on Court Fee Waiver (Court of Appeal or Supreme Court) (Ward or Conservatee)'),
('FW-020', 'Request for Court Reporter by Party with Fee Waiver'),
('GC-005', 'Application for Appointment of Counsel'),
('GC-006', 'Order Appointing Legal Counsel'),
('GC-010', 'Certification of Attorney Qualifications'),
('GC-015', 'Notice of Hearing on Petition to Determine Claim to Property'),
('GC-020', 'Notice of Hearing—Guardianship or Conservatorship'),
('GC-020(C)', 'Clerk\'s Certificate of Posting Notice of Hearing—Guardianship or Conservatorship'),
('GC-020(MA)', 'Attachment to Notice of Hearing Proof of Service by Mail'),
('GC-020(P)', 'Proof of Personal Service of Notice of Hearing—Guardianship or Conservatorship'),
('GC-020(PA)', 'Attachment to Notice of Hearing Proof of Personal Service'),
('GC-021', 'Order Dispensing with Notice'),
('GC-022', 'Order Prescribing Notice'),
('GC-035', 'Request for Special Notice'),
('GC-040', 'Inventory and Appraisal'),
('GC-041', 'Inventory and Appraisal Attachment'),
('GC-042', 'Notice of Filing of Inventory and Appraisal and How to Object to the Inventory or the Appraised Value of Property'),
('GC-042(MA)', 'Attachment to Notice of Filing of Inventory and Appraisal and How to Object to the Inventory or the Appraised Value of Property'),
('GC-045', 'Objections to Inventory and Appraisal of Conservator or Guardian'),
('GC-050', 'Notice of Taking Possession or Control of An Asset of Minor or Conservatee'),
('GC-051', 'Notice of Opening or Changing a Guardianship or Conservatorship Account or Safe Deposit Box'),
('GC-060', 'Report of Sale and Petition for Order Confirming Sale of Real Property'),
('GC-065', 'Order Confirming Sale of Real Property'),
('GC-070', 'Ex Parte Petition for Authority to Sell Securities and Order'),
('GC-075', 'Ex Parte Petition for Approval of Sale of Personal Property and Order'),
('GC-079', 'Pre-Move Notice of Proposed Change of Personal Residence of Conservatee or Ward'),
('GC-079(MA)', 'Attachment to Pre-Move Notice of Proposed Change of Personal Residence of Conservatee or Ward'),
('GC-080', 'Change of Residence Notice'),
('GC-080(MA)', 'Attachment to Post-Move Notice of Change of Residence of Conservatee or Ward'),
('GC-085', 'Petition to Fix Residence Outside the State of California'),
('GC-090', 'Order Fixing Residence Outside the State of California'),
('GC-100', 'Petition for Appointment of Guardian Ad Litem—Probate'),
('GC-101', 'Order Appointing Guardian Ad Litem—Probate'),
('GC-110', 'Petition for Appointment of Temporary Guardian'),
('GC-110(P)', 'Petition for Appointment of Temporary Guardian of the Person'),
('GC-111', 'Petition For Appointment of Temporary Conservator'),
('GC-112', 'Ex Parte Application for Good Cause Exception to Notice of Hearing on Petition for Appointment of Temporary Conservator'),
('GC-112(A-1)', 'Declaration in Support of Ex Parte Application for Good Cause Exception to Notice of Hearing on Petition for Appointment of Temporary Conservator'),
('GC-112(A-2)', 'Declaration Continuation Page'),
('GC-115', 'Order on Ex Parte Application for Good Cause Exception to Notice of Hearing on Petition for Appointment of Temporary Conservator'),
('GC-120', 'Declaration Under Uniform Child Custody Jurisdiction and Enforcement Act (UCCJEA)'),
('GC-120(A)', 'Attachment to Declaration Under Uniform Child Custody Jurisdiction and Enforcement Act (UCCJEA)'),
('GC-140', 'Order Appointing Temporary Guardian'),
('GC-141', 'Order Appointing Temporary Conservator'),
('GC-150', 'Letters of Temporary Guardianship or Conservatorship'),
('GC-205', 'Guardianship Pamphlet'),
('GC-210', 'Petition for Appointment of Guardian of Minor'),
('GC-210(A-PF)', 'Professional Fiduciary Attachment to Petition for Appointment of Guardian or Conservator'),
('GC-210(CA)', 'Guardianship Petition-Child Information Attachment'),
('GC-210(P)', 'Petition for Appointment of Guardian of the Person'),
('GC-210(PE)', 'Petition to Extend Guardianship of the Person'),
('GC-211', 'Consent of Proposed Guardian, Nomination of Guardian, and Consent to Appointment of Guardian and Waiver of Notice'),
('GC-212', 'Confidential Guardian Screening Form'),
('GC-220', 'Petition for Special Immigrant Juvenile Findings'),
('GC-224', 'Special Immigrant Juvenile Findings'),
('GC-240', 'Order Appointing Guardian or Extending Guardianship of the Person'),
('GC-248', 'Duties of Guardian (Probate)'),
('GC-250', 'Letters of Guardianship'),
('GC-251', 'Confidential Guardianship Status Report'),
('GC-255', 'Petition for Termination of Guardianship'),
('GC-260', 'Order Terminating Guardianship'),
('GC-310', 'Petition for Appointment of Probate Conservator'),
('GC-310(A-PF)', 'Professional Fiduciary Attachment to Petition for Appointment of Guardian or Conservator'),
('GC-312', 'Confidential Supplemental Information'),
('GC-313', 'Attachment Requesting Special Orders Regarding Dementia'),
('GC-314', 'Confidential Conservator Screening Form'),
('GC-320', 'Citation for Conservatorship'),
('GC-322', 'Citation—Probate'),
('GC-330', 'Order Appointing Court Investigator'),
('GC-331', 'Order Appointing Court Investigator (Review and Successor Conservator Investigations)'),
('GC-332', 'Order Setting Biennial Review Investigation and Directing Status Report Before Review'),
('GC-333', 'Ex Parte Application for Order Authorizing Completion of Capacity Declaration—HIPAA'),
('GC-334', 'Ex Parte Order Re Completion of Capacity Declaration—HIPAA'),
('GC-335', 'Capacity Declaration—Conservatorship'),
('GC-335A', 'Dementia Attachment to Capacity Declaration—Conservatorship'),
('GC-336', 'Ex Parte Order Authorizing Disclosure of (Proposed) Conservatee\'s Health Information to Court Investigator-HIPAA (Health Insurance Portability and Accountability Act of 1996)'),
('GC-340', 'Order Appointing Probate Conservator'),
('GC-341', 'Notice of Conservatee\'s Rights'),
('GC-341(MA)', 'Attachment to Notice of Conservatee\'s Rights'),
('GC-348', 'Duties of Conservator and Acknowledgment of Receipt of Handbook for Conservators'),
('GC-350', 'Letters of Conservatorship'),
('GC-355', 'Determination of Conservatee\'s Appropriate Level of Care'),
('GC-360', 'Conservatorship Registration Cover Sheet and Attestation of Conservatee\'s Non-Residence in California'),
('GC-361', 'Notice of Intent to Register Conservatorship'),
('GC-362', 'Conservatorship Registrant\'s Acknowledgment of Receipt of Handbook for Conservators'),
('GC-363', 'Petition for Transfer Orders (California Conservatorship Jurisdiction Act)'),
('GC-364', 'Provisional Order for Transfer (California Conservatorship Jurisdiction Act)'),
('GC-365', 'Final Order Confirming Transfer (California Conservatorship Jurisdiction Act)'),
('GC-366', 'Petition for Orders Accepting Transfer (California Conservatorship Jurisdiction Act)'),
('GC-367', 'Provisional Order Accepting Transfer (California Conservatorship Jurisdiction Act)'),
('GC-368', 'Final Order Accepting Transfer (California Conservatorship Jurisdiction Act)'),
('GC-380', 'Petition for Exclusive Authority to Give Consent for Medical Treatment'),
('GC-385', 'Order Authorizing Conservator to Give Consent for Medical Treatment'),
('GC-395', 'Ex Parte Petition for Final Discharge and Order'),
('GC-399', 'Notice of Conservatee\'s Death'),
('GC-400(A)(1)', 'Schedule A, Receipts, Dividends—Standard Account'),
('GC-400(A)(2)', 'Schedule A, Receipts, Interest—Standard Account'),
('GC-400(A)(3)', 'Schedule A, Receipts, Pensions, Annuities, and Other Regular Periodic Payments—Standard Account'),
('GC-400(A)(4)', 'Schedule A, Receipts, Rent—Standard Account'),
('GC-400(A)(5)', 'Schedule A, Receipts, Social Security, Veterans\' Benefits, Other Public Benefits—Standard Account'),
('GC-400(A)(6)', 'Schedule A, Receipts, Other Receipts—Standard Account'),
('GC-400(A)(C)', 'Schedule A and C, Receipts and Disbursements Worksheet—Standard Account'),
('GC-400(AP)', 'Additional Property Received During Period of Account—Standard and Simplified Accounts'),
('GC-400(B)', 'Schedule B, Gains on Sales—Standard and Simplified Accounts'),
('GC-400(C)(1)', 'Schedule C, Disbursements, Conservatee\'s Caregiver Expenses—Standard Account'),
('GC-400(C)(10)', 'Schedule C, Disbursements, Rental Property Expenses—Standard Account'),
('GC-400(C)(11)', 'Schedule C, Disbursements, Other Expenses—Standard Account'),
('GC-400(C)(2)', 'Schedule C, Disbursements, Conservatee\'s Residential or Long-Term Care Facility Living Expenses—Standard Account'),
('GC-400(C)(3)', 'Schedule C, Disbursements, Ward\'s Education Expenses—Standard Account'),
('GC-400(C)(4)', 'Schedule C, Disbursements, Fiduciary and Attorney Fees—Standard Account'),
('GC-400(C)(5)', 'Schedule C, Disbursements, General Administration Expenses—Standard Account'),
('GC-400(C)(6)', 'Schedule C, Disbursements, Investment Expenses—Standard Account'),
('GC-400(C)(7)', 'Schedule C, Disbursements, Living Expenses—Standard Account'),
('GC-400(C)(8)', 'Schedule C, Disbursements, Medical Expenses—Standard Account'),
('GC-400(C)(9)', 'Schedule C, Disbursements, Property Sale Expenses—Standard Account'),
('GC-400(D)', 'Schedule D, Losses on Sales—Standard and Simplified Accounts'),
('GC-400(DIST)', 'Distributions to Conservatee or Ward—Standard and Simplified Accounts'),
('GC-400(E)(1)', 'Cash Assets on Hand at End of Account Period—Standard and Simplified Accounts'),
('GC-400(E)(2)', 'Non-Cash Assets on Hand at End of Account Period—Standard and Simplified Accounts'),
('GC-400(F)', 'Schedule F, Changes in Form of Assets—Standard and Simplified Accounts'),
('GC-400(G)', 'Schedule G, Liabilities at End of Account Period—Standard and Simplified Accounts'),
('GC-400(NI)', 'Net Income From a Trade or Business—Standard Account'),
('GC-400(NL)', 'Net Loss From a Trade or Business—Standard Account'),
('GC-400(OCH)', 'Other Charges—Standard and Simplified Accounts'),
('GC-400(OCR)', 'Other Credits—Standard and Simplified Accounts'),
('GC-400(PH)(1)', 'Cash Assets on Hand at Beginning of Account Period—Standard and Simplified Accounts'),
('GC-400(PH)(2)', 'Non-Cash Assets on Hand at Beginning of Account Period—Standard and Simplified Accounts'),
('GC-400(SUM)', 'Summary of Account—Standard and Simplified Accounts'),
('GC-405(A)', 'Schedule A, Receipts—Simplified Account'),
('GC-405(AP)', 'Additional Property Received During Period of Account—Standard and Simplified Accounts'),
('GC-405(B)', 'Schedule B, Gains on Sales—Standard and Simplified Accounts'),
('GC-405(C)', 'Schedule C, Disbursements—Simplified Account'),
('GC-405(D)', 'Schedule D, Losses on Sales—Standard and Simplified Accounts'),
('GC-405(DIST)', 'Distributions to Conservatee or Ward—Standard and Simplified Accounts'),
('GC-405(E)(1)', 'Cash Assets on Hand at End of Account Period—Standard and Simplified Accounts'),
('GC-405(E)(2)', 'Non-Cash Assets on Hand at End of Account Period —Standard and Simplified Accounts'),
('GC-405(F)', 'Schedule F, Changes in Form of Assets—Standard and Simplified Accounts'),
('GC-405(G)', 'Schedule G, Liabilities at End of Account Period—Standard and Simplified Accounts'),
('GC-405(OCH)', 'Other Charges—Standard and Simplified Accounts'),
('GC-405(OCR)', 'Other Credits—Standard and Simplified Accounts'),
('GC-405(PH)(1)', 'Cash Assets on Hand at Beginning of Account Period—Standard and Simplified Accounts'),
('GC-405(PH)(2)', 'Non-Cash Assets on Hand at Beginning of Account Period—Standard and Simplified Accounts'),
('GC-405(SUM)', 'Summary of Account—Standard and Simplified Accounts'),
('GC-410', 'Request and Order for Waiver of Accounting'),
('GC-505', 'Forms You Need to Ask the Court to Appoint a Guardian of the Person'),
('GC-510', 'What Is Proof of Service in a Guardianship?'),
('GDC-001', 'Advisory Notice to Defendant'),
('GV-009', 'Notice of Court Hearing'),
('GV-020', 'Response to Gun Violence Emergency Protective Order'),
('GV-020-INFO', 'How Can I Respond to a Gun Violence Emergency Protective Order? '),
('GV-025', 'Proof of Service by Mail (Gun Violence Prevention)'),
('GV-030', 'Gun Violence Restraining Order After Hearing on EPO-002 (CLETS-HGV) '),
('GV-100', 'Petition for Gun Violence Restraining Order'),
('GV-100-INFO', 'Can a Gun Violence Restraining Order Help Me?'),
('GV-109', 'Notice of Court Hearing'),
('GV-110', 'Temporary Gun Violence Restraining Order (CLETS-TGV)'),
('GV-115', 'Request to Continue Court Hearing for Gun Violence Restraining Order (EPO-002 or Temporary Restraining Order) (Gun Violence Prevention)'),
('GV-116', 'Order on Request to Continue Hearing (EPO-002 or Temporary Restraining Order) (CLETS-EGV or CLETS-TGV) (Gun Violence Prevention)'),
('GV-120', 'Response to Petition for Gun Violence Restraining Order'),
('GV-120-INFO', 'How Can I Respond to a Petition for a Gun Violence Restraining Order?'),
('GV-125', 'Consent to Gun Violence Restraining Order and Surrender of Firearms'),
('GV-130', 'Gun Violence Restraining Order After Hearing or Consent to Gun Violence Restraining Order (CLETS-OGV)'),
('GV-200', 'Proof of Personal Service'),
('GV-200-INFO', 'What Is \"Proof of Personal Service\"?'),
('GV-250', 'Proof of Service by Mail'),
('GV-600', 'Request to Terminate Gun Violence Restraining Order'),
('GV-610', 'Notice of Hearing on Request to Terminate Gun Violence Restraining Order'),
('GV-620', 'Response to Request to Terminate Gun Violence Restraining Order'),
('GV-630', 'Order on Request to Terminate Gun Violence Restraining Order'),
('GV-700', 'Request to Renew Gun Violence Restraining Order'),
('GV-710', 'Notice of Hearing on Request to Renew Gun Violence Restraining Order'),
('GV-720', 'Response to Request to Renew Gun Violence Restraining Order'),
('GV-730', 'Order on Request to Renew Gun Violence Restraining Order'),
('GV-800', 'Proof of Firearms, Ammunition, and Magazines Turned In, Sold, or Stored'),
('GV-800-INFO', 'How Do I Turn In, Sell, or Store My Firearms, Ammunition, and Magazines?'),
('HC-001', 'Petition for Writ of Habeas Corpus'),
('HC-002', 'Petition for Writ of Habeas Corpus—LPS Act (Mental Health)'),
('HC-003', 'Petition for Writ Of Habeas Corpus—Penal Commitment (Mental Health)'),
('HC-004', 'Notice and Request for Ruling'),
('HC-100', 'Declaration of Counsel Re Minimum Qualifications for Appointment in Death Penalty-Related Habeas Corpus Proceedings'),
('HC-101', 'Order Appointing Counsel in Death Penalty-Related Habeas Corpus Proceedings'),
('HC-200', 'Petitioner\'s Notice of Appeal-Death Penalty-Related Habeas Corpus Decision'),
('ICWA-005-INFO', 'Information Sheet on Indian Child Inquiry Attachments and Notice of Child Custody Proceeding for Indian Child'),
('ICWA-010(A)', 'Indian Child Inquiry Attachment'),
('ICWA-020', 'Parental Notification of Indian Status'),
('ICWA-030', 'Notice of Child Custody Proceeding for Indian Child (Indian Child Welfare Act)'),
('ICWA-030(A)', 'Attachment to Notice of Child Custody Proceeding for Indian Child'),
('ICWA-040', 'Notice of Designation of Tribal Representative in a Court Proceeding Involving an Indian Child'),
('ICWA-050', 'Notice of Petition and Petition to Transfer Case Involving an Indian Child to Tribal Jurisdiction'),
('ICWA-060', 'Order on Petition to Transfer Case Involving an Indian Child to Tribal Jurisdiction'),
('ICWA-070', 'Request for Ex Parte Hearing to Return Physical Custody of an Indian Child'),
('ICWA-080', 'Order on Request for Ex Parte Hearing to Return Physical Custody of an Indian Child'),
('ICWA-090', 'Order After Hearing on Ex Parte Request to Return Physical Custody of an Indian Child'),
('ICWA-100', 'Tribal Information Form'),
('ICWA-100-INFO', 'Instructions Sheet for Tribal Information Form'),
('ICWA-101', 'Agreement of Parent or Indian Custodian to Temporary Custody of Indian Child'),
('INT-001', 'Semiannual Report to the Judicial Council on the Use of Noncertified or Nonregistered Interpreters'),
('INT-002(A)', 'Semiannual Report to the Judicial Council on the Use of Nonregistered Interpreters (Attachment to INT-001)'),
('INT-100-INFO', 'Procedures to Appoint a Noncertified or Nonregistered Spoken Language Interpreter as Either Provisionally Qualified or Temporary'),
('INT-110', 'Qualifications of a Noncertified or Nonregistered Spoken Language Interpreter'),
('INT-120', 'Certification of Unavailability of Certified or Registered Interpreter'),
('INT-140', 'Temporary Use of a Noncertified or Nonregistered Spoken Language Interpreter'),
('INT-200', 'Foreign Language Interpreter\'s Duties—Civil And Small Claims (For Noncertified And Nonregistered Interpreters)'),
('INT-300', 'Request for Interpreter (Civil)'),
('JUD-100', 'Judgment'),
('JURY-001', 'Juror Questionnaire for Civil Cases'),
('JURY-002', 'Juror Questionnaire for Criminal Cases/Capital Case Supplement'),
('JURY-003', 'Juror Questionnaire for Expedited Jury Trials'),
('JURY-010', 'Juror\'s Motion to Set Aside Sanctions and Order'),
('JV-050-INFO', 'What happens if your child is taken from your home?'),
('JV-060-INFO', 'Juvenile Justice Court—Information for Parents'),
('JV-100', 'Juvenile Dependency Petition (Version One)'),
('JV-101(A)', 'Additional Children Attachment—Juvenile Dependency Petition'),
('JV-110', 'Juvenile Dependency Petition (Version Two)'),
('JV-120', 'Serious Physical Harm (§ 300 (a))'),
('JV-121', 'Failure To Protect (§ 300 (b))'),
('JV-122', 'Serious Emotional Damage (§ 300 (c))'),
('JV-123', 'Sexual Abuse (§ 300 (d))'),
('JV-124', 'Severe Physical Abuse (§ 300 (e))'),
('JV-125', 'Caused Another Child\'s Death Through Abuse or Neglect (§ 300 (f))'),
('JV-126', 'No Provision for Support (§ 300 (g))'),
('JV-127', 'Freed for Adoption (§ 300 (h))'),
('JV-128', 'Cruelty (§ 300 (i))'),
('JV-129', 'Abuse of Sibling (§ 300 (i))'),
('JV-130-INFO', 'Paying for Lawyers in Dependency Court—Information for Parents and Guardians'),
('JV-131', 'Order to Appear for Financial Evaluation'),
('JV-132', 'Financial Declaration—Juvenile Dependency'),
('JV-133', 'Recommendation Regarding Ability to Repay Cost of Legal Services'),
('JV-134', 'Response to Recommendation Regarding Ability to Repay Cost of Legal Services'),
('JV-135', 'Order for Repayment of Cost of Legal Services'),
('JV-136', 'Juvenile Dependency—Cost of Appointed Counsel: Repayment Recommendation/Response/Order'),
('JV-140', 'Notification of Mailing Address'),
('JV-141', 'E-Mail Notice of Hearing: Consent, Withdrawal of Consent, Address Change'),
('JV-150', 'Supplemental Petition for More Restrictive Placement (Attachment) (Welf. & Inst. Code, § 387)'),
('JV-180', 'Request to Change Court Order'),
('JV-182', 'Confidential Information (Request to Change Court Order)'),
('JV-183', 'Court Order on Form JV-180, Request to Change Court Order'),
('JV-184', 'Order After Hearing on Form JV-180, Request to Change Court Order'),
('JV-185', 'Child\'s Information Sheet—Request to Change Court Order (Welf. & Inst. Code, §§ 353.1, 388)'),
('JV-190', 'Waiver of Rights—Juvenile Dependency'),
('JV-195', 'Waiver of Reunification Services'),
('JV-200', 'Custody Order—Juvenile—Final Judgment'),
('JV-205', 'Visitation Order—Juvenile'),
('JV-206', 'Reasons for No or Supervised Visitation—Juvenile'),
('JV-210', 'Application to Commence Proceedings by Affidavit and Decision by Social Worker (Welf. & Inst. Code, § 329)'),
('JV-212', 'Application to Review Decision by Social Worker Not to Commence Proceedings'),
('JV-214', 'Request for Hearing on Waiver of Presumptive Transfer'),
('JV-214(A)', 'Notice of and Order on Request for Hearing on Waiver of Presumptive Transfer'),
('JV-214-INFO', 'Instructions for Requesting a Hearing to Review Waiver of Presumptive Transfer of Specialty Mental Health Services'),
('JV-215', 'Order After Hearing on Waiver of Presumptive Transfer'),
('JV-216', 'Order Delegating Judicial Authority Over Psychotropic Medication'),
('JV-217-INFO', 'Guide to Psychotropic Medication Forms'),
('JV-218', 'Child\'s Opinion About the Medicine'),
('JV-219', 'Statement About Medicine Prescribed'),
('JV-220', 'Application For Psychotropic Medication'),
('JV-220(A)', 'Physician\'s Statement—Attachment'),
('JV-220(B)', 'Physician\'s Request to Continue Medication—Attachment'),
('JV-221', 'Proof of Notice of Application'),
('JV-222', 'Input on Application for Psychotropic Medication'),
('JV-223', 'Order on Application for Psychotropic Medication'),
('JV-224', 'County Report on Psychotropic Medication'),
('JV-225', 'Your Child\'s Health and Education'),
('JV-226', 'Authorization to Release Health and Mental Health Information'),
('JV-227', 'Consent to Release Education Information'),
('JV-228', 'Position on Release of Information to Medical Board of California'),
('JV-228-INFO', 'Background on Release of Information to Medical Board of California'),
('JV-229', 'Withdrawal of Release of Information to Medical Board of California'),
('JV-245', 'Request for Restraining Order—Juvenile'),
('JV-247', 'Answer to Request for Restraining Order—Juvenile'),
('JV-250', 'Notice of Hearing and Temporary Restraining Order—Juvenile'),
('JV-251', 'Request and Order to Continue Hearing'),
('JV-252', 'Proof of Firearms Turned In, Sold, or Stored'),
('JV-252-INFO', 'How Do I Turn In, Sell, or Store My Firearms?'),
('JV-255', 'Restraining Order—Juvenile (CLETS—JUV)'),
('JV-257', 'Change to Restraining Order After Hearing'),
('JV-280', 'Notice of Review Hearing'),
('JV-281', 'Notice of Hearing—Nonminor'),
('JV-282', 'Proof of service—Nonminor'),
('JV-285', 'Relative Information'),
('JV-287', 'Confidential Information'),
('JV-290', 'Caregiver Information Form'),
('JV-290-INFO', 'Instructions to Complete the Caregiver Information Form'),
('JV-291-INFO', 'Information on Requesting Access to Records for Persons With a Limited Right to Appeal'),
('JV-295', 'De Facto Parent Request'),
('JV-296', 'De Facto Parent Statement'),
('JV-297', 'De Facto Parent Order'),
('JV-298', 'Order Ending De Facto Parent Status'),
('JV-299', 'De Facto Parent Pamphlet'),
('JV-300', 'Notice of Hearing on Selection of a Permanent Plan'),
('JV-305', 'Citation for Publication Under Welfare and Institutions Code Section 294'),
('JV-310', 'Proof of Service Under Section 366.26 of the Welfare And Institutions Code'),
('JV-320', 'Orders under Welfare and Institutions Code Sections 366.24, 366.26, 727.3, 727.31'),
('JV-321', 'Request for Prospective Adoptive Parent Designation'),
('JV-322', 'Confidential Information—Prospective Adoptive Parent'),
('JV-323', 'Notice of Intent to Remove Child'),
('JV-324', 'Notice of Emergency Removal'),
('JV-325', 'Objection to Removal'),
('JV-326', 'Proof of Notice'),
('JV-326-INFO', 'Instructions for Notice of Prospective Adoptive Parent Hearing'),
('JV-327', 'Prospective Adoptive Parent Designation Order'),
('JV-328', 'Prospective Adoptive Parent Order After Hearing'),
('JV-330', 'Letters of Guardianship (Juvenile)'),
('JV-350-INFO', 'Becoming a Child\'s Guardian in Juvenile Court'),
('JV-356', 'Request for Special Immigrant Juvenile Findings'),
('JV-357', 'Special Immigrant Juvenile Findings'),
('JV-361', 'First Review Hearing After Youth Turns 16 Years of Age—Information, Documents, and Services'),
('JV-362', 'Review Hearing for Youth Approaching 18 Years of Age—Information, Documents, and Services'),
('JV-363', 'Review Hearing for Youth 18 Years of Age or Older—Information, Documents, and Services'),
('JV-364', 'Termination of Dependency for Adoption (Juvenile)'),
('JV-365', 'Termination of Juvenile Court Jurisdiction—Nonminor'),
('JV-367', 'Findings and Orders After Hearing to Consider Termination of Juvenile Court Jurisdiction Over a Nonminor'),
('JV-400', 'Visitation Attachment: Parent, Legal Guardian, Indian Custodian, Other Important Person'),
('JV-401', 'Visitation Attachment: Sibling'),
('JV-402', 'Visitation Attachment: Grandparent'),
('JV-403', 'Sibling Attachment: Contact and Placement'),
('JV-405', 'Continuance—Continuance—Dependency Detention Hearing'),
('JV-406', 'Continuance—General'),
('JV-410', 'Findings and Orders After Detention Hearing (Welf. & Inst. Code, § 319)'),
('JV-412', 'Findings and Orders After Jurisdiction Hearing (Welf. & Inst. Code, § 356)'),
('JV-415', 'Findings and Orders After Dispositional Hearing (Welf. & Inst. Code, § 361 et seq.)'),
('JV-416', 'Dispositional Attachment: Dismissal of Petition With or Without Informal Supervision (Welf. & Inst. Code, § 360(b))'),
('JV-417', 'Dispositional Attachment: In-Home Placement With Formal Supervision (Welf. & Inst. Code, § 361)'),
('JV-418', 'Dispositional Attachment: Appointment of Guardian (Welf. & Inst. Code, § 360(a))'),
('JV-419', 'Guardianship—Consent and Waiver of Rights'),
('JV-419A', 'Guardianship—Child\'s Consent and Waiver of Rights'),
('JV-420', 'Dispositional Attachment: Removal From Custodial Parent-Placement With Previously Noncustodial Parent (Welf. & Inst. Code, §§ 361, 361.2)'),
('JV-421', 'Dispositional Attachment: Removal From Custodial Parent—Placement With Nonparent (Welf. & Inst. Code, §§ 361, 361.2)'),
('JV-425', 'Findings and Orders After In-Home Status Review Hearing (Welf. & Inst. Code, § 364)'),
('JV-426', 'Findings and Orders After In-Home Status Review Hearing—Child Placed With Previously Noncustodial Parent (Welf. & Inst. Code, §§ 364, 366.21)'),
('JV-430', 'Findings and Orders After Six-Month Status Review Hearing (Welf. & Inst. Code, § 366.21(e))'),
('JV-431', 'Six-Month Prepermanency Attachment: Child Reunified (Welf. & Inst. Code, § 366.21(e))'),
('JV-432', 'Six-Month Permanency Attachment: Reunification Services Continued (Welf. & Inst. Code, § 366.21(e))'),
('JV-433', 'Six-Month Permanency Attachment: Reunification Services Terminated (Welf. & Inst. Code, § 366.21(e))'),
('JV-435', 'Findings and Orders After 12-Month Permanency Hearing (Welf. & Inst. Code, § 366.21(f))'),
('JV-436', 'Twelve-Month Permanency Attachment: Child Reunified (Welf. & Inst. Code, § 366.21(f))'),
('JV-437', 'Twelve-Month Permanency Attachment: Reunification Services Continued (Welf. & Inst. Code, § 366.21(f))'),
('JV-438', 'Twelve-Month Permanency Attachment: Reunification Services Terminated (Welf. & Inst. Code, § 366.21(f))'),
('JV-440', 'Findings and Orders After 18-Month Permanency Hearing (Welf. & Inst. Code, § 366.22)'),
('JV-441', 'Eighteen-Month Permanency Attachment: Child Reunified (Welf. & Inst. Code, § 366.22)'),
('JV-442', 'Eighteen-Month Permanency Attachment: Reunification Services Terminated (Welf. & Inst. Code, § 366.22)'),
('JV-443', 'Eighteen-Month Permanency Attachment: Reunification Services Continued (Welf. & Inst. Code, § 366.22)'),
('JV-445', 'Findings and Orders After Postpermanency Hearing—Parental Rights Terminated; Permanent Plan of Adoption (Welf. & Inst. Code, § 366.3(f))'),
('JV-446', 'Findings and Orders After Postpermanency Hearing—Permanent Plan Other Than Adoption (Welf. & Inst. Code, § 366.3)'),
('JV-448', 'Order Granting Authority to Consent to Medical, Surgical, and Dental Care (Welf. & Inst. Code, § 366.27)'),
('JV-450', 'Order for Prisoner\'s Appearance at Hearing Affecting Parental Rights'),
('JV-451', 'Prisoner\'s Statement Regarding Appearance at Hearing Affecting Parental Rights'),
('JV-455', 'Findings and Orders After 24-Month Permanency Hearing (Welf. & Inst. Code, § 366.25)'),
('JV-456', 'Twenty-four-Month Permanency Attachment: Child Reunified (Welf. & Inst. Code, § 366.25)'),
('JV-457', 'Twenty-four-Month Permanency Attachment: Reunification Services Terminated (Welf. & Inst. Code, § 366.25)'),
('JV-460', 'Attachment: Additional Findings and Orders for Child Approaching Majority—Dependency'),
('JV-461', 'Findings and Orders After Nonminor Disposition Hearing'),
('JV-461(A)', 'Dispositional Attachment: Nonminor Dependent'),
('JV-462', 'Findings and Orders After Nonminor Dependent Status Review Hearing'),
('JV-463', 'Nonminor\'s Informed Consent to Hold Disposition Hearing'),
('JV-464-INFO', 'How to Ask to Return to Juvenile Court Jurisdiction and Foster Care'),
('JV-466', 'Request to Return to Juvenile Court Jurisdiction and Foster Care'),
('JV-468', 'Confidential Information—Request to Return to Juvenile Court Jurisdiction and Foster Care'),
('JV-470', 'Findings and Orders Regarding Prima Facie Showing on Nonminor\'s Request to Reenter Foster Care'),
('JV-472', 'Findings and Order After Hearing to Consider Nonminor\'s Request to Reenter Foster Care'),
('JV-474', 'Nonminor Dependent—Consent to Copy and Inspect Nonminor Dependent Court File'),
('JV-475', 'Agreement of Adoption of Nonminor Dependent'),
('JV-477', 'Consent of Spouse or Registered Partner to Adoption of Nonminor Dependent'),
('JV-479', 'Order of Adoption of Nonminor Dependent'),
('JV-500', 'Parentage Inquiry'),
('JV-501', 'Parentage—Findings and Judgment'),
('JV-505', 'Statement Regarding Parentage (Juvenile)'),
('JV-510', 'Proof of Service—Juvenile'),
('JV-510(A)', 'Attachement to Proof of Service-Juvenile (Additional Person Served)'),
('JV-520', 'Fax Filing Cover Sheet'),
('JV-525', 'Order to Attend Court or Provide Documents: Subpoena/Subpoena Duces Tecum'),
('JV-530', 'Certified Request for Pupil Records—Truancy'),
('JV-531', 'Local Educational Agency Response to JV-530'),
('JV-535', 'Order Designating Educational Rights Holder'),
('JV-535(A)', 'Attachment to Order Designating Educational Rights Holder'),
('JV-535-INFO', 'Information on Educational Rights Holders'),
('JV-536', 'Local Educational Agency Response to JV-535—Appointment of Surrogate Parent'),
('JV-537', 'Educational Rights Holder Statement'),
('JV-538', 'Findings and Orders Regarding Transfer from School of Origin'),
('JV-539', 'Request for Hearing Regarding Child\'s Access to Services'),
('JV-540', 'Notice of Hearing on Joinder—Juvenile'),
('JV-548', 'Motion for Transfer Out'),
('JV-550', 'Juvenile Court Transfer—Out Orders'),
('JV-552', 'Juvenile Court Transfer-Out Orders—Nonminor Dependent'),
('JV-555', 'Notice of Intent to Place Child Out of County'),
('JV-556', 'Objection to Out-of-County Placement and Notice of Hearing'),
('JV-565', 'Request for Assistance with Expedited Placement Under the Interstate Compact on the Placement of Children'),
('JV-567', 'Expedited Placement Under the Interstate Compact on the Placement of Children: Findings and Orders'),
('JV-569', 'Proof of Service—Petition for Access to Juvenile Case File'),
('JV-570', 'Petition for Access to Juvenile Case File'),
('JV-571', 'Notice of Petition for Access to Juvenile Case File'),
('JV-572', 'Objection to Release of Juvenile Case File'),
('JV-573', 'Order on Petition for Access to Juvenile Case File'),
('JV-574', 'Order After Judicial Review on Petition for Access to Juvenile Case File'),
('JV-575', 'Petition to Obtain Report of Law Enforcement Agency'),
('JV-580', 'Notice to Child and Parent/Guardian RE: Release of Juvenile Police Records and Objection'),
('JV-590', 'Order to Seal Juvenile Records—Welfare and Institutions Code Section 781'),
('JV-591', 'Acknowledgment of Juvenile Record Sealed'),
('JV-592', 'Prosecutor Request for Access to Sealed Juvenile Case File'),
('JV-593', 'Notice of Prosecutor Request for Access to Sealed Juvenile Case File'),
('JV-594', 'Response to Prosecutor Request for Access to Sealed Juvenile Case File'),
('JV-595', 'Request to Seal Juvenile Records'),
('JV-595-INFO', 'How to Ask the Court to Seal Your Records'),
('JV-596', 'Dismissal and Sealing of Records—Welfare and Institutions Code Section 786'),
('JV-596-INFO', 'Sealing of Records for Satisfactory Completion of Probation'),
('JV-597', 'Probation Department Notice on Sealing of Records After Diversion Program'),
('JV-598', 'Petition to Review Denial of Sealing of Records After Diversion Program'),
('JV-599', 'Order on Prosecutor Request for Access to Sealed File'),
('JV-600', 'Juvenile Wardship Petition'),
('JV-610', 'Child Habitually Disobedient § 601(a)'),
('JV-611', 'Child Habitually Truant § 601(b)'),
('JV-615', 'Deferred Entry of Judgment Notice of Noncompliance'),
('JV-618', 'Waiver of Rights—Juvenile Justice'),
('JV-620', 'Violation of Law By Child'),
('JV-622', 'Informal Probation Agreement'),
('JV-624', 'Terms and Conditions'),
('JV-625', 'Notice of Hearing—Juvenile Delinquency Proceeding'),
('JV-635', 'Promise to Appear—Juvenile Delinquency (Juvenile 14 years or Older)'),
('JV-640', 'Delinquency Court Proceeding Findings and Orders'),
('JV-642', 'Initial Appearance Hearing—Juvenile Delinquency'),
('JV-644', 'Jurisdiction Hearing—Juvenile Delinquency'),
('JV-665', 'Disposition—Juvenile Delinquency'),
('JV-667', 'Custodial and Out-of-Home Placement Disposition Attachment'),
('JV-672', 'Findings and Orders After Six-Month Prepermanency Hearing—Delinquency'),
('JV-674', 'Findings and Orders After Permanency Hearing—Delinquency'),
('JV-678', 'Findings and Orders After Permanency Hearing'),
('JV-680', 'Findings and Orders for Child Approaching Majority—Delinquency'),
('JV-681', 'Attachment: Hearing for Dismissal—Additional Findings and Orders—Foster Care Placement—Delinquency'),
('JV-682', 'Findings and Orders After Hearing to Modify Delinquency Jurisdiction to Transition Jurisdiction for Child Younger Than 18 Years of Age'),
('JV-683', 'Findings and Orders After Hearing to Modify Delinquency Jurisdiction to Transition Jurisdiction for Ward Older Than 18 Years of Age'),
('JV-688', 'Continuance—Juvenile Delinquency'),
('JV-690', 'School Notification of Court Adjudication (Welf. & Inst. Code Section 827(b))'),
('JV-692', 'Notification to Sheriff of Juvenile Delinquency Felony Adjudication (Welf. & Inst. Code Section 827.2)'),
('JV-700', 'Declaration of Eligibility for Appointment to Represent Youth in Delinquency Court'),
('JV-710', 'Order to Transfer Juvenile to Criminal Court Jurisdiction (Welfare and Institutions Code, § 707)'),
('JV-732', 'Commitment to the California Department of Corrections and Rehabilitation, Division of Juvenile Facilities'),
('JV-735', 'Juvenile Notice of Violation of Probation'),
('JV-740', 'Petition to Modify, Change, or Set Aside Previous Orders—Change of Circumstances'),
('JV-742', 'Request to Vacate Disposition and Dismiss Penal Code Section 647f'),
('JV-743', 'Order After Request to Vacate Disposition and Dismiss Penal Code Section 647f Adjudication'),
('JV-744', 'Request to Reduce Juvenile Marijuana Offense'),
('JV-744A', 'Attachment to Request to Reduce Juvenile Marijuana Offense (Health and Safety Code, § 11361.8(m))'),
('JV-745', 'Prosecuting Agency Response to Request to Reduce Juvenile Marijuana Offense (Health and Safety Code, § 11361.8(m))'),
('JV-746', 'Order After Request to Reduce Juvenile Marijuana Offense (Health and Safety Code, § 11361.8(m))'),
('JV-748', 'Request to Expunge Arrest or Vacate Adjudication (Human Trafficking Victim) (Penal Code, § 236.14)'),
('JV-749', 'Order after Request to Expunge Arrest or Vacate Adjudication (Human Trafficking Victim) (Penal Code, § 236.14)'),
('JV-750', 'Determination of Eligibility—Deferred Entry of Judgment—Juvenile'),
('JV-751', 'Citation and Written Notification for Deferred Entry of Judgment—Juvenile'),
('JV-755', 'Deferred Entry of Judgment—Dismissal and Sealing of Juvenile Records'),
('JV-760', 'Deferred Entry of Judgment Order'),
('JV-790', 'Order for Victim Restitution'),
('JV-791', 'Abstract of Judgment—Restitution'),
('JV-792', 'Instructions: Order for Restitution and Abstract of Judgment'),
('JV-793', 'Instructions: Abstract of Judgment—Restitution'),
('JV-794', 'Petition to Terminate Wardship and Order'),
('JV-796', 'Petition for Expungement of DNA Profiles and Samples (Pen. Code, § 299)'),
('JV-798', 'Order for Expungement of DNA Profiles and Samples (Pen. Code, § 299)'),
('JV-800', 'Notice of Appeal—Juvenile'),
('JV-805-INFO', 'Information Regarding Appeal Rights'),
('JV-810', 'Recommendation for Appointment of Appellate Attorney for Child'),
('JV-816', 'Application for Extension of Time to File Brief (Juvenile Delinquency)'),
('JV-817', 'Application for Extension of Time to File Brief (Juvenile Dependency)'),
('JV-820', 'Notice of Intent to File Writ Petition and Request for Record to Review Order Setting a Hearing Under Welfare and Institutions Code Section 366.26 (California Rules of Court, Rule 8.450)'),
('JV-822', 'Notice of Intent to File Writ Petition and Request for Record to Review Order Designating or Denying Specific Placement of a Dependent Child After Termination of Parental Rights (California Rules of Court, Rule 8.454)'),
('JV-825', 'Petition for Extraordinary Writ'),
('JV-826', 'Denial of Petition (California Rules of Court, Rules 8.452, 8.456)'),
('JV-828', 'Notice of Action (California Rules of Court, Rule 8.452)'),
('LA-350', 'Notice of Available Language Assistance—Service Provider'),
('LA-400', 'Service Not Available in My Language: Request to Change Court Order'),
('LA-450', 'Service Not Available in My Language: Order'),
('MC-005', 'Facsimile Transmission Cover Sheet (Fax Filing)'),
('MC-010', 'Memorandum of Costs (Summary)'),
('MC-011', 'Memorandum of Costs (Worksheet)'),
('MC-012', 'Memorandum of Costs After Judgment, Acknowledgement of Credit, and Declaration of Accrued Interest'),
('MC-013-INFO', 'Information Sheet for Calculating Interest and Amount Owed on a Judgment'),
('MC-020', 'Additional Page [to be attached to any form]'),
('MC-025', 'Attachment to Judicial Council Form'),
('MC-030', 'Declaration'),
('MC-031', 'Attached Declaration'),
('MC-040', 'Notice of Change of Address or Other Contact'),
('MC-050', 'Substitution of Attorney—Civil (Without Court Order)'),
('MC-051', 'Notice of Motion and Motion to Be Relieved as Counsel—Civil'),
('MC-052', 'Declaration in Support of Attorney\'s Motion to Be Relieved as Counsel—Civil'),
('MC-053', 'Order Granting Attorney\'s Motion to Be Relieved as Counsel—Civil'),
('MC-1000', 'Petition for Review of Denial of Request to Remove Name From Gang Database'),
('MC-120', 'Confidential Reference List of Identifiers'),
('MC-125', 'Confidential Information Form Under Civil Code Section 1708.85'),
('MC-200', 'Claim Opposing Forfeiture'),
('MC-201', 'Claim Opposing Forfeiture of Vehicle (Vehicle Code § 14607.6)'),
('MC-202', 'Petition for Forfeiture of Vehicle and Notice of Hearing'),
('MC-350', 'Petition for Approval of Compromise of Claim or Action or Disposition of Proceeds of Judgment for Minor or Person With A Disability'),
('MC-350(A-12b(5))', 'Additional Medical Service Providers Attachment to Petition for Approval of Compromise of Claim or Action or Disposition of Proceeds of Judgment'),
('MC-350EX', 'Petition for Expedited Approval of Compromise of Claim or Action or Disposition of Proceeds of Judgment for Minor or Person With a Disability'),
('MC-351', 'Order Approving Compromise of Claim or Action or Disposition of Proceeds of Judgment for Minor or Person With a Disability'),
('MC-355', 'Order to Deposit Funds Into Blocked Account'),
('MC-356', 'Acknowledgment of Receipt of Order and Funds for Deposit in Blocked Account'),
('MC-357', 'Petition to Withdraw Funds From Blocked Account'),
('MC-358', 'Order Authorizing Withdrawal of Funds From Blocked Account'),
('MC-410', 'Disability Accommodation Request'),
('MC-410-INFO', 'How to Request a Disability Accommodation for Court'),
('MC-500', 'Media Request to Photograph, Record, or Broadcast'),
('MC-510', 'Order on Media Request to Permit Coverage'),
('MC-800', 'Court Clerks Office: Signage'),
('MD-100', 'Petition to Determine If Dog Is Potentially Dangerous or Vicious'),
('MD-109', 'Notice of Hearing (Menacing Dog)'),
('MD-130', 'Order After Hearing (Menacing Dog)'),
('MD-140', 'Notice of Appeal (Menacing Dog)'),
('MIL-010', 'Notice of Petition and Petition for Relief From Financial Obligation During Military Service'),
('MIL-015', 'Declaration in Support of Petition for Relief From Financial Obligations During Military Service'),
('MIL-020', 'Order on Petition for Relief From Financial Obligations During Military Service'),
('MIL-100', 'Notification of Military Veteran/Reserve/Active Status'),
('MIL-183', 'Petition for Dismissal (Military Personnel)'),
('MIL-184', 'Order for Dismissal (Military Personnel)'),
('MIL-412', 'Petition for Resentencing Based on Health Conditions due to Military Service Listed in Penal Code Section 1170.91(b)'),
('NC-100', 'Petition for Change of Name'),
('NC-100-INFO', 'Instructions for Filing a Petition for Change of Name'),
('NC-110', 'Attachment to Petition for Change of Name'),
('NC-110G', 'Supplemental Attachment to Petition for Change of Name (Declaration of Guardian)'),
('NC-120', 'Order to Show Cause for Change of Name'),
('NC-121', 'Proof of Service of Order to Show Cause'),
('NC-125', 'Order to Show Cause for Change of Name to Conform to Gender Identity (Same as NC-225*)'),
('NC-130', 'Decree Changing Name'),
('NC-130G', 'Decree Changing Name of Minor (by Guardian)'),
('NC-200', 'Petition for Change of Name, Recognition of Change of Gender, and Issuance of New Birth Certificate'),
('NC-225', 'Order to Show Cause for Change of Name to Conform to Gender Identity (same as NC-125*)'),
('NC-230', 'Decree Changing Name and Order Recognizing Change of Gender and for Issuance of New Birth Certificate'),
('NC-300', 'Petition for Recognition of Change of Gender and for Issuance of New Birth Certificate'),
('NC-330', 'Order Recognizing Change of Gender and for Issuance of New Birth Certificate'),
('NC-400', 'Confidential Cover Sheet—Name Change Proceeding Under Address Confidentiality Program (Safe at Home)'),
('NC-400-INFO', 'Information Sheet for Name Change Proceedings Under Address Confidentiality Program (Safe at Home)'),
('NC-410', 'Application to File Documents Under Seal in Name Change Proceeding Under Address Confidentiality Program (Safe at Home)'),
('NC-420', 'Declaration in Support of Application to File Documents Under Seal in Name Change Proceeding Under Address Confidentiality Program (Safe at Home)'),
('NC-425', 'Order on Application to File Documents Under Seal in Name Change Proceeding Under Address Confidentiality Program (Safe at Home)'),
('NC-500', 'Petition for Recognition of Minor\'s Change of Gender and Issuance of New Birth Certificate'),
('NC-500-INFO', 'Instructions for Filing Petition for Recognition of Minor\'s Change of Gender and Issuance of New Birth Certificate (and Change of Name)'),
('NC-510G', 'Supplemental Attachment to Petition for Change of Name (Declaration of Guardian)'),
('NC-520', 'Order to Show Cause for Recognition of Minor\'s Change of Gender and Issuance of New Birth Certificate'),
('NC-530G', 'Order Recognizing Change of Gender and for Issuance of New Birth Certificate (By Guardian or Dependency Attorney)'),
('PLD-050', 'General Denial'),
('PLD-C-001', 'Complaint—Contract'),
('PLD-C-001(1)', 'Cause of Action—Breach of Contract'),
('PLD-C-001(2)', 'Cause of Action—Common Counts'),
('PLD-C-001(3)', 'Cause of Action—Fraud'),
('PLD-C-010', 'Answer—Contract'),
('PLD-PI-001', 'COMPLAINT—Personal Injury, Property Damage, Wrongful Death'),
('PLD-PI-001(1)', 'Cause of Action—Motor Vehicle'),
('PLD-PI-001(2)', 'Cause of Action—General Negligence'),
('PLD-PI-001(3)', 'Cause of Action—Intentional Tort'),
('PLD-PI-001(4)', 'Cause of Action—Premises Liability'),
('PLD-PI-001(5)', 'Cause of Action—Products Liability'),
('PLD-PI-001(6)', 'Exemplary Damages Attachment'),
('PLD-PI-002', 'Cross-Complaint—Personal Injury, Property Damage, Wrongful Death'),
('PLD-PI-003', 'ANSWER—Personal Injury, Property Damage, Wrongful Death'),
('POS-010', 'Proof of Service of Summons'),
('POS-015', 'Notice and Acknowledgment of Receipt—Civil'),
('POS-020', 'Proof of Personal Service—Civil (Proof of Service) / Information Sheet for Proof of Personal Service—Civil'),
('POS-020(D)', 'Attachment to Proof of Personal Service—Civil (Documents Served)'),
('POS-020(P)', 'Attachment to Proof of Personal Service—Civil (Persons Served)'),
('POS-030', 'Proof of Service by First-Class Mail—Civil (Proof of Service)/Information Sheet for Proof of Service by First-Class Mail—Civil'),
('POS-030(D)', 'Attachment to Proof of Service by First-Class Mail—Civil (Documents Service)'),
('POS-030(P)', 'Attachment to Proof of Service by First-Class Mail—Civil (Persons Served)'),
('POS-040', 'Proof of Service—Civil (Proof of Service)'),
('POS-040(D)', 'Attachment to Proof of Service—Civil (Documents Served)'),
('POS-040(P)', 'Attachment to Proof of Service—Civil (Persons Served)'),
('POS-050', 'Proof of Electronic Service'),
('POS-050(D)', 'Attachment to Proof of Electronic Service (Documents Served)'),
('POS-050(P)', 'Attachment to Proof of Electronic Service (Persons Served)'),
('RC-200', 'Ex Parte Order Appointing Receiver and Order to Show Cause and Temporary Restraining Order—Rents, Issues, and Profits'),
('RC-210', 'Order Confirming Appointment of Receiver and Preliminary Injunction—Rents, Issues, and Profits'),
('RC-300', 'Order to Show Cause and Temporary Restraining Order—Rents, Issues, and Profits'),
('RC-310', 'Order Appointing Receiver After Hearing and Preliminary Injunction—Rents, Issues, and Profits'),
('REC-001(N)', 'Notice of Intent to Destroy Superior Court Records; Offer to Transfer Possession'),
('REC-001(R)', 'Request for Transfer or Extension of Time for Retention of Superior Court Records'),
('REC-002(N)', 'Notice of Hearing on Request for Transfer or Extension of Time for Retention of Superior Court Records; Court Record; Release and Receipt of Records'),
('REC-002(R)', 'Release and Receipt of Superior Court Records'),
('SC-100', 'Plaintiff\'s Claim and ORDER to Go to Small Claims Court (Small Claims)'),
('SC-100-INFO', 'Information for the Plaintiff (Small Claims)'),
('SC-100A', 'Other Plaintiffs or Defendants (Attachment to Plaintiff\'s Claim and ORDER to Go to Small Claims Court)'),
('SC-101', 'Attorney Fee Dispute (After Arbitration) (Attachment to Plaintiff\'s Claim and ORDER to Go to Small Claims Court)'),
('SC-103', 'Fictitious Business Name (Small Claims)'),
('SC-104', 'Proof of Service (Small Claims)'),
('SC-104A', 'Proof of Mailing (Substituted Service) (Small Claims)'),
('SC-104B', 'What Is Proof of Service? (Small Claims)'),
('SC-104C', 'How to Serve a Business or Public Entity (Small Claims)'),
('SC-105', 'Request for Court Order and Answer'),
('SC-105A', 'Order on Request for Court Order'),
('SC-107', 'Small Claims Subpoena for Personal Appearance and Production of Documents at Trial or Hearing and Declaration'),
('SC-108', 'Request to Correct or Cancel Judgment and Answer (Small Claims)'),
('SC-108A', 'Order on Request to Correct or Cancel Judgment'),
('SC-109', 'Authorization to Appear on Behalf of Party'),
('SC-112A', 'Proof of Service by Mail (Small Claims)'),
('SC-113A', 'Clerk\'s Certificate of Mailing'),
('SC-114', 'Request to Amend Party Name Before Hearing (Small Claims)'),
('SC-120', 'Defendant\'s Claim and ORDER to Go to Small Claims Court'),
('SC-120A', 'Other Plaintiffs or Defendants (Attachment to Defendant\'s Claim and ORDER to Go to Small Claims Court)'),
('SC-130', 'Notice of Entry of Judgment (Small Claims)'),
('SC-132', 'Attorney-Client Fee Dispute (Attachment to Notice of Entry of Judgment)'),
('SC-133', 'Judgment Debtor\'s Statement of Assets (Small Claims)'),
('SC-134', 'Application and Order to Produce Statement of Assets and to Appear For Examination'),
('SC-135', 'Notice of Motion to Vacate Judgment and Declaration'),
('SC-140', 'Notice of Appeal'),
('SC-145', 'Request to Pay Judgment to Court'),
('SC-150', 'Request to Postpone Trial (Small Claims) (For Information for the Plaintiff, see SC-100-INFO)'),
('SC-152', 'Order on Request to Postpone Trial (Small Claims)'),
('SC-200', 'Notice of Entry of Judgment (Small Claims)'),
('SC-200-INFO', 'What to Do After the Court Decides Your Small Claims Case'),
('SC-202A', 'Decision on Attorney-Client Fee Dispute (Small Claims)'),
('SC-220', 'Request to Make Payments (Small Claims)'),
('SC-220-INFO', 'Payments in Small Claims Cases'),
('SC-221', 'Response to Request to Make Payments (Small Claims)'),
('SC-222', 'Order on Request to Make Payments (Small Claims)'),
('SC-223', 'Declaration of Default in Payment of Judgment'),
('SC-224', 'Response to Declaration of Default in Payment of Judgment'),
('SC-225', 'Order on Declaration of Default in Payments'),
('SC-225A', 'Attachment to Order on Declaration of Default in Payments'),
('SC-290', 'Acknowledgment of Satisfaction of Judgment'),
('SC-300', 'Petition for Writ (Small Claims)'),
('SC-300-INFO', 'Information on Writ Proceedings in Small Claims Cases'),
('SH-001', 'Confidential Information Form Under Code of Civil Procedure Section 367.3'),
('SH-020', 'Motion to Place Documents Under Seal Under Code of Civil Procedure Section 367.3'),
('SH-020-INFO', 'Instructions for Motion to Place Documents Under Seal Under Code of Civil Procedure Section 367.3'),
('SH-022', 'Declaration in Support of Motion to Place Documents Under Seal Under Code of Civil Procedure Section 367.3'),
('SH-025', 'Order on Motion to Place Documents Under Seal Under Code of Civil Procedure Section 367.3'),
('SH-030', 'Ex Parte Application for Order Shortening Time for Hearing on Motion to Place Documents Under Seal Under Code of Civil Procedure Section 367.3'),
('SH-032', 'Declaration Regarding Notice and Service of Ex Parte Application for Order Shortening Time for Hearing on Motion to Place Documents Under Seal Under Code of Civil Procedure Section 367.3'),
('SH-035', 'Order on Ex Parte Application for Order Shortening Time for Hearing on Motion to Place Documents Under Seal Under Code of Civil Procedure Section 367.3'),
('SUBP-001', 'Civil Subpoena for Personal Appearance at Trial or Hearing'),
('SUBP-002', 'Civil Subpoena (Duces Tecum) for Personal Appearance and Production of Documents, Electronically Stored Information, and Things at Trial or Hearing and Declaration'),
('SUBP-010', 'Deposition Subpoena for Production of Business Records'),
('SUBP-015', 'Deposition Subpoena for Personal Appearance'),
('SUBP-020', 'Deposition Subpoena for Personal Appearance and Production of Documents and Things'),
('SUBP-025', 'Notice to Consumer or Employee and Objection'),
('SUBP-030', 'Application for Discovery Subpoena in Action Pending Outside California'),
('SUBP-035', 'Subpoena for Production of Business Records in Action Pending Outside California'),
('SUBP-040', 'Deposition Subpoena for Personal Appearance in Action Pending Outside California'),
('SUBP-045', 'Deposition Subpoena for Personal Appearance and Production of Documents, Electronically Stored Information, and Things in Action Pending Outside California'),
('SUBP-050', 'Subpoena for Inspection of Premises in Action Pending Outside California'),
('SUM-100', 'Summons'),
('SUM-110', 'Summons—Cross-Complaint'),
('SUM-120', 'Summons (Joint Debtor)'),
('SUM-130', 'Summons—Unlawful Detainer—Eviction'),
('SUM-145', 'Summons—Enforcement of State Housing Law'),
('SUM-200(A)', 'Additional Parties Attachment (Attachment to Summons)'),
('SUM-300', 'Declaration of Lost Summons After Service'),
('SV-100', 'Petition for Private Postsecondary School Violence Restraining Orders'),
('SV-100-INFO', 'How Do I Get an Order to Prohibit Private Postsecondary School Violence?'),
('SV-109', 'Notice of Court Hearing (Private Postsecondary School Violence Prevention)'),
('SV-110', 'Temporary Restraining Order (CLETS-TSV)');
INSERT INTO `File_Forms` (`Form`, `Description`) VALUES
('SV-115', 'Request to Continue Court Hearing (Temporary Restraining Order) (Private Postsecondary School Violence Prevention)'),
('SV-115-INFO', 'How to Ask for a New Hearing Date (Private Postsecondary School Violence Prevention)'),
('SV-116', 'Order on Request to Continue Hearing (Temporary Restraining Order) (CLETS-TSV) (Private Postsecondary School Violence Prevention)'),
('SV-120', 'Response to Petition for Private Postsecondary School Violence Restraining Orders'),
('SV-120-INFO', 'How Can I Respond to a Petition for Private Postsecondary School Violence Restraining Orders?'),
('SV-130', 'Private Postsecondary School Violence Restraining Order After Hearing (CLETS-SVO)'),
('SV-200', 'Proof of Personal Service'),
('SV-200-INFO', 'What Is Proof of Personal Service?'),
('SV-250', 'Proof of Service of Response by Mail'),
('SV-260', 'Proof of Service of Order After Hearing by Mail'),
('SV-600', 'Request to Modify/Terminate Private Postsecondary School Violence Restraining Order'),
('SV-610', 'Notice of Hearing on Request to Modify/Terminate Private Postsecondary School Violence Restraining Order'),
('SV-620', 'Response to Request to Modify/Terminate Private Postsecondary School Violence Restraining Order'),
('SV-630', 'Order on Request to Modify/Terminate Private Postsecondary School Violence Restraining Order'),
('SV-700', 'Request to Renew Restraining Order'),
('SV-710', 'Notice of Hearing to Renew Restraining Order'),
('SV-720', 'Response to Request to Renew Restraining Order'),
('SV-730', 'Order Renewing Private Postsecondary School Violence Restraining Order'),
('SV-800', 'Proof of Firearms Turned In, Sold, or Stored'),
('SV-800-INFO', 'How Do I Turn In, Sell, or Store My Firearms?'),
('TH-100', 'Petition for Order Prohibiting Abuse or Program Misconduct'),
('TH-110', 'Order to Show Cause and Temporary Restraining Order'),
('TH-120', 'Participant\'s Response'),
('TH-130', 'Order After Hearing'),
('TH-140', 'Proof of Personal Service'),
('TH-190', 'Restatement of Transitional Housing Misconduct Act'),
('TH-200', 'Instructions for Program Operators'),
('TH-210', 'Instructions for Participants'),
('TR-100', 'Notice of Correction and Proof of Service'),
('TR-106', 'Continuation of Notice to Appear'),
('TR-108', 'Continuation of Citation'),
('TR-115', 'Automated Traffic Enforcement System Notice to Appear'),
('TR-120', 'Nontraffic Notice to Appear'),
('TR-130', 'Traffic/Nontraffic Notice to Appear'),
('TR-135', 'Electronic Traffic/Nontraffic Notice to Appear (4 format)'),
('TR-145', 'Electronic Traffic/Nontraffic Notice to Appear (3 format)'),
('TR-200', 'Instructions to Defendant'),
('TR-205', 'Request for Trial by Written Declaration'),
('TR-210', 'Notice and Instructions to Arresting Officer'),
('TR-215', 'Decision and Notice of Decision'),
('TR-220', 'Request for New Trial (Trial de Novo)'),
('TR-225', 'Order and Notice to Defendant of New Trial (Trial de Novo)'),
('TR-235', 'Officer\'s Declaration'),
('TR-300', 'Agreement to Pay and Forfeit Bail Installments'),
('TR-300 o', 'Online Agreement to Pay and Forfeit Bail Installments'),
('TR-310', 'Agreement to Pay Traffic Violator School Fees in Installments'),
('TR-310 o', 'Online Agreement to Pay Traffic Violator School Fees in Installments'),
('TR-320', 'Can\'t Afford to Pay Fine: Traffic and Other Infractions'),
('TR-321', 'Can\'t Afford to Pay Fine: Traffic and Other Infractions (Court Order)'),
('TR-500-INFO', 'Instruction to Defendant for Remote Video Proceeding'),
('TR-505', 'Notice and Waiver of Rights and Request for Remote Video Arraignment and Trial'),
('TR-510', 'Notice and Waiver of Rights and Request for Remote Video Proceeding'),
('TR-INST', 'Notice to Appear and Related Forms'),
('UD-100', 'Complaint—Unlawful Detainer'),
('UD-101', 'Plaintiff\'s Mandatory Cover Sheet and Supplemental Allegations—Unlawful Detainer'),
('UD-104', 'Cover Sheet for Declaration of Covid-19–Related Financial Distress'),
('UD-104(A)', 'Attachment—Declaration of Covid-19–Related Financial Distress'),
('UD-105', 'Answer—Unlawful Detainer'),
('UD-106', 'Form Interrogatories—Unlawful Detainer'),
('UD-110', 'Judgment—Unlawful Detainer'),
('UD-110 S', 'Judgment—Unlawful Detainer Attachment'),
('UD-115', 'Stipulation for Entry of Judgment'),
('UD-116', 'Declaration for Default Judgment by Court (Unlawful Detainer—Civ. Proc., § 585(d))'),
('UD-120', 'Verification by Landlord Regarding Rental Assistance'),
('UD-150', 'Request/Counter-Request to Set Case for Trial—Unlawful Detainer'),
('UNCLASSIFIED', 'Unclassified'),
('VL-100', 'Prefiling Order—Vexatious Litigant'),
('VL-110', 'Request and Order to File New Litigation by Vexatious Litigant'),
('VL-115', 'Order to File New Litigation by Vexatious Litigant'),
('VL-120', 'Application for Order to Vacate Prefiling Order and Remove Plaintiff/Petitioner From Judicial Council Vexatious Litigant List'),
('VL-125', 'Order on Application to Vacate Prefiling Order and Remove Plaintiff/Petitioner from Judicial Council Vexatious Litigant List'),
('WG-001', 'Application for Earnings Withholding Order'),
('WG-002', 'Earnings Withholding Order'),
('WG-003', 'Employee Instructions'),
('WG-004', 'Earnings Withholding Order for Support'),
('WG-005', 'Employer\'s Return'),
('WG-006', 'Claim of Exemption'),
('WG-007', 'Financial Statement'),
('WG-008', 'Notice of Filing of Claim of Exemption'),
('WG-009', 'Notice of Opposition to Claim of Exemption'),
('WG-010', 'Notice of Hearing on Claim of Exemption'),
('WG-011', 'Order Determining Claim of Exemption'),
('WG-012', 'Notice of Termination or Modification of Earnings Withholding Order'),
('WG-020', 'Application for Earnings Withholding Order for Taxes (State Tax Liability)'),
('WG-021', 'Confidential Supplement to Application for Earnings Withholding Order for Taxes (State Tax Liability)'),
('WG-022', 'Earnings Withholding Order for Taxes (State Tax Liability)'),
('WG-023', 'Notice Of Hearing—Earnings Withholding Order for Taxes (State Tax Liability)'),
('WG-024', 'Temporary Earnings Withholding Order for Taxes (State Tax Liability)'),
('WG-025', 'Confidential Supplement to Temporary Earnings Withholding Order for Taxes (State Tax Liability)'),
('WG-026', 'Claim of Exemption and Financial Declaration (State Tax Liability)'),
('WG-030', 'Earnings Withholding Order for Elder and Dependent Adult Financial Abuse'),
('WG-035', 'Confidential Statement of Judgment Debtor\'s Social Security Number'),
('WV-100', 'Petition for Workplace Violence Restraining Orders'),
('WV-100-INFO', 'How Do I Get an Order to Prohibit Workplace Violence?'),
('WV-109', 'Notice of Court Hearing'),
('WV-110', 'Temporary Restraining Order (CLETS-TWH)'),
('WV-115', 'Request to Continue Court Hearing (Temporary Restraining Order) (Workplace Violence Prevention)'),
('WV-115-INFO', 'How to Ask for a New Hearing Date (Workplace Violence Prevention)'),
('WV-116', 'Order on Request to Continue Hearing (Temporary Restraining Order) (CLETS-TWH) (Workplace Violence Prevention)'),
('WV-120', 'Response to Petition for Workplace Violence Restraining Orders'),
('WV-120-INFO', 'How Can I Respond to a Petition for Workplace Violence Restraining Orders?'),
('WV-130', 'Workplace Violence Restraining Order After hearing (CLETS-WHO)'),
('WV-200', 'Proof of Personal Service'),
('WV-200-INFO', 'What Is Proof of Personal Service?'),
('WV-250', 'Proof of Service of Response by Mail'),
('WV-260', 'Proof of Service of Order After Hearing by Mail'),
('WV-600', 'Request to Modify/Terminate Workplace Violence Restraining Order'),
('WV-610', 'Notice of Hearing on Request to Modify/Terminate Workplace Violence Restraining Order'),
('WV-620', 'Response to Request to Modify/Terminate Workplace Violence Restraining Order'),
('WV-630', 'Order on Request to Modify/Terminate Workplace Violence Restraining Order'),
('WV-700', 'Request to Renew Restraining Order'),
('WV-710', 'Notice of Hearing to Renew Restraining Order'),
('WV-720', 'Response to Request to Renew Restraining Order'),
('WV-730', 'Order Renewing Workplace Violence Restraining Order'),
('WV-800', 'Proof of Firearms Turned In, Sold, or Stored'),
('WV-800-INFO', 'How Do I Turn In, Sell, or Store My Firearms?');

CREATE TABLE `File_Locations` (
  `File_id` varchar(45) NOT NULL,
  `Person_id` varchar(20) NOT NULL,
  `Computer_id` varchar(45) NOT NULL,
  `File_name` varchar(450) NOT NULL,
  `File_dir` varchar(450) NOT NULL,
  `File_path_hash` varchar(32) NOT NULL,
  `loaded_dt` datetime DEFAULT current_timestamp(),
  `removed_dt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `File_Metadata` (
  `File_id` varchar(45) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Value` varchar(450) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `File_Statuses` (
  `Status_code` varchar(10) NOT NULL,
  `Description` varchar(45) NOT NULL,
  `Numeric_value` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `File_Statuses` (`Status_code`, `Description`, `Numeric_value`) VALUES
('DEFAULT', 'DEFAULT', 0),
('STATUS_1', 'STATUS_1', 1),
('STATUS_2', 'STATUS_2', 2),
('STATUS_3', 'STATUS_3', 3);

CREATE TABLE `File_Text` (
  `File_id` varchar(45) NOT NULL,
  `Page` int(11) NOT NULL,
  `Text` text DEFAULT NULL COMMENT 'FULLTEXT'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `File_Versions` (
  `File_id` varchar(45) NOT NULL,
  `Version` int(11) NOT NULL,
  `Original_version_File_id` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `Host_Data` (
  `Field` varchar(100) NOT NULL,
  `Value` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `Host_Data` (`Field`, `Value`) VALUES
('Host_Alias', 'Test Host');

CREATE TABLE `Metadata_Params` (
  `Format` varchar(45) NOT NULL,
  `Param_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `Parameters` (
  `Parameter_name` varchar(20) NOT NULL,
  `Description` varchar(100) NOT NULL,
  `Modifiable` enum('Y','N') NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `Parameters` (`Parameter_name`, `Description`, `Modifiable`) VALUES
('APP_DIR', 'Application Directory', 'Y');

CREATE TABLE `Param_values` (
  `Parameter_name` varchar(20) NOT NULL,
  `Person_id` varchar(20) NOT NULL,
  `Value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `Personnel` (
  `Person_id` varchar(20) NOT NULL,
  `NAME` varchar(100) NOT NULL,
  `Email_address` varchar(45) DEFAULT NULL,
  `Password` varchar(45) DEFAULT NULL,
  `Hourly_fee` float DEFAULT NULL,
  `Phone_number` varchar(45) DEFAULT NULL,
  `Calendar_name` varchar(20) NOT NULL DEFAULT 'DEFAULT',
  `Role` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `Personnel_Time_requirements` (
  `Case_Type` varchar(20) NOT NULL,
  `Person_id` varchar(20) NOT NULL,
  `Activity_type` varchar(20) NOT NULL,
  `Hours_needed` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `Privileges` (
  `Privilege` varchar(45) NOT NULL,
  `Priv_name` varchar(450) NOT NULL,
  `DESCRIPTION` varchar(450) NOT NULL,
  `Priv_Type` enum('screen','system','case') NOT NULL,
  `Show_to_user` enum('Y','N') NOT NULL DEFAULT 'Y'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `Privilege_xref` (
  `Group_Privilege` varchar(45) NOT NULL,
  `Child_Privilege` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `Relation_Types` (
  `RELATION_TYPE` varchar(10) NOT NULL COMMENT 'Examples:\nsubset, similar,',
  `DESCRIPTION` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='Examples: Includes,replaces,ammends ';

INSERT INTO `Relation_Types` (`RELATION_TYPE`, `DESCRIPTION`) VALUES
('DEFAULT', 'DEFAULT'),
('POS', 'Proof of Service'),
('RESPONSE', 'Response'),
('SUBSET', 'Subset');

CREATE TABLE `Roles` (
  `Role` varchar(20) NOT NULL,
  `DESCRIPTION` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `Roles` (`Role`, `DESCRIPTION`) VALUES
('ADMIN', 'Administrator'),
('LAWYER', 'Lawyer'),
('PARALEGAL', 'Paralegal'),
('SECRETARY', 'Secretary'),
('WITNESS', 'Witness');

CREATE TABLE `Role_Privileges` (
  `Row_id` int(11) NOT NULL,
  `Role` varchar(20) NOT NULL,
  `Privilege` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `Role_Privileges` (`Row_id`, `Role`, `Privilege`) VALUES
(1, 'ADMIN', 'ADD_ACTIVITY_TYPE');

CREATE TABLE `Synchronizations` (
  `Sync_id` int(11) NOT NULL,
  `Person_id` varchar(20) NOT NULL,
  `Computer_id` varchar(45) NOT NULL,
  `Sync_Time` datetime NOT NULL,
  `Status` enum('SUCCESS','ERROR','BREAKED','IN_PROCESS') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `Sync_Dirs` (
  `Directory_hash` varchar(32) NOT NULL,
  `Person_id` varchar(20) NOT NULL,
  `Computer_id` varchar(45) NOT NULL,
  `Path` text NOT NULL,
  `Modified_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `Sync_Dir_Schedule` (
  `Row_id` int(11) NOT NULL,
  `Directory_hash` varchar(32) NOT NULL,
  `Sync_time` varchar(11) NOT NULL,
  `Sync_day` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `Sync_Files` (
  `Person_id` varchar(20) NOT NULL,
  `Computer_id` varchar(45) NOT NULL,
  `File_id` varchar(40) NOT NULL,
  `File_name` varchar(250) NOT NULL,
  `Server_File_id` varchar(32) DEFAULT NULL,
  `Parsing_Step_Key` varchar(250) NOT NULL,
  `Add_dt` datetime NOT NULL DEFAULT current_timestamp(),
  `Upload_dt` datetime DEFAULT NULL,
  `Parsed` datetime DEFAULT NULL,
  `Case_NAME` varchar(10) DEFAULT NULL,
  `Form` varchar(100) DEFAULT NULL,
  `File_preview` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
DELIMITER $$
CREATE TRIGGER `Delete_file` AFTER DELETE ON `Sync_Files` FOR EACH ROW DELETE FROM Files WHERE Files.File_id = OLD.File_id AND 1 = 0
$$
DELIMITER ;

CREATE TABLE `Sync_Info` (
  `Sync_id` int(11) NOT NULL,
  `Directory_hash` varchar(32) NOT NULL,
  `Size` int(11) NOT NULL,
  `Total_Scanned_Files` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `Sync_parsing_steps` (
  `Step_Key` varchar(250) NOT NULL,
  `Next_Step_Key` varchar(250) DEFAULT NULL,
  `Step_Desc` varchar(250) NOT NULL,
  `Step_folder` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `sync_share` (
  `row_id` int(11) NOT NULL,
  `Person_id` varchar(20) NOT NULL,
  `Share_to_Person_id` varchar(20) NOT NULL,
  `Share_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `Time_log` (
  `DOC_ID` int(11) NOT NULL,
  `Start_time` datetime NOT NULL,
  `End_time` datetime DEFAULT NULL,
  `Person_id` varchar(20) NOT NULL,
  `Case_NAME` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `To_dos` (
  `to_do_id` int(11) NOT NULL,
  `Activities_Case_NAME` varchar(10) NOT NULL,
  `Activities_Activity_Name` varchar(100) NOT NULL,
  `Activities_Activity_type` varchar(45) NOT NULL,
  `Comments` varchar(450) NOT NULL,
  `Completion_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `user_auth` (
  `auth_id` int(11) NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `user_ip` varchar(15) NOT NULL,
  `user_hash` varchar(32) NOT NULL,
  `user_auth_hash` varchar(32) DEFAULT NULL,
  `user_auth_time` datetime NOT NULL DEFAULT current_timestamp(),
  `user_auth_time_end` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


ALTER TABLE `Activities`
  ADD PRIMARY KEY (`Case_NAME`,`Activity_Name`,`Activity_type`),
  ADD KEY `fk_Activity_Business_dates1_idx` (`Tentative_Calendar_name`,`Tentative_date`),
  ADD KEY `fk_Activities_Cases1_idx` (`Case_NAME`),
  ADD KEY `fk_Activities_Case_Participant_Roles1_idx` (`Responsible_Person_id`,`Case_NAME`),
  ADD KEY `fk_Activities_Activity_types1_idx` (`Activity_type`),
  ADD KEY `fk_Activities_Activities1_idx` (`Case_NAME`,`Parent_Activity_Name`,`Parent_Activity_type`),
  ADD KEY `Owner` (`Owner`),
  ADD KEY `Activity_Name` (`Activity_Name`),
  ADD KEY `Parent_Activity_Name` (`Parent_Activity_Name`);

ALTER TABLE `Activity_Docs_Xref`
  ADD PRIMARY KEY (`DOC_ID`,`Relation_type`,`Case_NAME`,`Activity_Name`) USING BTREE,
  ADD KEY `fk_Activity_Docs_Xref_Documents1_idx` (`DOC_ID`),
  ADD KEY `fk_Activity_Docs_Xref_Relation_Types1_idx` (`Relation_type`),
  ADD KEY `Activity_Name` (`Activity_Name`,`Case_NAME`);

ALTER TABLE `Activity_types`
  ADD PRIMARY KEY (`Activity_type`);

ALTER TABLE `Act_Requirements`
  ADD PRIMARY KEY (`Case_Type`,`Parent_Activity_type`,`Child_Activity_type`),
  ADD KEY `fk_Act_Requirements_Case_Types1_idx` (`Case_Type`),
  ADD KEY `fk_Act_Requirements_Activity_types1_idx` (`Parent_Activity_type`),
  ADD KEY `fk_Act_Requirements_Activity_types2_idx` (`Child_Activity_type`);

ALTER TABLE `Alerts`
  ADD PRIMARY KEY (`Alert_id`),
  ADD KEY `fk_Alerts_To_dos1_idx` (`To_dos_to_do_id`),
  ADD KEY `fk_Alerts_Case_Participants1_idx` (`Person_id`,`Case_NAME`);

ALTER TABLE `Calendars`
  ADD PRIMARY KEY (`Calendar_name`);

ALTER TABLE `Cases`
  ADD PRIMARY KEY (`Case_Short_NAME`),
  ADD KEY `fk_Cases_Case_Types1_idx` (`Case_Type`),
  ADD KEY `fk_Cases_Departments1_idx` (`Department_id`),
  ADD KEY `Status` (`Status`);
ALTER TABLE `Cases` ADD FULLTEXT KEY `Case_Full_NAME` (`Case_Full_NAME`);
ALTER TABLE `Cases` ADD FULLTEXT KEY `Case_Short_NAME` (`Case_Short_NAME`);
ALTER TABLE `Cases` ADD FULLTEXT KEY `Case_Number` (`Case_Number`);
ALTER TABLE `Cases` ADD FULLTEXT KEY `DESCRIPTION` (`DESCRIPTION`);

ALTER TABLE `Case_Actions`
  ADD PRIMARY KEY (`Action_NAME`);

ALTER TABLE `Case_Actions_Log`
  ADD PRIMARY KEY (`Action_Log_ID`),
  ADD KEY `Case_NAME` (`Case_NAME`),
  ADD KEY `Person_id` (`Person_id`),
  ADD KEY `Case_Action_NAME` (`Case_Action_NAME`);

ALTER TABLE `Case_Participants`
  ADD PRIMARY KEY (`Person_id`,`Case_NAME`),
  ADD KEY `Case_PART_Case_IX` (`Case_NAME`),
  ADD KEY `Case_ROLE` (`Case_Participant_ROLE`),
  ADD KEY `Case_Participant_SIDE` (`Case_Participant_SIDE`);

ALTER TABLE `Case_Roles`
  ADD PRIMARY KEY (`Role`);

ALTER TABLE `Case_Role_Privileges`
  ADD PRIMARY KEY (`row_id`),
  ADD KEY `Role` (`Role`),
  ADD KEY `Privilege` (`Privilege`);

ALTER TABLE `Case_Sides`
  ADD PRIMARY KEY (`Side`);

ALTER TABLE `Case_Statuses`
  ADD PRIMARY KEY (`Status`),
  ADD UNIQUE KEY `Status_2` (`Status`),
  ADD KEY `Status_Name_2` (`Status`),
  ADD KEY `Status` (`Status`);

ALTER TABLE `Case_Types`
  ADD PRIMARY KEY (`Case_Type`);

ALTER TABLE `Computers`
  ADD PRIMARY KEY (`Person_id`,`Computer_id`,`Mac_Address`) USING BTREE,
  ADD KEY `Computer_id` (`Computer_id`),
  ADD KEY `Mac_Address` (`Mac_Address`);

ALTER TABLE `Departments`
  ADD PRIMARY KEY (`Department_id`),
  ADD KEY `fk_Departments_Calendars1_idx` (`Calendar_name`);

ALTER TABLE `Documents`
  ADD PRIMARY KEY (`DOC_ID`),
  ADD KEY `fk_Documents_CaseParticipants1_idx` (`Person_id`,`Case_NAME`),
  ADD KEY `Documents_ibfk_1` (`Case_NAME`,`Person_id`),
  ADD KEY `Form` (`Form`);

ALTER TABLE `Document_Actions_Log`
  ADD PRIMARY KEY (`Action_Log_ID`);

ALTER TABLE `Doc_files`
  ADD PRIMARY KEY (`File_id`,`DOC_ID`) USING BTREE,
  ADD KEY `DOC_ID` (`DOC_ID`),
  ADD KEY `File_id` (`File_id`);

ALTER TABLE `Doc_Keywords`
  ADD PRIMARY KEY (`KEYWORDS`,`DOC_ID`),
  ADD KEY `DOC_ID_IX` (`DOC_ID`);

ALTER TABLE `Errors`
  ADD PRIMARY KEY (`Error_Cat_NAME`,`Error_CODE`) USING BTREE;

ALTER TABLE `Error_Categories`
  ADD PRIMARY KEY (`Cat_NAME`);

ALTER TABLE `Files`
  ADD PRIMARY KEY (`File_id`),
  ADD KEY `File_id` (`File_id`),
  ADD KEY `Format` (`Format`),
  ADD KEY `Form` (`Form`);

ALTER TABLE `File_Formats`
  ADD PRIMARY KEY (`Format`);

ALTER TABLE `File_Forms`
  ADD PRIMARY KEY (`Form`);

ALTER TABLE `File_Locations`
  ADD PRIMARY KEY (`File_id`,`File_path_hash`) USING BTREE,
  ADD KEY `fk_Doc_locations_Computers1_idx` (`Person_id`,`Computer_id`),
  ADD KEY `fk_Doc_locations_Doc_files1_idx` (`File_id`),
  ADD KEY `File_name_idx` (`File_name`(255)),
  ADD KEY `Computer_id` (`Computer_id`);

ALTER TABLE `File_Metadata`
  ADD PRIMARY KEY (`File_id`,`Name`),
  ADD KEY `fk_Docs_Metadata_Metadata_Params1_idx` (`Name`),
  ADD KEY `fk_Docs_Metadata_Doc_files1_idx` (`File_id`);

ALTER TABLE `File_Statuses`
  ADD PRIMARY KEY (`Status_code`);

ALTER TABLE `File_Text`
  ADD PRIMARY KEY (`File_id`,`Page`),
  ADD KEY `fk_Doc_Text_Doc_files1_idx` (`File_id`);
ALTER TABLE `File_Text` ADD FULLTEXT KEY `text` (`Text`);

ALTER TABLE `File_Versions`
  ADD PRIMARY KEY (`File_id`,`Version`,`Original_version_File_id`),
  ADD KEY `fk_Versions_Doc_files2_idx` (`File_id`),
  ADD KEY `fk_Versions_Doc_files1` (`Original_version_File_id`);

ALTER TABLE `Host_Data`
  ADD UNIQUE KEY `Field` (`Field`);

ALTER TABLE `Metadata_Params`
  ADD PRIMARY KEY (`Format`,`Param_name`);

ALTER TABLE `Parameters`
  ADD PRIMARY KEY (`Parameter_name`);

ALTER TABLE `Param_values`
  ADD PRIMARY KEY (`Parameter_name`,`Person_id`),
  ADD KEY `Person_id` (`Person_id`);

ALTER TABLE `Personnel`
  ADD PRIMARY KEY (`Person_id`),
  ADD KEY `fk_Personnel_Calendars1_idx` (`Calendar_name`),
  ADD KEY `Role` (`Role`);

ALTER TABLE `Personnel_Time_requirements`
  ADD PRIMARY KEY (`Case_Type`,`Person_id`,`Activity_type`),
  ADD KEY `fk_Personnel_Time_requirements_Personnel1_idx` (`Person_id`),
  ADD KEY `fk_Personnel_Time_requirements_Activity_types1_idx` (`Activity_type`);

ALTER TABLE `Privileges`
  ADD PRIMARY KEY (`Privilege`);

ALTER TABLE `Privilege_xref`
  ADD PRIMARY KEY (`Group_Privilege`,`Child_Privilege`),
  ADD KEY `fk_Privilege_xref_Privileges2_idx` (`Child_Privilege`);

ALTER TABLE `Relation_Types`
  ADD PRIMARY KEY (`RELATION_TYPE`);

ALTER TABLE `Roles`
  ADD PRIMARY KEY (`Role`),
  ADD KEY `Role` (`Role`);

ALTER TABLE `Role_Privileges`
  ADD PRIMARY KEY (`Row_id`),
  ADD KEY `Role` (`Role`),
  ADD KEY `Privilege` (`Privilege`);

ALTER TABLE `Synchronizations`
  ADD PRIMARY KEY (`Sync_id`,`Person_id`,`Computer_id`),
  ADD UNIQUE KEY `Sync_id` (`Sync_id`),
  ADD KEY `Person_id` (`Person_id`),
  ADD KEY `Computer_id` (`Computer_id`),
  ADD KEY `Computer_id_2` (`Computer_id`,`Person_id`);

ALTER TABLE `Sync_Dirs`
  ADD PRIMARY KEY (`Directory_hash`),
  ADD KEY `Person_id` (`Person_id`,`Computer_id`);

ALTER TABLE `Sync_Dir_Schedule`
  ADD UNIQUE KEY `Row_id` (`Row_id`),
  ADD KEY `Directory_hash` (`Directory_hash`);

ALTER TABLE `Sync_Files`
  ADD PRIMARY KEY (`Person_id`,`Computer_id`,`File_id`),
  ADD KEY `Person_id` (`Person_id`),
  ADD KEY `File_hash` (`File_id`),
  ADD KEY `Computer_id` (`Computer_id`),
  ADD KEY `Parsing_Step_Key` (`Parsing_Step_Key`),
  ADD KEY `Case_NAME` (`Case_NAME`),
  ADD KEY `Form` (`Form`);

ALTER TABLE `Sync_Info`
  ADD PRIMARY KEY (`Sync_id`,`Directory_hash`),
  ADD KEY `Directory_hash` (`Directory_hash`);

ALTER TABLE `Sync_parsing_steps`
  ADD PRIMARY KEY (`Step_Key`) USING BTREE,
  ADD KEY `Next_Step_Key` (`Next_Step_Key`);

ALTER TABLE `sync_share`
  ADD PRIMARY KEY (`row_id`),
  ADD KEY `Person_id` (`Person_id`),
  ADD KEY `Share_to_Person_id` (`Share_to_Person_id`);

ALTER TABLE `Time_log`
  ADD PRIMARY KEY (`DOC_ID`,`Start_time`,`Person_id`,`Case_NAME`),
  ADD KEY `fk_Time_log_Case_Participants1_idx` (`Person_id`,`Case_NAME`);

ALTER TABLE `To_dos`
  ADD PRIMARY KEY (`to_do_id`),
  ADD KEY `fk_To_dos_Activities1_idx` (`Activities_Case_NAME`,`Activities_Activity_Name`,`Activities_Activity_type`);

ALTER TABLE `user_auth`
  ADD PRIMARY KEY (`auth_id`),
  ADD KEY `user_auth_ibfk_1` (`user_id`);


ALTER TABLE `Alerts`
  MODIFY `Alert_id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `Case_Actions_Log`
  MODIFY `Action_Log_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;
ALTER TABLE `Case_Role_Privileges`
  MODIFY `row_id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `Documents`
  MODIFY `DOC_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4189;
ALTER TABLE `Document_Actions_Log`
  MODIFY `Action_Log_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=254;
ALTER TABLE `Role_Privileges`
  MODIFY `Row_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
ALTER TABLE `Synchronizations`
  MODIFY `Sync_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=182;
ALTER TABLE `Sync_Dir_Schedule`
  MODIFY `Row_id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `sync_share`
  MODIFY `row_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;
ALTER TABLE `To_dos`
  MODIFY `to_do_id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `user_auth`
  MODIFY `auth_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=432;

ALTER TABLE `Activities`
  ADD CONSTRAINT `Activities_ibfk_1` FOREIGN KEY (`Case_NAME`) REFERENCES `Cases` (`Case_Short_NAME`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Activities_ibfk_2` FOREIGN KEY (`Owner`) REFERENCES `Case_Sides` (`Side`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Activities_ibfk_3` FOREIGN KEY (`Activity_type`) REFERENCES `Activity_types` (`Activity_type`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Activities_ibfk_4` FOREIGN KEY (`Tentative_Calendar_name`) REFERENCES `Calendars` (`Calendar_name`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Activities_ibfk_5` FOREIGN KEY (`Responsible_Person_id`) REFERENCES `Personnel` (`Person_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Activities_ibfk_6` FOREIGN KEY (`Parent_Activity_Name`) REFERENCES `Activities` (`Activity_Name`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Activity_Docs_Xref`
  ADD CONSTRAINT `Activity_Docs_Xref_ibfk_1` FOREIGN KEY (`Relation_type`) REFERENCES `Relation_Types` (`RELATION_TYPE`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Activity_Docs_Xref_ibfk_2` FOREIGN KEY (`DOC_ID`) REFERENCES `Documents` (`DOC_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Activity_Docs_Xref_ibfk_3` FOREIGN KEY (`Activity_Name`,`Case_NAME`) REFERENCES `Activities` (`Activity_Name`, `Case_NAME`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Cases`
  ADD CONSTRAINT `Cases_ibfk_1` FOREIGN KEY (`Department_id`) REFERENCES `Departments` (`Department_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Cases_ibfk_2` FOREIGN KEY (`Case_Type`) REFERENCES `Case_Types` (`Case_Type`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Cases_ibfk_3` FOREIGN KEY (`Status`) REFERENCES `Case_Statuses` (`Status`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Case_Actions_Log`
  ADD CONSTRAINT `Case_Actions_Log_ibfk_1` FOREIGN KEY (`Case_NAME`) REFERENCES `Cases` (`Case_Short_NAME`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Case_Actions_Log_ibfk_2` FOREIGN KEY (`Person_id`) REFERENCES `Personnel` (`Person_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Case_Actions_Log_ibfk_3` FOREIGN KEY (`Case_Action_NAME`) REFERENCES `Case_Actions` (`Action_NAME`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Case_Participants`
  ADD CONSTRAINT `Case_Participants_ibfk_1` FOREIGN KEY (`Case_NAME`) REFERENCES `Cases` (`Case_Short_NAME`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Case_Participants_ibfk_2` FOREIGN KEY (`Person_id`) REFERENCES `Personnel` (`Person_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Case_Participants_ibfk_3` FOREIGN KEY (`Case_Participant_ROLE`) REFERENCES `Case_Roles` (`Role`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Case_Participants_ibfk_4` FOREIGN KEY (`Case_Participant_SIDE`) REFERENCES `Case_Sides` (`Side`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Documents`
  ADD CONSTRAINT `Documents_ibfk_1` FOREIGN KEY (`Case_NAME`,`Person_id`) REFERENCES `Case_Participants` (`Case_NAME`, `Person_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Documents_ibfk_2` FOREIGN KEY (`Form`) REFERENCES `File_Forms` (`Form`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Doc_files`
  ADD CONSTRAINT `Doc_files_ibfk_1` FOREIGN KEY (`DOC_ID`) REFERENCES `Documents` (`DOC_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Doc_files_ibfk_2` FOREIGN KEY (`File_id`) REFERENCES `Files` (`File_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Doc_Keywords`
  ADD CONSTRAINT `Doc_Keywords_ibfk_1` FOREIGN KEY (`DOC_ID`) REFERENCES `Documents` (`DOC_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Errors`
  ADD CONSTRAINT `Errors_ibfk_1` FOREIGN KEY (`Error_Cat_NAME`) REFERENCES `Error_Categories` (`Cat_NAME`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Files`
  ADD CONSTRAINT `Files_ibfk_1` FOREIGN KEY (`Format`) REFERENCES `File_Formats` (`Format`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Files_ibfk_2` FOREIGN KEY (`Form`) REFERENCES `File_Forms` (`Form`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `File_Locations`
  ADD CONSTRAINT `File_Locations_ibfk_1` FOREIGN KEY (`File_id`) REFERENCES `Files` (`File_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `File_Locations_ibfk_2` FOREIGN KEY (`Person_id`,`Computer_id`) REFERENCES `Computers` (`Person_id`, `Computer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `File_Metadata`
  ADD CONSTRAINT `File_Metadata_ibfk_1` FOREIGN KEY (`File_id`) REFERENCES `Files` (`File_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `File_Text`
  ADD CONSTRAINT `File_Text_ibfk_1` FOREIGN KEY (`File_id`) REFERENCES `Files` (`File_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Param_values`
  ADD CONSTRAINT `Param_values_ibfk_1` FOREIGN KEY (`Parameter_name`) REFERENCES `Parameters` (`Parameter_name`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Param_values_ibfk_2` FOREIGN KEY (`Person_id`) REFERENCES `Personnel` (`Person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Personnel`
  ADD CONSTRAINT `Personnel_ibfk_1` FOREIGN KEY (`Role`) REFERENCES `Roles` (`Role`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Synchronizations`
  ADD CONSTRAINT `Synchronizations_ibfk_1` FOREIGN KEY (`Computer_id`,`Person_id`) REFERENCES `Computers` (`Computer_id`, `Person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Sync_Dirs`
  ADD CONSTRAINT `Sync_Dirs_ibfk_1` FOREIGN KEY (`Person_id`,`Computer_id`) REFERENCES `Computers` (`Person_id`, `Computer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Sync_Dir_Schedule`
  ADD CONSTRAINT `Sync_Dir_Schedule_ibfk_1` FOREIGN KEY (`Directory_hash`) REFERENCES `Sync_Dirs` (`Directory_hash`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Sync_Files`
  ADD CONSTRAINT `Sync_Files_ibfk_1` FOREIGN KEY (`Person_id`,`Computer_id`) REFERENCES `Computers` (`Person_id`, `Computer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Sync_Files_ibfk_2` FOREIGN KEY (`File_id`) REFERENCES `Files` (`File_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Sync_Files_ibfk_3` FOREIGN KEY (`Parsing_Step_Key`) REFERENCES `Sync_parsing_steps` (`Step_Key`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Sync_Files_ibfk_4` FOREIGN KEY (`Case_NAME`) REFERENCES `Cases` (`Case_Short_NAME`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Sync_Files_ibfk_5` FOREIGN KEY (`Form`) REFERENCES `File_Forms` (`Form`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Sync_Info`
  ADD CONSTRAINT `Sync_Info_ibfk_1` FOREIGN KEY (`Sync_id`) REFERENCES `Synchronizations` (`Sync_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Sync_Info_ibfk_2` FOREIGN KEY (`Directory_hash`) REFERENCES `Sync_Dirs` (`Directory_hash`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Sync_parsing_steps`
  ADD CONSTRAINT `Sync_parsing_steps_ibfk_1` FOREIGN KEY (`Next_Step_Key`) REFERENCES `Sync_parsing_steps` (`Step_Key`) ON DELETE SET NULL ON UPDATE SET NULL;

ALTER TABLE `sync_share`
  ADD CONSTRAINT `sync_share_ibfk_1` FOREIGN KEY (`Person_id`) REFERENCES `Personnel` (`Person_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sync_share_ibfk_2` FOREIGN KEY (`Share_to_Person_id`) REFERENCES `Personnel` (`Person_id`) ON DELETE CASCADE ON UPDATE CASCADE;
SET FOREIGN_KEY_CHECKS=1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
