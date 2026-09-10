import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  LayoutDashboard, Wallet, ReceiptText, FileBarChart2, Download,
  Settings as SettingsIcon, Plus, X, Pencil, Trash2, AlertTriangle,
  CheckCircle2, Search, TrendingUp, TrendingDown, Eye, Menu,
  ChevronRight, RotateCcw, Info, FileText, Building2
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RTooltip } from "recharts";
// Static historical data baked in from Cash_in_out_hub_2026.xlsx (Jan 2026 - Sep 2026).
// This is a one-time snapshot, not live-synced. New expenses go through the app as usual.
const STATIC_HISTORY = [{"date": "2026-01-01", "bu": "Cash in Hand", "category": "Cash in Hand", "description": "", "amount": 42899.0, "type": "inflow", "balance": 42899.0}, {"date": "2026-01-01", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 01-01-26", "amount": 90.0, "type": "expense", "balance": 42809.0}, {"date": "2026-01-01", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "“Purchase of ball cock and flush tank button for 141-D Ground Floor, as per email-", "amount": 2850.0, "type": "expense", "balance": 39959.0}, {"date": "2026-01-01", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 4x3 net to cover the Atrium Glass hole with net, 140-H office, as instructed by Shahbaz", "amount": 220.0, "type": "expense", "balance": 39739.0}, {"date": "2026-01-01", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 03 cup tea for Uzair Gadit and the guest, as instructed by Shahbaz-", "amount": 240.0, "type": "expense", "balance": 39499.0}, {"date": "2026-01-01", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased  lunch for Director's & Aqib Zafar's meeting, as per email-", "amount": 10550.0, "type": "expense", "balance": 28949.0}, {"date": "2026-01-02", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 02-01-26", "amount": 110.0, "type": "expense", "balance": 28839.0}, {"date": "2026-01-02", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 02 Diet Coke drinks for Jonathan, as per email-  17-12-25", "amount": 240.0, "type": "expense", "balance": 28599.0}, {"date": "2026-01-02", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased Philips panel light 2x2 for the learning center 141-D, as per email-", "amount": 5800.0, "type": "expense", "balance": 22799.0}, {"date": "2026-01-02", "bu": "Disrupt Admin", "category": "Stationery", "description": "Purchased Stapler pin (23/8) large packet for the maintenance team, as instructed by Akram-", "amount": 150.0, "type": "expense", "balance": 22649.0}, {"date": "2026-01-02", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid for washing 01 Prayer Mat (Dari) prayer area 141-C, as instructed by Khaleeq Kamali-", "amount": 500.0, "type": "expense", "balance": 22149.0}, {"date": "2026-01-05", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 05-01-26", "amount": 80.0, "type": "expense", "balance": 22069.0}, {"date": "2026-01-05", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02 set commode seat bolt, as instructed by Akram-", "amount": 400.0, "type": "expense", "balance": 21669.0}, {"date": "2026-01-05", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased Nut bolt & washer for the foosball repairing, as instructed by Shahbaz- 03-01-26", "amount": 350.0, "type": "expense", "balance": 21319.0}, {"date": "2026-01-05", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased commode push button and ball cock for the 141-D ground floor restroom, as per email-", "amount": 1000.0, "type": "expense", "balance": 20319.0}, {"date": "2026-01-05", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased  2.5dozen cutter pins for the foosball repairing, as per email-", "amount": 720.0, "type": "expense", "balance": 19599.0}, {"date": "2026-01-05", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Paid labor charges for the fixation of the cabinet door at 140-H entrance, as per email", "amount": 2000.0, "type": "expense", "balance": 17599.0}, {"date": "2026-01-05", "bu": "Disrupt Procurement", "category": "Disrupt Procurement", "description": "Paid for Raashan offloading to Mr. Ali Ahmed 0328-2206787) - Gaditek Procurement", "amount": 4000.0, "type": "expense", "balance": 13599.0}, {"date": "2026-01-05", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid for towel washing for the Advisor room, as instructed by Shahbaz-", "amount": 160.0, "type": "expense", "balance": 13439.0}, {"date": "2026-01-05", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 plug for the Tree meeting room, as instructed by Akram-", "amount": 50.0, "type": "expense", "balance": 13389.0}, {"date": "2026-01-05", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the document color printout (Room Reservation for Emre Tok), as instructed by Shahbaz-", "amount": 200.0, "type": "expense", "balance": 13189.0}, {"date": "2026-01-06", "bu": "", "category": "", "description": "Cash Received from Finance", "amount": 157000.0, "type": "inflow", "balance": 170189.0}, {"date": "2026-01-06", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 06-01-26", "amount": 40.0, "type": "expense", "balance": 170149.0}, {"date": "2026-01-06", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 03kg white cement &  ball cock for the 140-H office, sink shower for 141-C washing area, as per email", "amount": 1600.0, "type": "expense", "balance": 168549.0}, {"date": "2026-01-06", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to for main drain line opening at the backside alley of 140-H, as per email-", "amount": 4000.0, "type": "expense", "balance": 164549.0}, {"date": "2026-01-06", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the document color printout (Room Reservation for Uzair Gadit), as instructed by Shahbaz-", "amount": 200.0, "type": "expense", "balance": 164349.0}, {"date": "2026-01-07", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 07-01-26", "amount": 315.0, "type": "expense", "balance": 164034.0}, {"date": "2026-01-07", "bu": "Disrupt Admin", "category": "Stationery", "description": "Purchased 01 pack of rubber bands for the valet staff, as per email-", "amount": 600.0, "type": "expense", "balance": 163434.0}, {"date": "2026-01-07", "bu": "Disrupt Admin", "category": "Stationery", "description": "Purchased 01 pointer box for the valet staff, as per email-", "amount": 200.0, "type": "expense", "balance": 163234.0}, {"date": "2026-01-07", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased  01pair of Pota seat bolt with base, for the 141-D restroom, as per email-", "amount": 1000.0, "type": "expense", "balance": 162234.0}, {"date": "2026-01-07", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the lock fixation of Umair Gadit's room, in 140-H, as per email-", "amount": 1000.0, "type": "expense", "balance": 161234.0}, {"date": "2026-01-07", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 01 Mirinda can (Rs. 120) & 02 packs of Saltish biscuit (Rs. 80), for Emre, as per email-", "amount": 200.0, "type": "expense", "balance": 161034.0}, {"date": "2026-01-08", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 08-01-26", "amount": 540.0, "type": "expense", "balance": 160494.0}, {"date": "2026-01-08", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased WD-40 (100ml) for the maintenance team, as instructed by Zohabi-", "amount": 550.0, "type": "expense", "balance": 159944.0}, {"date": "2026-01-08", "bu": "Disrupt Admin", "category": "R&M - Equipments Admin", "description": "Purchased 02 cartons of distilled water for UPS battery water refilling at both offices, as per email-", "amount": 2000.0, "type": "expense", "balance": 157944.0}, {"date": "2026-01-08", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01dozen Rod handle (grip) for the Foosball gaming zone 140-H, as per email-", "amount": 450.0, "type": "expense", "balance": 157494.0}, {"date": "2026-01-08", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02 dozen chalks & 02 dozen Stick Tips, for the Snooker 140-H gaming zone, as per email", "amount": 1900.0, "type": "expense", "balance": 155594.0}, {"date": "2026-01-08", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 04Nos Fary light for the 140-H cafe garden area, as per email-", "amount": 2200.0, "type": "expense", "balance": 153394.0}, {"date": "2026-01-08", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 chamber cover 18 x 18, for the motor area 140-H office, as per email-", "amount": 950.0, "type": "expense", "balance": 152444.0}, {"date": "2026-01-08", "bu": "Gz Systems", "category": "Gz Systems", "description": "Purchased 40Nos (20 fizzup & 20 Cola Next)350ml for the Pure session, as per email-", "amount": 2160.0, "type": "expense", "balance": 150284.0}, {"date": "2026-01-09", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 09-01-26", "amount": 490.0, "type": "expense", "balance": 149794.0}, {"date": "2026-01-09", "bu": "Disrupt Admin", "category": "Utilities Expenses", "description": "Pay Salary to Mr. Shaharyar for monthly garbage collection of 140-H and 141-D & 141-C", "amount": 4000.0, "type": "expense", "balance": 145794.0}, {"date": "2026-01-09", "bu": "N-Dir Entertainment", "category": "N-Dir Entertainment", "description": "Purchased refreshments for Rafay Gadit's meeting with the guest, as instructed by Shahbaz", "amount": 1001.0, "type": "expense", "balance": 144793.0}, {"date": "2026-01-09", "bu": "N-Dir Entertainment", "category": "N-Dir Entertainment", "description": "Purchased refreshments for Rafay Gadit's meeting with the guest, as instructed by Shahbaz", "amount": 7031.0, "type": "expense", "balance": 137762.0}, {"date": "2026-01-09", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 02 N95 face masks for Sajjad during color work, as instructed by HSC-", "amount": 200.0, "type": "expense", "balance": 137562.0}, {"date": "2026-01-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 10-meter 23/76 wire for the 140-H restroom, as instructed by Zohaib-", "amount": 600.0, "type": "expense", "balance": 136962.0}, {"date": "2026-01-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased grinder disk for the maintenance team, as instructed by Zohaib-", "amount": 450.0, "type": "expense", "balance": 136512.0}, {"date": "2026-01-09", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 11Kg hypo and 01Kg castic soda for the restroom cleaning, as instructed by Khaleeq Kamali-", "amount": 1280.0, "type": "expense", "balance": 135232.0}, {"date": "2026-01-12", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 12-01-26", "amount": 105.0, "type": "expense", "balance": 135127.0}, {"date": "2026-01-12", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased customized acrylic tab holder with uv printing, for the 140-H Reception Tab Holder, as per email-", "amount": 20000.0, "type": "expense", "balance": 115127.0}, {"date": "2026-01-12", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01Nos connector for the 140-H Reception conference room, Rope light, as instructed by Shahbaz-", "amount": 250.0, "type": "expense", "balance": 114877.0}, {"date": "2026-01-13", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 13-01-26", "amount": 260.0, "type": "expense", "balance": 114617.0}, {"date": "2026-01-13", "bu": "Disrupt Legal", "category": "Disrupt Legal", "description": "Purchased 02Nos E Stamp paper worth Rs.1000 for the legal department,", "amount": 2400.0, "type": "expense", "balance": 112217.0}, {"date": "2026-01-13", "bu": "Disrupt Legal", "category": "Disrupt Legal", "description": "Paid for the documents printout for the Legal team, as instructed by Ms Felicia", "amount": 650.0, "type": "expense", "balance": 111567.0}, {"date": "2026-01-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos PU Foam for the general use, as per email-", "amount": 2000.0, "type": "expense", "balance": 109567.0}, {"date": "2026-01-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 restroom DOOR LOCK, for 140-H office, as per email of Akram-", "amount": 1400.0, "type": "expense", "balance": 108167.0}, {"date": "2026-01-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for chroom on tea kettle lid & rubber for lid, as per email of Khaleeq Kamali-", "amount": 1000.0, "type": "expense", "balance": 107167.0}, {"date": "2026-01-13", "bu": "N-Dir Entertainment", "category": "N-Dir Entertainment", "description": "Purchased  refreshments for the Amin Uncle's meeting with guest, as per email-", "amount": 1340.0, "type": "expense", "balance": 105827.0}, {"date": "2026-01-14", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 14-01-26", "amount": 460.0, "type": "expense", "balance": 105367.0}, {"date": "2026-01-14", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 04Nos multi sheet for the 140-H basement room, as per email-", "amount": 2600.0, "type": "expense", "balance": 102767.0}, {"date": "2026-01-14", "bu": "Auto Os", "category": "Auto Os", "description": "Pay for Car Fuel fill-up  BYA-346, for the Auto OS team, as per email, closing balance is Rs. 3,000", "amount": 3000.0, "type": "expense", "balance": 99767.0}, {"date": "2026-01-14", "bu": "Disrupt Finance", "category": "Disrupt Finance", "description": "Purchased lunch for the HBL team, for Account opening session, as per email-", "amount": 1100.0, "type": "expense", "balance": 98667.0}, {"date": "2026-01-14", "bu": "Gz Systems", "category": "Gz Systems", "description": "Purchased lunch (Suriya Biryani) for the farewell of Haris Munaf, as per email-", "amount": 14300.0, "type": "expense", "balance": 84367.0}, {"date": "2026-01-14", "bu": "Gz Systems", "category": "Gz Systems", "description": "Paid for the (wedding gift) courier via TCS CN# 306063247327 to M Zulqarnain- Gilgit, as per email-", "amount": 810.0, "type": "expense", "balance": 83557.0}, {"date": "2026-01-15", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 15-01-26", "amount": 170.0, "type": "expense", "balance": 83387.0}, {"date": "2026-01-15", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the document color printout for (Room Reservation for Santi & Work in Progress) as instructed by Shahbaz-", "amount": 400.0, "type": "expense", "balance": 82987.0}, {"date": "2026-01-15", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 04Nos multi sheet for the 140-H garden conference room, as per email-", "amount": 2600.0, "type": "expense", "balance": 80387.0}, {"date": "2026-01-15", "bu": "Disrupt Legal", "category": "Disrupt Legal", "description": "Purchased 02Nos E Stamp paper worth Rs.1000 (Dated: Nov-25) for the legal department,", "amount": 3000.0, "type": "expense", "balance": 77387.0}, {"date": "2026-01-15", "bu": "Disrupt Legal", "category": "Disrupt Legal", "description": "Paid for the documents printout for the Legal team, as instructed by Ms Felicia", "amount": 560.0, "type": "expense", "balance": 76827.0}, {"date": "2026-01-16", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 16-01-26", "amount": 190.0, "type": "expense", "balance": 76637.0}, {"date": "2026-01-16", "bu": "Disrupt Admin", "category": "R&M - Electronics", "description": "Purchased 12'' exhaust fan for the 140-H Basement parking, as per email of Akram-", "amount": 6000.0, "type": "expense", "balance": 70637.0}, {"date": "2026-01-16", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01Nos Black Spray paint for the (140-H Reception room sheet paint) maintenance team, as instructed by Akram", "amount": 350.0, "type": "expense", "balance": 70287.0}, {"date": "2026-01-16", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 LED light for the kettle, as instructed by Khaleeq Kamali-", "amount": 200.0, "type": "expense", "balance": 70087.0}, {"date": "2026-01-16", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for changing the window net for the 1st Floor, 140-H Office, as instructed by Shahbaz-", "amount": 500.0, "type": "expense", "balance": 69587.0}, {"date": "2026-01-19", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 19-01-26", "amount": 100.0, "type": "expense", "balance": 69487.0}, {"date": "2026-01-19", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the 140-H parking area wall core cutting, for the electric wiring for water dispenser, as per email of Akram-", "amount": 2200.0, "type": "expense", "balance": 67287.0}, {"date": "2026-01-19", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos magnetic door stoppers for the 141-D female restroom, as per email of Akram-", "amount": 960.0, "type": "expense", "balance": 66327.0}, {"date": "2026-01-19", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 LED light driver for the 140-H office, as instructed by Shahbaz-", "amount": 100.0, "type": "expense", "balance": 66227.0}, {"date": "2026-01-19", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid for towel washing for the Advisor room, as instructed by Shahbaz-", "amount": 80.0, "type": "expense", "balance": 66147.0}, {"date": "2026-01-19", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 04 pcs aluminum brackets for LED light for the second floor, as per email of Akram- 16-01-25", "amount": 1000.0, "type": "expense", "balance": 65147.0}, {"date": "2026-01-20", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 20-01-26", "amount": 560.0, "type": "expense", "balance": 64587.0}, {"date": "2026-01-20", "bu": "Disrupt Admin", "category": "Utilities Expenses", "description": "Pay to SKY Fast cable media monthly Cable fees 140-H (Jan)", "amount": 800.0, "type": "expense", "balance": 63787.0}, {"date": "2026-01-20", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased a (12V 9A) driver for (MOVE) logo light, as per email of Akram-", "amount": 1400.0, "type": "expense", "balance": 62387.0}, {"date": "2026-01-20", "bu": "Disrupt Admin", "category": "Water bottles", "description": "Paid for the 06Nos water bottle refilling from RO Plant, as instructed by Khaleeq Kamali-", "amount": 350.0, "type": "expense", "balance": 62037.0}, {"date": "2026-01-20", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 03Nos lock clip for blind rope, as instructed by Akram-", "amount": 300.0, "type": "expense", "balance": 61737.0}, {"date": "2026-01-20", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 door handle with screw for restroom, as instructed by Akram", "amount": 80.0, "type": "expense", "balance": 61657.0}, {"date": "2026-01-20", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 key chain for the gym locker for Saad Gadit, as instructed by Khaleeq Kamali- 16-01-25", "amount": 250.0, "type": "expense", "balance": 61407.0}, {"date": "2026-01-20", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 roll of flexible pipe 3/4'' and 01 roll flexible pipe 1'' to cover all open wires, as per email of Akram-", "amount": 2800.0, "type": "expense", "balance": 58607.0}, {"date": "2026-01-21", "bu": "", "category": "", "description": "Cash Received from Finance", "amount": 130400.0, "type": "inflow", "balance": 189007.0}, {"date": "2026-01-21", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 21-01-26", "amount": 475.0, "type": "expense", "balance": 188532.0}, {"date": "2026-01-21", "bu": "Squatwolf", "category": "Squatwolf", "description": "Purchased 50glass buttermilk for the Squatwolf event, as per email- 12-01-26", "amount": 7500.0, "type": "expense", "balance": 181032.0}, {"date": "2026-01-21", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 02Nos Mirinda Can for Santi, as instructed by Shahbaz- 20-01-26", "amount": 240.0, "type": "expense", "balance": 180792.0}, {"date": "2026-01-21", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 04Nos Multi sheet for Clopal for the 140-H conference room, as per email of Akram-", "amount": 3800.0, "type": "expense", "balance": 176992.0}, {"date": "2026-01-21", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the 141-C Cafe entrance glass door repairing, as per email of Akram-", "amount": 2000.0, "type": "expense", "balance": 174992.0}, {"date": "2026-01-21", "bu": "Disrupt Finance", "category": "Disrupt Finance", "description": "Paid for the making of the Stamp for Finance (Stellar Layer (Private) Limited) as per the email of Abdul Hai-", "amount": 1400.0, "type": "expense", "balance": 173592.0}, {"date": "2026-01-21", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 electric tape for the maintenance team (flexible pipe installation), as instructed by Akram-", "amount": 60.0, "type": "expense", "balance": 173532.0}, {"date": "2026-01-21", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for changing the window net for the 1st Floor, 140-H Office, as instructed by Shahbaz-", "amount": 400.0, "type": "expense", "balance": 173132.0}, {"date": "2026-01-21", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Matt paint QTR for the 141-D Reception LED frame, as per email of Akram-", "amount": 1750.0, "type": "expense", "balance": 171382.0}, {"date": "2026-01-21", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid for the Tap changing of the Kettle, as instructed by Khaleeq Kamali-", "amount": 500.0, "type": "expense", "balance": 170882.0}, {"date": "2026-01-22", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 22-01-26", "amount": 245.0, "type": "expense", "balance": 170637.0}, {"date": "2026-01-22", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 06pairs of slippers 05 pairs for the GCR & 01 pair for the Gym, as per email of Shahbaz- 20-01-26", "amount": 2400.0, "type": "expense", "balance": 168237.0}, {"date": "2026-01-22", "bu": "Disrupt.Group", "category": "Disrupt.Group", "description": "Purchased 01 Lals chocolate (Gratitude Hamper) for the directors, as instructed by Kamran Haider-", "amount": 7401.0, "type": "expense", "balance": 160836.0}, {"date": "2026-01-22", "bu": "Disrupt.Group", "category": "Disrupt.Group", "description": "Purchased 01 flower bouquet for the directors, as instructed by Kamran Haider-", "amount": 7788.0, "type": "expense", "balance": 153048.0}, {"date": "2026-01-22", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the 140-H Pit motor repairing, as per email of Akram-", "amount": 1500.0, "type": "expense", "balance": 151548.0}, {"date": "2026-01-22", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 ball valve and 02Nos tefflon tape for the 141-C water line, as per email of Akram-", "amount": 1500.0, "type": "expense", "balance": 150048.0}, {"date": "2026-01-22", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the agreement photocopy, as instructed by Abrar bhai-", "amount": 80.0, "type": "expense", "balance": 149968.0}, {"date": "2026-01-22", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 06Nos Silicone gel & 02 PU Foam for the filling opne holes, as per email of Akram-", "amount": 4200.0, "type": "expense", "balance": 145768.0}, {"date": "2026-01-22", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased WD-40 (100ml) for the maintenance team, as instructed by Zohaib-", "amount": 600.0, "type": "expense", "balance": 145168.0}, {"date": "2026-01-22", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos IO Port & 01 IO face plate for the 140-H Reception, as per email of Akram-", "amount": 1200.0, "type": "expense", "balance": 143968.0}, {"date": "2026-01-22", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased boxing gloves for the (MOVE) Gym, as per the email of Khaleeq Kamali- 15-01-26", "amount": 2500.0, "type": "expense", "balance": 141468.0}, {"date": "2026-01-22", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02pair of Rod Clips for (MOVE) Gym, as per the email of Khaleeq Kamali- 15-01-26", "amount": 600.0, "type": "expense", "balance": 140868.0}, {"date": "2026-01-22", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the Kettle repairing (handle and thermostat) not working properly, for the 141-C cafe, as per the email of Khaleeq Kamali- 19-01-26", "amount": 800.0, "type": "expense", "balance": 140068.0}, {"date": "2026-01-23", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 23-01-26", "amount": 160.0, "type": "expense", "balance": 139908.0}, {"date": "2026-01-23", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 sink adjustable shower for 1st floor 141-D, as per email of Akram-", "amount": 550.0, "type": "expense", "balance": 139358.0}, {"date": "2026-01-23", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Paid to refill cylinder for Oxygen gas for AC maintenance team , as instructed by Akram-", "amount": 250.0, "type": "expense", "balance": 139108.0}, {"date": "2026-01-24", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid for washing 01 Prayer Mat (Dari) prayer area 141-C, as instructed by Khaleeq Kamali-", "amount": 500.0, "type": "expense", "balance": 138608.0}, {"date": "2026-01-24", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 04 acid bottles for the restroom cleaning, as instructed by Shahbaz-", "amount": 600.0, "type": "expense", "balance": 138008.0}, {"date": "2026-01-24", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the 8mm glass cutting for the exhaust fan installation at the 141-D 1st floor HR room entrance, as per email of Akram-", "amount": 2000.0, "type": "expense", "balance": 136008.0}, {"date": "2026-01-24", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the repair of a 7W light at 141-D (under the stairs), as instructed by Akram", "amount": 300.0, "type": "expense", "balance": 135708.0}, {"date": "2026-01-24", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchcased 01 (Silicone Splash guard with suction) for the cafe washing area 140-H, as per email of Shahbaz-", "amount": 1000.0, "type": "expense", "balance": 134708.0}, {"date": "2026-01-26", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 26-01-26", "amount": 385.0, "type": "expense", "balance": 134323.0}, {"date": "2026-01-26", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos 30W bulb for the 141-C Cafe, as per the email of Khaleeq Kamali- 16-01-26", "amount": 1300.0, "type": "expense", "balance": 133023.0}, {"date": "2026-01-26", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased lunch for the FranklinCovey training, as per the email of Sheheryar Ahmed Khan-", "amount": 8080.0, "type": "expense", "balance": 124943.0}, {"date": "2026-01-26", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the welding work at two parking doors, due to broken issue, as per the email of Akram-", "amount": 4000.0, "type": "expense", "balance": 120943.0}, {"date": "2026-01-26", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchase 04nos adhesive mouse trap books for mouse control on campus, as instructed by Shahbaz-", "amount": 500.0, "type": "expense", "balance": 120443.0}, {"date": "2026-01-26", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02 set commode seat clip, for male restroom, as per the email of Akram-", "amount": 700.0, "type": "expense", "balance": 119743.0}, {"date": "2026-01-26", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the Gyeser servicing for 140-H office, as per the email of Akram-", "amount": 3500.0, "type": "expense", "balance": 116243.0}, {"date": "2026-01-26", "bu": "Auto Os", "category": "Auto Os", "description": "Pay for Car Fuel fill-up  BYA-346, for the Auto OS team, as per email, closing balance is Rs. 8,000", "amount": 5000.0, "type": "expense", "balance": 111243.0}, {"date": "2026-01-26", "bu": "Disrupt Admin", "category": "Tea & Coffee", "description": "Purchased 01 box Johar Josahnda for the Disrupt Employees, as instructed by Adil Ghani-", "amount": 750.0, "type": "expense", "balance": 110493.0}, {"date": "2026-01-26", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 door latch for 2nd floor male restroom 141-D, as instructed by Akram-", "amount": 250.0, "type": "expense", "balance": 110243.0}, {"date": "2026-01-26", "bu": "Disrupt.Group", "category": "Disrupt.Group", "description": "Purchased lunch for the (Director Saad Gadit) meeting, as per email- 21-01-26", "amount": 25684.0, "type": "expense", "balance": 84559.0}, {"date": "2026-01-27", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 27-01-26", "amount": 775.0, "type": "expense", "balance": 83784.0}, {"date": "2026-01-27", "bu": "Disrupt Legal", "category": "Disrupt Legal", "description": "Purchased 02Nos E-Stamp paper worth Rs.1000, for the 140-H office agreement, as per email-", "amount": 2800.0, "type": "expense", "balance": 80984.0}, {"date": "2026-01-27", "bu": "Disrupt Legal", "category": "Disrupt Legal", "description": "Paid for the documents (Agreement printout (140-H office) for the Legal team, as per email-", "amount": 600.0, "type": "expense", "balance": 80384.0}, {"date": "2026-01-27", "bu": "Disrupt Legal", "category": "Disrupt Legal", "description": "Purchased 02Nos Stamp paper worth Rs.100, for the legal team, as per email-", "amount": 500.0, "type": "expense", "balance": 79884.0}, {"date": "2026-01-27", "bu": "Disrupt Legal", "category": "Disrupt Legal", "description": "Paid to make an Embossing Stamp (STELLARLAYER PRIVATE LIMITED) for the legal team, as per email-", "amount": 5000.0, "type": "expense", "balance": 74884.0}, {"date": "2026-01-27", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased tomatoes and cupcakes for use in administering medicine at night, as instructed by Shahbaz-", "amount": 100.0, "type": "expense", "balance": 74784.0}, {"date": "2026-01-27", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the spotlight repair for the 141-C reception outside wall, as instructed by Akram-", "amount": 400.0, "type": "expense", "balance": 74384.0}, {"date": "2026-01-28", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 28-01-26", "amount": 535.0, "type": "expense", "balance": 73849.0}, {"date": "2026-01-28", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for Mr. Zubair and the external guests, as per email-", "amount": 1440.0, "type": "expense", "balance": 72409.0}, {"date": "2026-01-28", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchaesd 01 Gallon oil paint # 1078, and sand paper for paint at parking plot # 03, as per email of Akram- 26-01-26", "amount": 6200.0, "type": "expense", "balance": 66209.0}, {"date": "2026-01-28", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01Nos 4Gang sheet, 03Nos Multi sheet & 02Nos IO with Face sheets, for the 140-H office, as per email- 27-01-26", "amount": 5330.0, "type": "expense", "balance": 60879.0}, {"date": "2026-01-28", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 door latch for 2nd floor male restroom 141-D, as instructed by Akram-", "amount": 250.0, "type": "expense", "balance": 60629.0}, {"date": "2026-01-28", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid for washing 11 Prayer Mat (Jaye Namaz) prayer area 141-C & GCR, as per email of Khaleeq Kamali-", "amount": 1100.0, "type": "expense", "balance": 59529.0}, {"date": "2026-01-29", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 29-01-26", "amount": 535.0, "type": "expense", "balance": 58994.0}, {"date": "2026-01-29", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 02Nos Mouse traps for the Genset Area 141-D, as per email of Khaleeq Kamali-", "amount": 1200.0, "type": "expense", "balance": 57794.0}, {"date": "2026-01-29", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased 01 Car cover for (BZH-449) as per the email of Khaleeq Kamali-", "amount": 3500.0, "type": "expense", "balance": 54294.0}, {"date": "2026-01-30", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 30-01-26", "amount": 160.0, "type": "expense", "balance": 54134.0}, {"date": "2026-01-30", "bu": "wellows", "category": "wellows", "description": "Purchased 01 Three Milk Cake as per ticket # 93895 & email - of Mohaddis Alam-", "amount": 4550.0, "type": "expense", "balance": 49584.0}, {"date": "2026-01-30", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos multi sheets for the 140-H basement, as per email-", "amount": 1800.0, "type": "expense", "balance": 47784.0}, {"date": "2026-01-30", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid rikshaw fare to Mr. Shahid 0304-2855011, for delivering the lights from Gizri to Kashmir road Disrupt office, as per email-", "amount": 600.0, "type": "expense", "balance": 47184.0}, {"date": "2026-01-30", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 01 serving tray for Cafeteria, as per email-", "amount": 2000.0, "type": "expense", "balance": 45184.0}, {"date": "2026-02-02", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 02-02-26", "amount": 845.0, "type": "expense", "balance": 44339.0}, {"date": "2026-02-02", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos Black Spray paint for the (140-H office) maintenance team, as instructed by Zohaib-", "amount": 750.0, "type": "expense", "balance": 43589.0}, {"date": "2026-02-02", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased a 01 holder for the 140-H office, as instructed by Zohaib-", "amount": 150.0, "type": "expense", "balance": 43439.0}, {"date": "2026-02-02", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid suzuki fare to Mr Asghar 0303-2561534 for (Disrupt Career Fair at Habib University) deliver the hoodie bags, as per email- 29-01-26", "amount": 2500.0, "type": "expense", "balance": 40939.0}, {"date": "2026-02-02", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid Suzuki fare to Mr Asghar 0303-2561534 for (Disrupt Career Fair at IBA Campus KU) deliver the hoodie bags, as per email-", "amount": 2500.0, "type": "expense", "balance": 38439.0}, {"date": "2026-02-02", "bu": "Squatwolf", "category": "Squatwolf", "description": "Purchased 02 pack of candies (Strawberry & cream flavor) for Squatwolf's birthday celebration, as per email 30-01-26", "amount": 360.0, "type": "expense", "balance": 38079.0}, {"date": "2026-02-02", "bu": "Squatwolf", "category": "Squatwolf", "description": "Purchased 01 pack of color balloons for Squatwolf's birthday celebration, as per email 30-01-26", "amount": 100.0, "type": "expense", "balance": 37979.0}, {"date": "2026-02-02", "bu": "Auto Os", "category": "Auto Os", "description": "Pay for Car Fuel fill-up  BYA-346, for the Auto OS team, as per email, closing balance is Rs. 3,000", "amount": 3000.0, "type": "expense", "balance": 34979.0}, {"date": "2026-02-02", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for Mr. Zubair and the external guests, as per email-", "amount": 1110.0, "type": "expense", "balance": 33869.0}, {"date": "2026-02-02", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the document color printout (Room Reservation for Director), as per the email of Shahbaz-", "amount": 250.0, "type": "expense", "balance": 33619.0}, {"date": "2026-02-02", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the document color printout (Room Reservation for foreigners), as per the email of Shahbaz-", "amount": 1700.0, "type": "expense", "balance": 31919.0}, {"date": "2026-02-02", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the document color printout (Work in Progress),  as per the email of Shahbaz-", "amount": 450.0, "type": "expense", "balance": 31469.0}, {"date": "2026-02-02", "bu": "Disrupt Procurement", "category": "Disrupt Procurement", "description": "Paid for Raashan offloading to Mr. Ali Ahmed 0328-2206787) - Disrupt Procurement", "amount": 4000.0, "type": "expense", "balance": 27469.0}, {"date": "2026-02-02", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 01pack of Mortein Glob, for reception deck at 140-H office, as instructed by Shahbaz-", "amount": 200.0, "type": "expense", "balance": 27269.0}, {"date": "2026-02-02", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased lunch for Aqib Zafar & Jonathan, as per the email-", "amount": 4060.0, "type": "expense", "balance": 23209.0}, {"date": "2026-02-02", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 08Nos Coke Zero Can & 03Nos Mirinda Can, for foreigners, as per email-", "amount": 1400.0, "type": "expense", "balance": 21809.0}, {"date": "2026-02-02", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased lunch for Sasha & Martin, as per the email-", "amount": 2791.0, "type": "expense", "balance": 19018.0}, {"date": "2026-02-02", "bu": "N-Dir Entertainment", "category": "N-Dir Entertainment", "description": "Purchased 01 cup of Tea and a Tuc biscuit half roll, for Umair Gadit, as instructed by Shahbaz-", "amount": 120.0, "type": "expense", "balance": 18898.0}, {"date": "2026-02-02", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Paid for the repair of the luggage bag for Sasha, as instructed by Shahbaz-", "amount": 100.0, "type": "expense", "balance": 18798.0}, {"date": "2026-02-03", "bu": "", "category": "", "description": "Cash Received from Finance", "amount": 154800.0, "type": "inflow", "balance": 173598.0}, {"date": "2026-02-03", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 03-02-26", "amount": 560.0, "type": "expense", "balance": 173038.0}, {"date": "2026-02-03", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 04Nos Coke zero Can for Aqib Zafar's lunch with foreigners, as per email-", "amount": 520.0, "type": "expense", "balance": 172518.0}, {"date": "2026-02-03", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased lunch for the foreign delegation (Sasha), as per the email-", "amount": 1669.0, "type": "expense", "balance": 170849.0}, {"date": "2026-02-03", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Commode machine, seat bolt & commode push button,", "amount": 2850.0, "type": "expense", "balance": 167999.0}, {"date": "2026-02-03", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased capsule light with bulb, for the 140-H UPS room backside area, as instructed by Akram-", "amount": 450.0, "type": "expense", "balance": 167549.0}, {"date": "2026-02-03", "bu": "Auto Os", "category": "Auto Os", "description": "Purchased 01 DP to HDMI 03 meter, & HDMI to mini connector, for Auto OS, team, as instructed by Shahbaz-", "amount": 1000.0, "type": "expense", "balance": 166549.0}, {"date": "2026-02-03", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01Nos 12'' Open light for the 140-H office, as per email of Akram-", "amount": 1750.0, "type": "expense", "balance": 164799.0}, {"date": "2026-02-04", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 03-02-26", "amount": 295.0, "type": "expense", "balance": 164504.0}, {"date": "2026-02-04", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos 1W ceiling light for 140-H meeting Pod, as instructed by Zohaib-", "amount": 750.0, "type": "expense", "balance": 163754.0}, {"date": "2026-02-04", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos  ceiling light for 140-H meeting Pod, as instructed by Zohaib-", "amount": 500.0, "type": "expense", "balance": 163254.0}, {"date": "2026-02-04", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for Mr. Zubair and the external guests, as per email-", "amount": 2360.0, "type": "expense", "balance": 160894.0}, {"date": "2026-02-04", "bu": "Disrupt Finance", "category": "Disrupt Finance", "description": "Paid for 20Nos color printout of Letterhead ( Stellarlayer PVT Ltd), as per email of Abdul Hai", "amount": 500.0, "type": "expense", "balance": 160394.0}, {"date": "2026-02-04", "bu": "Disrupt Finance", "category": "Disrupt Finance", "description": "Paid to make a stamp for  ( Stellarlayer PVT Ltd), as per email of Abdul Hai", "amount": 400.0, "type": "expense", "balance": 159994.0}, {"date": "2026-02-04", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 door stopper for 140-H Executive restroom door, as instructed by Akram-", "amount": 250.0, "type": "expense", "balance": 159744.0}, {"date": "2026-02-04", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the document's printout, as instructed by Ms Felicia-", "amount": 50.0, "type": "expense", "balance": 159694.0}, {"date": "2026-02-06", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 06-02-26", "amount": 40.0, "type": "expense", "balance": 159654.0}, {"date": "2026-02-06", "bu": "Gz Systems", "category": "Gz Systems", "description": "Purchased flower bouquet for the PVPN event, as per email-", "amount": 7000.0, "type": "expense", "balance": 152654.0}, {"date": "2026-02-06", "bu": "Gz Systems", "category": "Gz Systems", "description": "Paid for the rikshaw and bykea fare for (earbuds, sheilds & giveaways) delivery for the PVPN event, as per email-", "amount": 2250.0, "type": "expense", "balance": 150404.0}, {"date": "2026-02-06", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Paid labor charges for the (Ivacy room door repair & Lipping work at workstation) as per email-", "amount": 3000.0, "type": "expense", "balance": 147404.0}, {"date": "2026-02-06", "bu": "Disrupt Admin", "category": "Utilities Expenses", "description": "Pay to SKY Fast cable media monthly Cable fees 140-H (FEB)", "amount": 800.0, "type": "expense", "balance": 146604.0}, {"date": "2026-02-06", "bu": "Disrupt Admin", "category": "Utilities Expenses", "description": "Pay Salary to Mr. Shaharyar for monthly garbage collection of 140-H and 141-D & 141-C", "amount": 4000.0, "type": "expense", "balance": 142604.0}, {"date": "2026-02-09", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 09-02-26", "amount": 440.0, "type": "expense", "balance": 142164.0}, {"date": "2026-02-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01pc 100W light for 140-H Atrium, as per email- 02-01-26", "amount": 3500.0, "type": "expense", "balance": 138664.0}, {"date": "2026-02-09", "bu": "Disrupt Legal", "category": "Disrupt Legal", "description": "Purchased 04Nos E-Stamp paper worth Rs.1000, for the 142-F agreement, as per email-", "amount": 6000.0, "type": "expense", "balance": 132664.0}, {"date": "2026-02-09", "bu": "Disrupt Legal", "category": "Disrupt Legal", "description": "Paid for the documents (Agreement printout (142-F) for the Legal team, as per email-", "amount": 840.0, "type": "expense", "balance": 131824.0}, {"date": "2026-02-09", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the document color printout (Room Reservation for Director's), as instructed by Shahbaz- 05-02-26", "amount": 380.0, "type": "expense", "balance": 131444.0}, {"date": "2026-02-09", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid for the document color printout (for Onboarding), as instructed by Shahbaz- 07-02-26", "amount": 350.0, "type": "expense", "balance": 131094.0}, {"date": "2026-02-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Commode machine fitting & clip, as instructed by Zohaib- 07-02-26", "amount": 550.0, "type": "expense", "balance": 130544.0}, {"date": "2026-02-09", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 06 acid bottles for the 140-H Pool cleaning, as instructed by Shahbaz- 07-02-26", "amount": 1200.0, "type": "expense", "balance": 129344.0}, {"date": "2026-02-09", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for Mr. Zubair and the external guests, as per email-", "amount": 1280.0, "type": "expense", "balance": 128064.0}, {"date": "2026-02-09", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 06Nos Dasani water bottle for Ali Samir, as instructed by Khaleeq Kamali-", "amount": 310.0, "type": "expense", "balance": 127754.0}, {"date": "2026-02-09", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the color printout (Menu & room reservation) for foreign delegation, as per email-", "amount": 1400.0, "type": "expense", "balance": 126354.0}, {"date": "2026-02-10", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 10-02-26", "amount": 315.0, "type": "expense", "balance": 126039.0}, {"date": "2026-02-10", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos cabinet lock for the Admin room cabinet door's, as instructed by Zohaib-", "amount": 500.0, "type": "expense", "balance": 125539.0}, {"date": "2026-02-10", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Pay the airport parking fee to Sahib ur Rehman driver for picking up Ms Wajiha from the airport,", "amount": 120.0, "type": "expense", "balance": 125419.0}, {"date": "2026-02-10", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Pay the airport parking fee to Sahib ur Rehman driver for picking up Ali Samir from the airport, 09-02-26", "amount": 120.0, "type": "expense", "balance": 125299.0}, {"date": "2026-02-10", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 02 cups of Tea for Umair Gadit and Ovais bhai, as instructed by Shahbaz-", "amount": 160.0, "type": "expense", "balance": 125139.0}, {"date": "2026-02-10", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 01pack of Mortein Glob, for reception deck at 140-H office, as instructed by Shahbaz-", "amount": 200.0, "type": "expense", "balance": 124939.0}, {"date": "2026-02-10", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 06Nos Dasani water bottle for Ali Samir, as instructed by Khaleeq Kamali-", "amount": 342.0, "type": "expense", "balance": 124597.0}, {"date": "2026-02-10", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 door stopper, for the 140-H office, as instructed by Zohaib-", "amount": 250.0, "type": "expense", "balance": 124347.0}, {"date": "2026-02-10", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the color printout (room reservation) for the foreign delegation, as instructed by Shahbaz-", "amount": 100.0, "type": "expense", "balance": 124247.0}, {"date": "2026-02-10", "bu": "Disrupt Admin", "category": "Water & Sewerage", "description": "Purchase a water tanker to refill the tank of 140-H- office as per email- 09-02-26", "amount": 5000.0, "type": "expense", "balance": 119247.0}, {"date": "2026-02-10", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchase of one foot valve (PKR 4,200) and one Teflon tape (PKR 50), along with installation labor charges (PKR 1,000), as per email-", "amount": 5250.0, "type": "expense", "balance": 113997.0}, {"date": "2026-02-10", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Repair of electric water geyser at 141-D office, including labor charges, as per email-", "amount": 4000.0, "type": "expense", "balance": 109997.0}, {"date": "2026-02-10", "bu": "N-Dir Entertainment", "category": "N-Dir Entertainment", "description": "Purchased lunch for Rashid uncle's meeting with guest, as per email-", "amount": 1687.0, "type": "expense", "balance": 108310.0}, {"date": "2026-02-11", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 11-02-26", "amount": 465.0, "type": "expense", "balance": 107845.0}, {"date": "2026-02-11", "bu": "Auto Os", "category": "Auto Os", "description": "Purchased 01Nos OTG for the Auto Os team, as instructed by Shahbaz-", "amount": 150.0, "type": "expense", "balance": 107695.0}, {"date": "2026-02-11", "bu": "Auto Os", "category": "Auto Os", "description": "Purchased 01 USB Tester Type-C for the Auto Os team, as instructed by Shahbaz-", "amount": 1900.0, "type": "expense", "balance": 105795.0}, {"date": "2026-02-11", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for Mr. Zubair and the external guests, as per email-", "amount": 6498.0, "type": "expense", "balance": 99297.0}, {"date": "2026-02-11", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased lunch for the Al-Hilal Invest team as per ticket # 94083 of Faaz Azeem", "amount": 1080.0, "type": "expense", "balance": 98217.0}, {"date": "2026-02-11", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased 03 cold drinks for the Al-Hilal Invest team as per ticket # 94083 of Faaz Azeem-", "amount": 240.0, "type": "expense", "balance": 97977.0}, {"date": "2026-02-11", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased lunch for Aaqib Gadit's meeting with John & Aqib Zafar, as per email-", "amount": 2560.0, "type": "expense", "balance": 95417.0}, {"date": "2026-02-11", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased refreshments (Subway cookies Rs.520, local shop mirinda can2, chips 01, biscuits 2 Rs.460) for Emre, as per email-", "amount": 980.0, "type": "expense", "balance": 94437.0}, {"date": "2026-02-11", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased refreshments for Ali Samir, as per email-", "amount": 590.0, "type": "expense", "balance": 93847.0}, {"date": "2026-02-11", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 door stopper, for the 140-H office, as instructed by Zohaib-", "amount": 200.0, "type": "expense", "balance": 93647.0}, {"date": "2026-02-12", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 12-02-26", "amount": 490.0, "type": "expense", "balance": 93157.0}, {"date": "2026-02-12", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the repair of 100W shade light for 141-C assembly area, as per email-", "amount": 1200.0, "type": "expense", "balance": 91957.0}, {"date": "2026-02-12", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 06Nos Dasani water bottle for Ali Samir, as instructed by Khaleeq Kamali-", "amount": 343.0, "type": "expense", "balance": 91614.0}, {"date": "2026-02-12", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos channel patti 3/4 for work at Legal room, as instructed by Akram-", "amount": 400.0, "type": "expense", "balance": 91214.0}, {"date": "2026-02-13", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 13-02-26", "amount": 100.0, "type": "expense", "balance": 91114.0}, {"date": "2026-02-13", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 06Nos Dasani water bottle for Ali Samir, as instructed by Khaleeq Kamali-", "amount": 360.0, "type": "expense", "balance": 90754.0}, {"date": "2026-02-13", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Paid Labor charges to Mr. Abdul Rehman for lipping installation in room # 6 & 11m as per email-", "amount": 1500.0, "type": "expense", "balance": 89254.0}, {"date": "2026-02-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 (switch button sheet) for the Gym, as per email-", "amount": 750.0, "type": "expense", "balance": 88504.0}, {"date": "2026-02-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 door latch for 2nd floor male restroom 141-D, as instructed by Akram-", "amount": 200.0, "type": "expense", "balance": 88304.0}, {"date": "2026-02-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 commode machine Clip, for the 141-Dd 1st floor female restroom, as instructed by Akram-", "amount": 250.0, "type": "expense", "balance": 88054.0}, {"date": "2026-02-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 fan grill for the Gym wall mounted fan, as per email-", "amount": 1200.0, "type": "expense", "balance": 86854.0}, {"date": "2026-02-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Black oil paint for the gym fan paint, as instructed by Akram-", "amount": 350.0, "type": "expense", "balance": 86504.0}, {"date": "2026-02-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to repair the drill machine for the maintenance team, as instructed by Akram-", "amount": 400.0, "type": "expense", "balance": 86104.0}, {"date": "2026-02-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchacsed 01, 100W Flood light for the 141-D street, as per email-", "amount": 4000.0, "type": "expense", "balance": 82104.0}, {"date": "2026-02-14", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos multi sheet (Clopal) for the 140-H waiting area, as per the email-", "amount": 1800.0, "type": "expense", "balance": 80304.0}, {"date": "2026-02-16", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 16-02-26", "amount": 440.0, "type": "expense", "balance": 79864.0}, {"date": "2026-02-16", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Paid for the passport-size photo for Ilian, as per email-", "amount": 120.0, "type": "expense", "balance": 79744.0}, {"date": "2026-02-16", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Paid KCCI fee for Ilian, as per email-", "amount": 2000.0, "type": "expense", "balance": 77744.0}, {"date": "2026-02-16", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased one Mortein machine along with a 30-night refill for mosquito control purposes, for 140-H, as instructed by Shahbaz-", "amount": 620.0, "type": "expense", "balance": 77124.0}, {"date": "2026-02-16", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01Nos, 3'' 7W ceiling light white, for 140H pod meeting, as instructed by Zohaib-", "amount": 350.0, "type": "expense", "balance": 76774.0}, {"date": "2026-02-16", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid Suzuki fare to Rafiq Ahmed 0300-2197273 for (Disrupt Career Fair at Fast University) deliver the hoodie bags, as per email- 11-02-26", "amount": 4500.0, "type": "expense", "balance": 72274.0}, {"date": "2026-02-16", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased WD-40 (100ml) for the maintenance team, as instructed by Zohaib-", "amount": 550.0, "type": "expense", "balance": 71724.0}, {"date": "2026-02-16", "bu": "Disrupt Admin", "category": "Water & Sewerage", "description": "Purchase a water tanker to refill the tank of 140-H- office as per email-", "amount": 7500.0, "type": "expense", "balance": 64224.0}, {"date": "2026-02-16", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased 03 Nos Fizzup Rs. 600, 02 Tennis ball Rs. 200 & 01 fries Rs. 200) for the February Birthday Celebration, as per email-", "amount": 1000.0, "type": "expense", "balance": 63224.0}, {"date": "2026-02-17", "bu": "", "category": "", "description": "Cash Received from Finance", "amount": 119600.0, "type": "inflow", "balance": 182824.0}, {"date": "2026-02-17", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 17-02-26", "amount": 335.0, "type": "expense", "balance": 182489.0}, {"date": "2026-02-17", "bu": "Legal Entertainment", "category": "Legal Entertainment", "description": "Purchased Tea Rs.160 11-02-26, (Tea Rs.800, Yogurt Rs.290, Salad Rs.150 12-02-26) Tea Rs. 240 13-02-26) For Ovais bhai, as per email-", "amount": 1640.0, "type": "expense", "balance": 180849.0}, {"date": "2026-02-17", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Paid for Door repair work at 140-H office,  (Saad & Umair Gadit's room door) and 1 more door or room # 8, as per email-", "amount": 4500.0, "type": "expense", "balance": 176349.0}, {"date": "2026-02-18", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 18-02-26", "amount": 415.0, "type": "expense", "balance": 175934.0}, {"date": "2026-02-18", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Paid for the (Learning Center) door repairing work, 141-D, as per email-", "amount": 1500.0, "type": "expense", "balance": 174434.0}, {"date": "2026-02-18", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Spindle for the 140-H Cafe washing area tap, as per email-", "amount": 650.0, "type": "expense", "balance": 173784.0}, {"date": "2026-02-18", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 commode tank float (Mandak) for the ground floor restroom 141-D, as instructed by Akram-", "amount": 250.0, "type": "expense", "balance": 173534.0}, {"date": "2026-02-18", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 pair of Battery Clips for UPS room 140-H, as instructed by Zohaib-", "amount": 150.0, "type": "expense", "balance": 173384.0}, {"date": "2026-02-18", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01Nos, 3'' 7W ceiling light white, for 140H pod meeting, as instructed by Zohaib-", "amount": 200.0, "type": "expense", "balance": 173184.0}, {"date": "2026-02-18", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to H.M Interior for the repair of the roller blind in Room 17 at 140-H office, as per email-", "amount": 4000.0, "type": "expense", "balance": 169184.0}, {"date": "2026-02-18", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 50W flood light & a 2-pin plug for the 141-C Reception roof, as per email-", "amount": 2550.0, "type": "expense", "balance": 166634.0}, {"date": "2026-02-18", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Sink Tap & 01 flexible shower for the 140-H Cafe washing area, as per email-", "amount": 2550.0, "type": "expense", "balance": 164084.0}, {"date": "2026-02-18", "bu": "Disrupt Admin", "category": "Stationery", "description": "Purchased 01 (Quran Sharif) set for the Office Mosque, as instructed by Shahbaz", "amount": 2500.0, "type": "expense", "balance": 161584.0}, {"date": "2026-02-19", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased four (04) dammar tapes for marking prayer rows (saff) in the Cafeteria 140-H, as per email-", "amount": 600.0, "type": "expense", "balance": 160984.0}, {"date": "2026-02-19", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the color printout on A3 paper (Male Temporary Prayer Area), with lamination, for 140-H, as per email-", "amount": 400.0, "type": "expense", "balance": 160584.0}, {"date": "2026-02-19", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid for the Bio Metric verification of Hamza Ali for vehicle ( BXM-779) transfer to Gaditek, as per email-", "amount": 350.0, "type": "expense", "balance": 160234.0}, {"date": "2026-02-19", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased  medicine (Enterogermina) for the foreign employee, as per the email of Khaleeq Kamali-", "amount": 290.0, "type": "expense", "balance": 159944.0}, {"date": "2026-02-19", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 40Nos Dummy Breaker (Rs. 3200) & paid bykea charges (Rs. 300) for delivering these items to the office, as per email of Akram- 06-02-26", "amount": 3500.0, "type": "expense", "balance": 156444.0}, {"date": "2026-02-20", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 04Nos Soap Dispenser for both offices, Cafeteria washing area, as per email-", "amount": 1260.0, "type": "expense", "balance": 155184.0}, {"date": "2026-02-20", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid Bykea delivery charges for transporting the POD light from the vendor’s shop, as instructed by Zohaib-", "amount": 300.0, "type": "expense", "balance": 154884.0}, {"date": "2026-02-23", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 03Kg hypo for the restroom cleaning, as instructed by Khaleeq Kamali- 21-02-26", "amount": 450.0, "type": "expense", "balance": 154434.0}, {"date": "2026-02-23", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 commode push button set for the 141-D ground floor restroom, as instructed by Akram-", "amount": 450.0, "type": "expense", "balance": 153984.0}, {"date": "2026-02-24", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid for washing the prayer mat (Dari) for prayer area 141-C as instructed by Khaleeq Kamali-", "amount": 500.0, "type": "expense", "balance": 153484.0}, {"date": "2026-02-24", "bu": "Disrupt Finance", "category": "Disrupt Finance", "description": "Purchased Iftari for the finance team, as per email of S Mohsin Ahmed-", "amount": 1000.0, "type": "expense", "balance": 152484.0}, {"date": "2026-02-25", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Paid for the (Cafe glass door repairing) 141-C cafe, as per email-", "amount": 1500.0, "type": "expense", "balance": 150984.0}, {"date": "2026-02-25", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased (Gift) cookies for the TA Team, as per email of Sanober Arif-", "amount": 1760.0, "type": "expense", "balance": 149224.0}, {"date": "2026-02-25", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased (Gift) flower bouquet for the TA Team, as per email of Sanober Arif-", "amount": 1500.0, "type": "expense", "balance": 147724.0}, {"date": "2026-02-26", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 06Nos 15W 4k light for the 140-H Director's floor, as per email- 24-02-26", "amount": 4500.0, "type": "expense", "balance": 143224.0}, {"date": "2026-02-26", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 05Nos 15W 4k light for the 140-H Director's floor, as per email- 26-02-26", "amount": 3250.0, "type": "expense", "balance": 139974.0}, {"date": "2026-02-26", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased waste pipe (Drain strainer) for 141-C, cafe, as instructed by Akram-", "amount": 300.0, "type": "expense", "balance": 139674.0}, {"date": "2026-02-26", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchase of one (01) tag cassette formaintenance team general use, tagging purpose, as per email-", "amount": 1950.0, "type": "expense", "balance": 137724.0}, {"date": "2026-02-28", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 12.5Kg hypo and 01Kg castic soda for the restroom cleaning, as instructed by Khaleeq Kamali-", "amount": 1000.0, "type": "expense", "balance": 136724.0}, {"date": "2026-03-02", "bu": "Disrupt Legal", "category": "Disrupt Legal", "description": "Purchased 02Nos E-Stamp paper worth Rs.1000, for the 141-C agreement, as per email- 02-03-26", "amount": 2300.0, "type": "expense", "balance": 134424.0}, {"date": "2026-03-03", "bu": "Employee Welfare Fund", "category": "Employee Welfare Fund", "description": "Purchased water bottles (QTY 99) for the facilitation of funeral (Father of Ahsan Hussain), as per email- 03-03-26", "amount": 4015.0, "type": "expense", "balance": 130409.0}, {"date": "2026-03-03", "bu": "Employee Welfare Fund", "category": "Employee Welfare Fund", "description": "Purchased water bottles (QTY 100) for the facilitation of funeral (Father of Ahsan Hussain), as per email- 03-03-26", "amount": 4721.0, "type": "expense", "balance": 125688.0}, {"date": "2026-03-03", "bu": "Employee Welfare Fund", "category": "Employee Welfare Fund", "description": "Paid for the (Tent and related items)for the of funeral (Father of Ahsan Hussain), as per email- 03-03-26", "amount": 11500.0, "type": "expense", "balance": 114188.0}, {"date": "2026-03-04", "bu": "Disrupt Legal", "category": "Disrupt Legal", "description": "Paid for the documents (printout) for the Legal team, as per email- 04-03-26", "amount": 5700.0, "type": "expense", "balance": 108488.0}, {"date": "2026-03-04", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 09Nos counter for the general use, as instructed by Khaleeq Kamali-", "amount": 900.0, "type": "expense", "balance": 107588.0}, {"date": "2026-03-09", "bu": "Disrupt Procurement", "category": "Disrupt Procurement", "description": "Paid for Raashan offloading to Mr. Ijaz Ahmed 0347-0246990 - Disrupt Procurement 09-03-26", "amount": 4000.0, "type": "expense", "balance": 103588.0}, {"date": "2026-03-09", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid for washing the prayer mat (Dari) for prayer area 141-C as instructed by Khaleeq Kamali- 09-03-26", "amount": 500.0, "type": "expense", "balance": 103088.0}, {"date": "2026-03-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to Shani Aluminum, for 141-D 1st floor, male restroom door machine change, as per email-", "amount": 10000.0, "type": "expense", "balance": 93088.0}, {"date": "2026-03-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Charger Shu and a Type C cable for Pod meeting room tablet installation, as per email-", "amount": 1300.0, "type": "expense", "balance": 91788.0}, {"date": "2026-03-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Plug for the installation of Charger at 140-H Pod meeting room, as per email-", "amount": 100.0, "type": "expense", "balance": 91688.0}, {"date": "2026-03-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased Plants (lady palm, snake plant, Dracaena, Maharaja Dracaena) etc for the 140-H office, as per email- 04-02-26", "amount": 6000.0, "type": "expense", "balance": 85688.0}, {"date": "2026-03-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased plants (Jade, Agaib, Kewhra, English Crutan, Soil, transportation charges, etc.) for the 140-H office, as per email- 04-02-26", "amount": 23000.0, "type": "expense", "balance": 62688.0}, {"date": "2026-03-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased stone bags for the 140-H office, as per email- 04-02-26", "amount": 6900.0, "type": "expense", "balance": 55788.0}, {"date": "2026-03-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos Garden sheets, for teh 140-H office, as per email- 05-02-26", "amount": 1000.0, "type": "expense", "balance": 54788.0}, {"date": "2026-03-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased plants (Marigold (Gainda), Anthurium, Petunia) etc, for the 140-H office, as per email- 06-02-26", "amount": 2940.0, "type": "expense", "balance": 51848.0}, {"date": "2026-03-09", "bu": "G&A Services", "category": "G&A Services", "description": "Purchased 15Nos drinks for the internal team meeting with Saad Gadit, as per email- 13-02-26", "amount": 1200.0, "type": "expense", "balance": 50648.0}, {"date": "2026-03-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to Mr. Arif Iron works, for the stair repairing (welding) work at 141-D roof, as per email- 25-02-26", "amount": 7000.0, "type": "expense", "balance": 43648.0}, {"date": "2026-03-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02 coil of 3/29 wire for the 140-H director's floor new wiring (Neutral wire) installation, as per email 25-02-26", "amount": 5000.0, "type": "expense", "balance": 38648.0}, {"date": "2026-03-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 coil of 7/29 wire for the 140-H director's floor new wiring (Neutral wire) installation, as per email 26-02-26", "amount": 4700.0, "type": "expense", "balance": 33948.0}, {"date": "2026-03-09", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Paid to Sahib ur Rehman for iftari, due to late sitting in office due to some work, as instructed by Khaleeq Kamali- 26-02-26", "amount": 300.0, "type": "expense", "balance": 33648.0}, {"date": "2026-03-09", "bu": "Disrupt Admin", "category": "ADM - Fare Allowance", "description": "Paid bykea fare to Sahib ur Rehman, as instructed by Khaleeq Kamali- 26-02-26", "amount": 280.0, "type": "expense", "balance": 33368.0}, {"date": "2026-03-10", "bu": "Auto Os", "category": "Auto Os", "description": "Pay for Car Fuel fill-up  BYA-346, for the Auto OS team, as per email, closing balance is Rs. 3,000", "amount": 3000.0, "type": "expense", "balance": 30368.0}, {"date": "2026-03-10", "bu": "Disrupt Admin", "category": "Utilities Expenses", "description": "Pay Salary to Mr. Abdullah for monthly garbage collection of 140-H and 141-D & 141-C", "amount": 4000.0, "type": "expense", "balance": 26368.0}, {"date": "2026-03-11", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchase of chrome polish for removing rust from various items including Muslim shower pipes, taps, dustbins, stainless steel chair bases, and floor door machines, as per email-", "amount": 1500.0, "type": "expense", "balance": 24868.0}, {"date": "2026-03-11", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased a pipe for the replacement of the damaged diesel fuel tank pipe & clips, as per email-", "amount": 4040.0, "type": "expense", "balance": 20828.0}, {"date": "2026-03-11", "bu": "Disrupt Admin", "category": "R&M - Equipments Admin", "description": "Purchased 03 coolant water bottles for genset radiators, as per email-", "amount": 750.0, "type": "expense", "balance": 20078.0}, {"date": "2026-03-11", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01Nos E Delux 03'' light for 2nd floor 141-D male restroom, as instructed by Akram-", "amount": 500.0, "type": "expense", "balance": 19578.0}, {"date": "2026-03-11", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 02 Nos sanitizer for the Kashif Siddiqui's room, as per email-", "amount": 500.0, "type": "expense", "balance": 19078.0}, {"date": "2026-03-11", "bu": "Gz Systems", "category": "Gz Systems", "description": "Purchased 15Nos Fruit Chat for PVPN team Iftar dinner arrangements, as per email- 02-03-26", "amount": 2550.0, "type": "expense", "balance": 16528.0}, {"date": "2026-03-11", "bu": "Gz Systems", "category": "Gz Systems", "description": "Purchased 01 Khajoor Box for PVPN team Iftar dinner arrangements, as per email- 02-03-26", "amount": 400.0, "type": "expense", "balance": 16128.0}, {"date": "2026-03-12", "bu": "", "category": "", "description": "Cash Received from Finance", "amount": 166600.0, "type": "inflow", "balance": 182728.0}, {"date": "2026-03-12", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Nos 50AMP Oppas breaker for the 140-H campus, as per email-", "amount": 4500.0, "type": "expense", "balance": 178228.0}, {"date": "2026-03-12", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 power cable for MOVE (Gym) treadmill, as per email-", "amount": 500.0, "type": "expense", "balance": 177728.0}, {"date": "2026-03-12", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to M. Arif Iron Works for the material (pipe etc) for installation of Safety Grills at 141-D roof, as per email- 11-03-26", "amount": 9000.0, "type": "expense", "balance": 168728.0}, {"date": "2026-03-12", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to M. Arif Iron Works for the labor charges of installation of Safety Grills at 141-D roof, as per email- 11-03-26", "amount": 9000.0, "type": "expense", "balance": 159728.0}, {"date": "2026-03-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to H.M Interior for repairing the blinds (controller Dori, Mechanism change with servicing), for 140-H office Room # 8 (03blinds) & room #  10 blind), as per email-", "amount": 6000.0, "type": "expense", "balance": 153728.0}, {"date": "2026-03-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to H.M Interior for repairing the blinds (controller Dori, Mechanism change with servicing), for 141-D office Room # 3 Admin room, romm # 21 & room # 32, as per email -", "amount": 7000.0, "type": "expense", "balance": 146728.0}, {"date": "2026-03-13", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased a Haier AC Innwe blower motor for 141-D, HR Room, as per email-", "amount": 4000.0, "type": "expense", "balance": 142728.0}, {"date": "2026-03-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Gallon Mat black oil paint for the gym fans, as per the email-", "amount": 4000.0, "type": "expense", "balance": 138728.0}, {"date": "2026-03-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Selector box & a screw box for the replacement of UPS changeover in 140-H office, as per email-", "amount": 1000.0, "type": "expense", "balance": 137728.0}, {"date": "2026-03-14", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 03Kg hypo and 03 Acid bottles for the restroom cleaning, as instructed by Shahbaz-", "amount": 900.0, "type": "expense", "balance": 136828.0}, {"date": "2026-03-16", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the Gym wall (Green Grass Wall) repaired, as per the email-", "amount": 2200.0, "type": "expense", "balance": 134628.0}, {"date": "2026-03-16", "bu": "Auto Os", "category": "Auto Os", "description": "Paid for the Laptop courier via TCS to Yasir Khan (Abbottabad) CN # 306063835986, as per ticket # 94508 of Yasir Khan-", "amount": 4885.0, "type": "expense", "balance": 129743.0}, {"date": "2026-03-16", "bu": "Disrupt Admin", "category": "Utilities Expenses", "description": "Pay to SKY Fast cable media monthly Cable fees 140-H (MAR)", "amount": 800.0, "type": "expense", "balance": 128943.0}, {"date": "2026-03-16", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos 32Amp 2 Pole breaker for the 141-D UPS room, as per email-", "amount": 3380.0, "type": "expense", "balance": 125563.0}, {"date": "2026-03-17", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 04Nos door stoppers for general use, as instructed by Akram-", "amount": 1000.0, "type": "expense", "balance": 124563.0}, {"date": "2026-03-18", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Paid for the door repair work at 140-H 1st floor, as per email-", "amount": 4000.0, "type": "expense", "balance": 120563.0}, {"date": "2026-03-19", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid for washing the prayer mat (Dari) for prayer area 141-C as instructed by Khaleeq Kamali-", "amount": 500.0, "type": "expense", "balance": 120063.0}, {"date": "2026-03-19", "bu": "Disrupt Admin", "category": "R&M - Equipments Admin", "description": "Purchased 01 carton of distilled water for UPS battery water refilling at both offices, as per email-", "amount": 1000.0, "type": "expense", "balance": 119063.0}, {"date": "2026-03-19", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 02 acid bottles for the 140-H Pool cleaning, as instructed by Shahbaz-", "amount": 300.0, "type": "expense", "balance": 118763.0}, {"date": "2026-03-24", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 24-03-26", "amount": 75.0, "type": "expense", "balance": 118688.0}, {"date": "2026-03-24", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid for the gift voucher color printout, for Shayan Raees, as instructed by Shahbaz, requested by Sanober Arif-", "amount": 100.0, "type": "expense", "balance": 118588.0}, {"date": "2026-03-24", "bu": "Auto Os", "category": "Auto Os", "description": "Pay for Car Fuel fill-up  BYA-346, for the Auto OS team, as per email, closing balance is Rs. 5,000", "amount": 2000.0, "type": "expense", "balance": 116588.0}, {"date": "2026-03-24", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01Nos bit for the maintenance team, as instructed by Akram-", "amount": 200.0, "type": "expense", "balance": 116388.0}, {"date": "2026-03-24", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased a tarpaulin shade (15 × 18) to cover the Atrium glass at 141-D as a precaution against rain, as per email", "amount": 4000.0, "type": "expense", "balance": 112388.0}, {"date": "2026-03-24", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased rope for the fixing of the net shade, as per email-", "amount": 250.0, "type": "expense", "balance": 112138.0}, {"date": "2026-03-24", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 06Nos rawal bolt for the AC maintenance team, as instructed by Akram-", "amount": 480.0, "type": "expense", "balance": 111658.0}, {"date": "2026-03-24", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Nos 80AMP Oppas breaker for the 140-H campus Basement DB, as per email-", "amount": 9700.0, "type": "expense", "balance": 101958.0}, {"date": "2026-03-24", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the removal of frosted paper from 2nd floor UPS room door and window, 141-D, as per email", "amount": 2000.0, "type": "expense", "balance": 99958.0}, {"date": "2026-03-24", "bu": "Disrupt.Group", "category": "General Maintenance", "description": "Purchased dinner for 33 persons (Admin and Director Residence staff) on the 1st day of Eid, as instructed by Shahbaz", "amount": 24750.0, "type": "expense", "balance": 75208.0}, {"date": "2026-03-25", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 25-03-26", "amount": 545.0, "type": "expense", "balance": 74663.0}, {"date": "2026-03-25", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01Nos AC gas charging line for the AC maintenance team, as per email-", "amount": 2300.0, "type": "expense", "balance": 72363.0}, {"date": "2026-03-25", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 baby grinder for the AC maintenance team, as per email-", "amount": 4200.0, "type": "expense", "balance": 68163.0}, {"date": "2026-03-25", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 15 pairs of Push & Pull stickers for both offices, as per email-", "amount": 2250.0, "type": "expense", "balance": 65913.0}, {"date": "2026-03-25", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "“Paid for the repair of the Karcher nozzle, for the AC maintenance team, as instructed by Akram-", "amount": 750.0, "type": "expense", "balance": 65163.0}, {"date": "2026-03-26", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 26-03-26", "amount": 335.0, "type": "expense", "balance": 64828.0}, {"date": "2026-03-26", "bu": "Auto Os", "category": "Auto Os", "description": "Purchased 02Nos 64GB SD cards for the Auto Os team, as instructed by Shahbaz- 13-03-26", "amount": 5200.0, "type": "expense", "balance": 59628.0}, {"date": "2026-03-26", "bu": "Auto Os", "category": "Auto Os", "description": "Purchased 05Nos SD card Jacks for the Auto Os team, as instructed by Shahbaz- 25-03-26", "amount": 250.0, "type": "expense", "balance": 59378.0}, {"date": "2026-03-26", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for maintenance work of the 141-C pool, including cleaning of the choked line and replacement of damaged nozzles, as per email-", "amount": 3000.0, "type": "expense", "balance": 56378.0}, {"date": "2026-03-26", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to Mr. Arif for dismantling of the damaged shed at 141-C, as per email- 19-03-26", "amount": 5000.0, "type": "expense", "balance": 51378.0}, {"date": "2026-03-26", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased 05 Nos. Fizz Up drinks (1.5 ltr), 03 Nos. Lemon Malt, and 02 Nos. Pineapple Malt for the birthday celebration of employees whose birthdays fall in March, as per email-", "amount": 1080.0, "type": "expense", "balance": 50298.0}, {"date": "2026-03-26", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to Mr. Arif for guard restroom door repair, as per email-", "amount": 1500.0, "type": "expense", "balance": 48798.0}, {"date": "2026-03-27", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 27-03-26", "amount": 40.0, "type": "expense", "balance": 182758.0}, {"date": "2026-03-27", "bu": "Auto Os", "category": "Auto Os", "description": "Paid for the couerier (lan cable) via TCS to Mr Yasir Khan (Abbotabad) CN # 306063836690, as instructed by Shahbaz-", "amount": 620.0, "type": "expense", "balance": 182138.0}, {"date": "2026-03-27", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 12Nos Green round stickers for pasting on glass for both offices, as instructed by Akram-", "amount": 400.0, "type": "expense", "balance": 181738.0}, {"date": "2026-03-27", "bu": "Auto Os", "category": "Auto Os", "description": "Pay for Car Fuel fill-up  BYA-346, for the Auto OS team, as per email, closing balance is Rs. 7,000", "amount": 2000.0, "type": "expense", "balance": 179738.0}, {"date": "2026-03-27", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased 02Nos Gatorade Sport Drink Blue Bolt, for the birthday celebration of March (Disrupt employees) as instructed by Khaleeq Kamali-", "amount": 180.0, "type": "expense", "balance": 179558.0}, {"date": "2026-03-27", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the Gym 20 Feet Gym Machine wire purchase + fixation charges, as instructed by Kamran Haider-", "amount": 3600.0, "type": "expense", "balance": 175958.0}, {"date": "2026-03-30", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 30-03-26", "amount": 85.0, "type": "expense", "balance": 175873.0}, {"date": "2026-03-30", "bu": "Gz Systems", "category": "Gz Systems", "description": "Purchased Onboarding staff lunch (3539 Syed Muhammad Sherjeel (secure.com) with Waseem Ahmed, as per ticekt # 94665, of Sanober Arif-", "amount": 2500.0, "type": "expense", "balance": 173373.0}, {"date": "2026-03-30", "bu": "Disrupt Admiin", "category": "General Maintenance", "description": "Purchased 01 bulb 100W and 01 holder for the maintenance team, as instructed by Akram-", "amount": 150.0, "type": "expense", "balance": 173223.0}, {"date": "2026-03-31", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 31-03-26", "amount": 300.0, "type": "expense", "balance": 172923.0}, {"date": "2026-03-31", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased tools (01 cutter, 02 plyer, 04 screw driver) for the maintenance team, as per email-", "amount": 4030.0, "type": "expense", "balance": 168893.0}, {"date": "2026-03-31", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 exhaust fan motor for the 140-H male restroom, as per email-", "amount": 2200.0, "type": "expense", "balance": 166693.0}, {"date": "2026-03-31", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 door closer for the female restroom 141-D, as per email-", "amount": 1500.0, "type": "expense", "balance": 165193.0}, {"date": "2026-03-31", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the Gym equipment change (80feet wire, pulley) and labor charges, as per email-", "amount": 14000.0, "type": "expense", "balance": 151193.0}, {"date": "2026-03-31", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the color printout (Room Reservation), as instructed by Shahbaz-", "amount": 150.0, "type": "expense", "balance": 151043.0}, {"date": "2026-04-01", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 01-04-26", "amount": 300.0, "type": "expense", "balance": 150743.0}, {"date": "2026-04-01", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased 01 AC gas pressure gauge for AC maintenance team, as per email", "amount": 1950.0, "type": "expense", "balance": 148793.0}, {"date": "2026-04-01", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 140-H front 30 x 100 = 3000, 19-Feb-2026 to 20-Mar-2026 (30 days of Ramzan)", "amount": 3000.0, "type": "expense", "balance": 145793.0}, {"date": "2026-04-01", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 141-D front 30 x 100 = 3000 , 19-Feb-2026 to 20-Mar-2026 (30 days of Ramzan)", "amount": 3000.0, "type": "expense", "balance": 142793.0}, {"date": "2026-04-01", "bu": "Auto Os", "category": "Auto Os", "description": "Paid for the courier dispatch via TCS CN # 306063841372 to M Rizwan-  Faisalabad, as requested by Ammar Gadit, instructed by Shahbaz- 30-03-26", "amount": 3400.0, "type": "expense", "balance": 139393.0}, {"date": "2026-04-01", "bu": "Auto Os", "category": "Auto Os", "description": "Paid for the courier dispatch via TCS CN # 306063841373 to M Rizwan-  Faisalabad, as requested by Ammar Gadit, instructed by Shahbaz- 30-03-26", "amount": 1000.0, "type": "expense", "balance": 138393.0}, {"date": "2026-04-01", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos spotlight for the 140-H garden area, as per email-", "amount": 1700.0, "type": "expense", "balance": 136693.0}, {"date": "2026-04-01", "bu": "Gz Systems", "category": "Gz Systems", "description": "Purchased  refreshments for the (Google Team) visit, as per the email of Tayyeba Memon-", "amount": 3660.0, "type": "expense", "balance": 133033.0}, {"date": "2026-04-01", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02kg of chalk (choona) for general use, as instructed by Adil Ghani-", "amount": 120.0, "type": "expense", "balance": 132913.0}, {"date": "2026-04-01", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 03 Nos bulbs for the advisor room (Chandelier) as per email-", "amount": 600.0, "type": "expense", "balance": 132313.0}, {"date": "2026-04-01", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 01 fruit basket Rs. 3000 & a cake Rs. 2090 for Shehroz, as per ticket # 94708", "amount": 5090.0, "type": "expense", "balance": 127223.0}, {"date": "2026-04-01", "bu": "Disrupt Procurement", "category": "Disrupt Procurement", "description": "Paid for Raashan offloading to (Mr. Aijaz 0347-0246990) - Disrupt Procurement", "amount": 4000.0, "type": "expense", "balance": 123223.0}, {"date": "2026-04-01", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 tap for the cooler placed at the front of 141-D for valet staff use, as instructed by Shahbaz", "amount": 150.0, "type": "expense", "balance": 123073.0}, {"date": "2026-04-01", "bu": "Disrupt Admin", "category": "Utilities Expenses", "description": "Pay to SKY Fast cable media monthly Cable fees 140-H (APR)", "amount": 800.0, "type": "expense", "balance": 122273.0}, {"date": "2026-04-02", "bu": "Gz Systems", "category": "Gz Systems", "description": "Purchased refreshments for the external Audit team,  as per email-", "amount": 2361.0, "type": "expense", "balance": 119912.0}, {"date": "2026-04-02", "bu": "Gz Systems", "category": "Gz Systems", "description": "Purchased lunch for the external Audit team,  as per email-", "amount": 13970.0, "type": "expense", "balance": 105942.0}, {"date": "2026-04-02", "bu": "Gz Systems", "category": "Gz Systems", "description": "Purchased drinks fizzup for the external Audit team,  as per email-", "amount": 650.0, "type": "expense", "balance": 105292.0}, {"date": "2026-04-02", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid for towel washing for the Advisor room, as instructed by Shahbaz-", "amount": 80.0, "type": "expense", "balance": 105212.0}, {"date": "2026-04-02", "bu": "Disrupt Admin", "category": "Utilities Expenses", "description": "Pay Salary to Mr. Abdullah for monthly garbage collection of 140-H and 141-D & 141-C", "amount": 4000.0, "type": "expense", "balance": 101212.0}, {"date": "2026-04-03", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 03-04-26", "amount": 80.0, "type": "expense", "balance": 101132.0}, {"date": "2026-04-03", "bu": "Gz Systems", "category": "Gz Systems", "description": "Purchased refreshments for the external Audit team,  as per email-", "amount": 1461.0, "type": "expense", "balance": 99671.0}, {"date": "2026-04-03", "bu": "Gz Systems", "category": "Gz Systems", "description": "Purchased lunch for the external Audit team,  as per email-", "amount": 8010.0, "type": "expense", "balance": 91661.0}, {"date": "2026-04-03", "bu": "Gz Systems", "category": "Gz Systems", "description": "Purchased drinks fizzup for the external Audit team,  as per email-", "amount": 320.0, "type": "expense", "balance": 91341.0}, {"date": "2026-04-03", "bu": "Procurement", "category": "Procurement", "description": "Par for car fuel for BZH-449 as per email of Procurement", "amount": 2000.0, "type": "expense", "balance": 89341.0}, {"date": "2026-04-03", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 waterproof box  to cover multi-sheet from water, for 140-H Cafe, as instructed by Akram-", "amount": 350.0, "type": "expense", "balance": 88991.0}, {"date": "2026-04-04", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased a (12V 9A) driver for (MOVE) logo light, as per email of Akram-", "amount": 2000.0, "type": "expense", "balance": 86991.0}, {"date": "2026-04-04", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Soldring Iron Pin for the maintenance team, as instructed by Akram-", "amount": 350.0, "type": "expense", "balance": 86641.0}, {"date": "2026-04-06", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 06-04-26", "amount": 465.0, "type": "expense", "balance": 86176.0}, {"date": "2026-04-06", "bu": "Gz Systems", "category": "Gz Systems", "description": "Purchased Onboarding staff lunch (3541 Muhammad Asad (secure.com) with Kamran Shareef, as per ticket # 94781, of Faaz Azeem-", "amount": 2500.0, "type": "expense", "balance": 83676.0}, {"date": "2026-04-06", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 roll  of flexible pipe to cover the open wires at 141-C outside area, as per email- 02-04-26", "amount": 1200.0, "type": "expense", "balance": 82476.0}, {"date": "2026-04-06", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 03Nos ceiling light for the 140-H office, as per email- 02-04-26", "amount": 2100.0, "type": "expense", "balance": 80376.0}, {"date": "2026-04-06", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 04Nos silicone, 02Nos PU foam, tirpal 12 x 15, and a 01 silicone gun, as a precaution against rain, as per email- 02-04-26", "amount": 5650.0, "type": "expense", "balance": 74726.0}, {"date": "2026-04-06", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to Shani Aluminum & Glass work for pasting the Glass frosting stickers, at both offices, as per email-", "amount": 1500.0, "type": "expense", "balance": 73226.0}, {"date": "2026-04-06", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to Arif Iron Works for the stair side support pipe urgent repair at 141-D, as per email- 04-04-26", "amount": 3000.0, "type": "expense", "balance": 70226.0}, {"date": "2026-04-06", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Paid for the room door repair (Pavot set change with labor charges, for Saad Gadit's office room), as per email- 26-03-26", "amount": 6000.0, "type": "expense", "balance": 64226.0}, {"date": "2026-04-06", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to Arif Iron Works for the material for purchase for the 141-C shed repair work, as per the email- 26-03-26", "amount": 16000.0, "type": "expense", "balance": 48226.0}, {"date": "2026-04-06", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased 60Nos paper cups for the HR session, as instructed by Shahbaz- 05-04-26", "amount": 500.0, "type": "expense", "balance": 47726.0}, {"date": "2026-04-07", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 07-04-26", "amount": 535.0, "type": "expense", "balance": 47191.0}, {"date": "2026-04-07", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased one Mortein 30-night refill for mosquito control purposes, for 140-H, as instructed by Shahbaz-", "amount": 300.0, "type": "expense", "balance": 46891.0}, {"date": "2026-04-07", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Paid Rental charges for 01 ladder (20 ft) for AC installation work at 141-D Old Saad Gadit's room, as instructed by Akram-", "amount": 1000.0, "type": "expense", "balance": 45891.0}, {"date": "2026-04-07", "bu": "N-Dir Entertainment", "category": "N-Dir Entertainment", "description": "Purchased  lunch for Aaqib Gadit's meeting with the team, as per the email-", "amount": 42100.0, "type": "expense", "balance": 3791.0}, {"date": "2026-04-07", "bu": "N-Dir Entertainment", "category": "N-Dir Entertainment", "description": "Purchased drinks (Cola Nex & Fizzup Can's) for Aaqib Gadit's meeting with the team, as per the email-", "amount": 1550.0, "type": "expense", "balance": 2241.0}, {"date": "2026-04-07", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased washer for the washbasin tap, as instructed by Akram-", "amount": 50.0, "type": "expense", "balance": 2191.0}, {"date": "2026-04-08", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 08-04-26", "amount": 435.0, "type": "expense", "balance": 1756.0}, {"date": "2026-04-08", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 door latch for guard restroom, as instructed by Akram-", "amount": 250.0, "type": "expense", "balance": 1506.0}, {"date": "2026-04-08", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased refreshments for Mr. Zubair and the external guests, as per email-", "amount": 900.0, "type": "expense", "balance": 606.0}, {"date": "2026-04-08", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased 04 drinks buddy pack Fizzup for lunch of Mr. Zubair and the external guests, as per email-", "amount": 280.0, "type": "expense", "balance": 326.0}, {"date": "2026-04-08", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the color printout with lamination (Room Reservation), as instructed by Shahbaz-", "amount": 150.0, "type": "expense", "balance": 176.0}, {"date": "2026-04-09", "bu": "", "category": "", "description": "Cash Received from Finance", "amount": 199800.0, "type": "inflow", "balance": 199976.0}, {"date": "2026-04-09", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 09-04-26", "amount": 455.0, "type": "expense", "balance": 199521.0}, {"date": "2026-04-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01Nos ball valve for the 141-C pool valve change due to leakage, as instructed by Akram-", "amount": 450.0, "type": "expense", "balance": 199071.0}, {"date": "2026-04-09", "bu": "Auto Os", "category": "Auto Os", "description": "Pay for Car Fuel fill-up  BYA-346, for the Auto OS team, as per email, closing balance is Rs. 3,000 - 07-04-26", "amount": 3000.0, "type": "expense", "balance": 196071.0}, {"date": "2026-04-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased (02Nos union 3/8, 1/2, 02Nos union 3/8, 1/4, adapter 3/8 , 1/2, & hole clip) for Saad Gadit's old room AC work in 141-D, as per 08-04-26", "amount": 780.0, "type": "expense", "balance": 195291.0}, {"date": "2026-04-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 04Nos elbow 1 1/2, 02Nos socket 1 1/2, solution, for 140-H motor repair work, as per 08-04-26", "amount": 1310.0, "type": "expense", "balance": 193981.0}, {"date": "2026-04-09", "bu": "N-Dir Entertainment", "category": "N-Dir Entertainment", "description": "Purchased refreshments (02 half roll Biscuits) for Umair & Aaqib Gadit, as instructed by Shahbaz", "amount": 80.0, "type": "expense", "balance": 193901.0}, {"date": "2026-04-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the service of the water drain generator pump, as per email- 06-04-2026", "amount": 2500.0, "type": "expense", "balance": 191401.0}, {"date": "2026-04-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the monoblock motor pump installation in 141-C,  labor charges, as per email-", "amount": 2000.0, "type": "expense", "balance": 189401.0}, {"date": "2026-04-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to Shani Aluminum & Glass works for the Glass vinyl frosting in Room # 6 140-H, inclusive of material and labor charges, as per email-", "amount": 6900.0, "type": "expense", "balance": 182501.0}, {"date": "2026-04-09", "bu": "Disrupt Admin", "category": "Water bottles", "description": "Paid for the 12Nos water bottle refilling from RO Plant, as instructed by Khaleeq Kamali-", "amount": 720.0, "type": "expense", "balance": 181781.0}, {"date": "2026-04-09", "bu": "Auto Os", "category": "Auto Os", "description": "Pay for Car Fuel fill-up  BYA-346, for the Auto OS team, as per email, closing balance is Rs. 6,000 - 09-04-26", "amount": 3000.0, "type": "expense", "balance": 178781.0}, {"date": "2026-04-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Exhaust fan motor for the 140-H male restroom, as per email-", "amount": 2000.0, "type": "expense", "balance": 176781.0}, {"date": "2026-04-09", "bu": "Disrupt Security", "category": "Disrupt Security", "description": "Purchase ice for 03 car parking plot x 01,02 & 03, 01 50 x 08 = 400, Plot 02 , 50 x 08 = 400 & Plot 03, 50 x 08 = 400, 22-Mar-2026 to 31-Mar-2026, 09 days", "amount": 1200.0, "type": "expense", "balance": 175581.0}, {"date": "2026-04-09", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 140-H front 11 x 200 = 2200, 21-Mar-2026 to 31-Mar-2026, 11 days", "amount": 2200.0, "type": "expense", "balance": 173381.0}, {"date": "2026-04-09", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 141-D front  11 x 200 = 2200, 21-Mar-2026 to 31-Mar-2026, 11 days", "amount": 2200.0, "type": "expense", "balance": 171181.0}, {"date": "2026-04-10", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 10-04-26", "amount": 105.0, "type": "expense", "balance": 171076.0}, {"date": "2026-04-10", "bu": "Legal Entertainment", "category": "Legal Entertainment", "description": "Purchased 04Nos Dasani water bottles for Ovais bhai, as requested by Ovais bhai-", "amount": 228.0, "type": "expense", "balance": 170848.0}, {"date": "2026-04-10", "bu": "Disrupt Finance", "category": "Disrupt Finance", "description": "Paid for mobile load on Ovais bhai's mobile phone for Activation of Credit Card, as per email of Mohsin-", "amount": 500.0, "type": "expense", "balance": 170348.0}, {"date": "2026-04-10", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid allowances to 6 staff members for participation in the Talent Day gift distribution activity (Hadi Khan, Muzammil Ahmed, Ali Hassan, Kamran, Taimoor & M Hussain), as per email", "amount": 6000.0, "type": "expense", "balance": 164348.0}, {"date": "2026-04-10", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for Mr. Zubair and the external guests, as per email-", "amount": 1300.0, "type": "expense", "balance": 163048.0}, {"date": "2026-04-11", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 03Kg hypo for the restroom cleaning, as instructed by Khaleeq Kamali- 11-04-26", "amount": 450.0, "type": "expense", "balance": 162598.0}, {"date": "2026-04-13", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 13-04-26", "amount": 425.0, "type": "expense", "balance": 162173.0}, {"date": "2026-04-13", "bu": "Disrupt IT", "category": "Disrupt IT", "description": "Purchased 04 Dowel 15/16, 10 Dowel 1/8Key, 01 Dowel Clamp & 01 SDS HIT, for the Hard disk dismantling activity, as per email- 11-04-26", "amount": 3150.0, "type": "expense", "balance": 159023.0}, {"date": "2026-04-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the 140-H Reception Sensor door servicing & Repair (Sensor adjustment, sensor motor servicing & Flap), as per the email-", "amount": 6000.0, "type": "expense", "balance": 153023.0}, {"date": "2026-04-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Thermostat for the 140-H Cafe water dispenser, as instructed by Akram-", "amount": 650.0, "type": "expense", "balance": 152373.0}, {"date": "2026-04-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos 04'' pipe clip for fixing the pipe for Cat food, at 141-C reception backside area, as instructed by Akram-", "amount": 150.0, "type": "expense", "balance": 152223.0}, {"date": "2026-04-13", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Paid to refill 03Nos cylinder for Oxygen gas for the AC maintenance team, as per email-", "amount": 1050.0, "type": "expense", "balance": 151173.0}, {"date": "2026-04-13", "bu": "Legal Entertainment", "category": "Legal Entertainment", "description": "Purchased lunch For Ovais bhai, - as requested by Ovais bhai-", "amount": 1760.0, "type": "expense", "balance": 149413.0}, {"date": "2026-04-13", "bu": "Legal Entertainment", "category": "Legal Entertainment", "description": "Purchased 04Nos Nestle water bottles for Ovais bhai, as requested by Ovais bhai-", "amount": 240.0, "type": "expense", "balance": 149173.0}, {"date": "2026-04-13", "bu": "Disrupt Procurement", "category": "Disrupt Procurement", "description": "Paid for fuel fill-up of vehicle (BWG-843) due to insufficient fuel, as the car was being sent to the showroom. The vehicle was previously assigned to Ms. Zehra Khawaja (resigned employee), as per email", "amount": 2000.0, "type": "expense", "balance": 147173.0}, {"date": "2026-04-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased (Tagging numbers & Alphabets) for DB labeling purpose, as per email-", "amount": 2600.0, "type": "expense", "balance": 144573.0}, {"date": "2026-04-14", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 14-04-26", "amount": 525.0, "type": "expense", "balance": 144048.0}, {"date": "2026-04-14", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Magic Depoxi for the maintenance team, as instructed by Akram-", "amount": 200.0, "type": "expense", "balance": 143848.0}, {"date": "2026-04-14", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased drain stainer, for the 140-H washing area, as instructed by Shahbaz-", "amount": 200.0, "type": "expense", "balance": 143648.0}, {"date": "2026-04-15", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 15-04-26", "amount": 480.0, "type": "expense", "balance": 143168.0}, {"date": "2026-04-15", "bu": "Legal Entertainment", "category": "Legal Entertainment", "description": "Purchased 04Nos Nestle water bottles for Ovais bhai, as requested by Ovais bhai-", "amount": 192.0, "type": "expense", "balance": 142976.0}, {"date": "2026-04-15", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Lock for the cafe store, as per email-", "amount": 250.0, "type": "expense", "balance": 142726.0}, {"date": "2026-04-15", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch (02 Chapati) for the ODOO team, as instructecd by Khaleeq Kamali-", "amount": 40.0, "type": "expense", "balance": 142686.0}, {"date": "2026-04-15", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 36Nos cold drinks for the DL team lunch, as per ticket # 94891-", "amount": 3960.0, "type": "expense", "balance": 138726.0}, {"date": "2026-04-15", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Paid delivery charges for the Pizza delivery for the DL team lunch, as per ticket # 94891-", "amount": 300.0, "type": "expense", "balance": 138426.0}, {"date": "2026-04-15", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 hand-saw and cut screw 1 x 6, for work in 141-d room # 11, as instructed by Akram-", "amount": 450.0, "type": "expense", "balance": 137976.0}, {"date": "2026-04-15", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid for the document courier via TCS to Javeria Noman Babar, CN# 306063988051, as instructed by Khaleeq Kamali-", "amount": 340.0, "type": "expense", "balance": 137636.0}, {"date": "2026-04-15", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased dinner for the HR team, as per the email-", "amount": 940.0, "type": "expense", "balance": 136696.0}, {"date": "2026-04-15", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid for washing 01 Prayer Mat (Dari) 02 Jaye Namaz for prayer area 141-C, as instructed by Khaleeq Kamali-", "amount": 700.0, "type": "expense", "balance": 135996.0}, {"date": "2026-04-16", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 16-04-26", "amount": 75.0, "type": "expense", "balance": 135921.0}, {"date": "2026-04-16", "bu": "Legal Entertainment", "category": "Legal Entertainment", "description": "Purchased 05Nos Nestle water bottles for Ovais bhai, as requested by Ovais bhai-", "amount": 240.0, "type": "expense", "balance": 135681.0}, {"date": "2026-04-16", "bu": "Legal Entertainment", "category": "Legal Entertainment", "description": "Purchased lunch For Ovais bhai, - as requested by Ovais bhai-", "amount": 2610.0, "type": "expense", "balance": 133071.0}, {"date": "2026-04-16", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 plug top for the cafe oven 141-C, as instructed by Akram-", "amount": 150.0, "type": "expense", "balance": 132921.0}, {"date": "2026-04-16", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid for the 03Nos color printout, as per email of Javeria Sami-", "amount": 150.0, "type": "expense", "balance": 132771.0}, {"date": "2026-04-16", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Mercury Shade with holder, for the MOVE Gym, as instructed by Akram-", "amount": 610.0, "type": "expense", "balance": 132161.0}, {"date": "2026-04-16", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 commode machine (ball cock) for the restroom, as instructed by Akram-", "amount": 450.0, "type": "expense", "balance": 131711.0}, {"date": "2026-04-16", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 (U Channel Patti) for ceiling work at room # 10 141-D, as instructed by Akram-", "amount": 140.0, "type": "expense", "balance": 131571.0}, {"date": "2026-04-16", "bu": "G&A", "category": "G&A", "description": "Purchased 16Nos Rhythm Fire & 05 Liliane Pour Femme perfume, for the Talent Day Team -  Lunch & Appreciation, as per email-", "amount": 47300.0, "type": "expense", "balance": 84271.0}, {"date": "2026-04-16", "bu": "G&A", "category": "G&A", "description": "Paid for the 21Nos color printout for the Talent Day Team - Lunch & Appreciation, as per email-", "amount": 1100.0, "type": "expense", "balance": 83171.0}, {"date": "2026-04-17", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 17-04-26", "amount": 25.0, "type": "expense", "balance": 83146.0}, {"date": "2026-04-17", "bu": "Disrupt Finance", "category": "Disrupt Finance", "description": "Paid for dinner reimbursement incurred due to late working hours in the office (Talent Day), as per email-", "amount": 6180.0, "type": "expense", "balance": 76966.0}, {"date": "2026-04-17", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 05 Nos 10-meter fairy lights for the 140-H cafe, as per email- 13-04-26", "amount": 2750.0, "type": "expense", "balance": 74216.0}, {"date": "2026-04-17", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased (hand plane, Aluminum patti & solution) for the maintenance team, as per email- 14-04-26", "amount": 1780.0, "type": "expense", "balance": 72436.0}, {"date": "2026-04-17", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased Philips panel light 2x2 for the learning center 141-D, as per email- 16-04-26", "amount": 6500.0, "type": "expense", "balance": 65936.0}, {"date": "2026-04-17", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for Mr. Zubair and the external guests, as per email-", "amount": 1620.0, "type": "expense", "balance": 64316.0}, {"date": "2026-04-17", "bu": "Legal Entertainment", "category": "Legal Entertainment", "description": "Pay for the car fuel fill-up  BYA-346, for Ovais bhai, as instructed by Khaleeq Kamali- 16-04-26", "amount": 200.0, "type": "expense", "balance": 64116.0}, {"date": "2026-04-18", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 04 acid bottles for the restroom cleaning, as instructed by Khaleeq Kamali-", "amount": 800.0, "type": "expense", "balance": 63316.0}, {"date": "2026-04-18", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 07 cold drinks for the team dinner with Arqam Gadit, as requested by Aqib Zafar and instructed by Shahbaz Ahmed-", "amount": 840.0, "type": "expense", "balance": 62476.0}, {"date": "2026-04-20", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 20-04-26", "amount": 60.0, "type": "expense", "balance": 62416.0}, {"date": "2026-04-20", "bu": "Auto Os", "category": "Auto Os", "description": "Pay for Car Fuel fill-up  BYA-346, for the Auto OS team, as per email, closing balance is Rs. 8,000 - 20-04-26", "amount": 2000.0, "type": "expense", "balance": 60416.0}, {"date": "2026-04-20", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Gallon Gobis Plastic paint, 01 brush 2'' & 01 brush 01'', for paint work at Rafay Gadit's room, as per the email-", "amount": 5400.0, "type": "expense", "balance": 55016.0}, {"date": "2026-04-20", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Nano double tape, for general use, as instructed by Shahbaz-", "amount": 260.0, "type": "expense", "balance": 54756.0}, {"date": "2026-04-20", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 05 Nos 16-meter fairy lights for the 140-H cafe, as instructed by Shahbaz-", "amount": 1200.0, "type": "expense", "balance": 53556.0}, {"date": "2026-04-20", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to Shani Aluminum for the double glass door restored at the same location by applying double tape and silicone filling at room # 6 140-H, as per the email-", "amount": 5000.0, "type": "expense", "balance": 48556.0}, {"date": "2026-04-21", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 21-04-26", "amount": 450.0, "type": "expense", "balance": 48106.0}, {"date": "2026-04-21", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid for washing 01 Prayer Mat (Dari) 02 Jaye Namaz for prayer area 141-C, as instructed by Khaleeq Kamali-", "amount": 700.0, "type": "expense", "balance": 47406.0}, {"date": "2026-04-22", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 22-04-26", "amount": 200.0, "type": "expense", "balance": 47206.0}, {"date": "2026-04-22", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 sink adjustable shower for 1st floor 141-D, as per email of Akram-", "amount": 550.0, "type": "expense", "balance": 46656.0}, {"date": "2026-04-22", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02 door latch for guard restroom, as instructed by Akram-", "amount": 500.0, "type": "expense", "balance": 46156.0}, {"date": "2026-04-22", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for Mr. Zubair and the external guests, as per email-", "amount": 1600.0, "type": "expense", "balance": 44556.0}, {"date": "2026-04-22", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01Nos E-Delux 65k 04'' light for the 141-D 2nd floor female restroom, as instructed by Akram-", "amount": 350.0, "type": "expense", "balance": 44206.0}, {"date": "2026-04-22", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased lunch for the (Claude Training for Mahsa's Team), as per the email-", "amount": 11000.0, "type": "expense", "balance": 33206.0}, {"date": "2026-04-23", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 23-04-26", "amount": 250.0, "type": "expense", "balance": 32956.0}, {"date": "2026-04-23", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 01 mouthwash for the Advisor room's restroom, as instructed by Akram-", "amount": 1140.0, "type": "expense", "balance": 31816.0}, {"date": "2026-04-24", "bu": "", "category": "", "description": "Cash Received from Finance", "amount": 166700.0, "type": "inflow", "balance": 198516.0}, {"date": "2026-04-24", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 24-04-26", "amount": 130.0, "type": "expense", "balance": 198386.0}, {"date": "2026-04-24", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01Nos ball valve 3/4, 01 handsaw blade, and 01 solution, as instructed by Akram-", "amount": 650.0, "type": "expense", "balance": 197736.0}, {"date": "2026-04-24", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 05Nos PVC socket 3/4, 01 handsaw blade, as instructed by Akram-", "amount": 200.0, "type": "expense", "balance": 197536.0}, {"date": "2026-04-24", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased 04Nos Lemon Malt, for the birthday celebration of Apr (Disrupt employees) as instructed by Ms Felicia-", "amount": 480.0, "type": "expense", "balance": 197056.0}, {"date": "2026-04-24", "bu": "Disrupt Security", "category": "Disrupt Security", "description": "Purchase ice for 03 car parking plot x 01,02 & 03, 01 50 x 11 = 550, Plot 02 , 50 x 11 = 550 & Plot 03, 50 x 15 = 750, 01-Apr-2026 to 15-Apr-2026, 15 days", "amount": 1850.0, "type": "expense", "balance": 195206.0}, {"date": "2026-04-24", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 140-H front 15 x 200 = 3000, 01-Apr-2026 to 15-Apr-2026, 15 days", "amount": 3000.0, "type": "expense", "balance": 192206.0}, {"date": "2026-04-24", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 141-D front  15 x 200 = 3000, 01-Apr-2026 to 15-Apr-2026, 15 days", "amount": 3000.0, "type": "expense", "balance": 189206.0}, {"date": "2026-04-27", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 27-04-26", "amount": 90.0, "type": "expense", "balance": 189116.0}, {"date": "2026-04-27", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid for washing 01 Prayer Mat (Dari) 01 Jaye Namaz for prayer area 141-C, as instructed by Khaleeq Kamali-", "amount": 600.0, "type": "expense", "balance": 188516.0}, {"date": "2026-04-28", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 28-04-26", "amount": 370.0, "type": "expense", "balance": 188146.0}, {"date": "2026-04-28", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Silicone for the maintenance team general use, as per email-", "amount": 380.0, "type": "expense", "balance": 187766.0}, {"date": "2026-04-28", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 48ft flexible drain pipe & 04 Damar tape, for the Data Center AC drain line, as per email- 23-04-26", "amount": 1720.0, "type": "expense", "balance": 186046.0}, {"date": "2026-04-29", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 29-04-26", "amount": 215.0, "type": "expense", "balance": 185831.0}, {"date": "2026-04-29", "bu": "Squatwolf", "category": "Squatwolf", "description": "Paid for the Squatwolf Items of employees-", "amount": 4030.0, "type": "expense", "balance": 181801.0}, {"date": "2026-04-29", "bu": "Auto Os", "category": "Auto Os", "description": "Pay for Car Fuel fill-up  BYA-346, for the Auto OS team, as per email, closing balance is Rs. 10,000", "amount": 2000.0, "type": "expense", "balance": 179801.0}, {"date": "2026-04-30", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 30-04-26", "amount": 295.0, "type": "expense", "balance": 179506.0}, {"date": "2026-04-30", "bu": "Auto Os", "category": "Auto Os", "description": "Pay for Car Fuel fill-up  BYA-346, for the Auto OS team, as per email, closing balance is Rs. 13,000", "amount": 3000.0, "type": "expense", "balance": 176506.0}, {"date": "2026-04-30", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 commode push button (double) for the 141-D 2nd floor restroom, as instructed by Shamroz-", "amount": 400.0, "type": "expense", "balance": 176106.0}, {"date": "2026-04-30", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased (PVC Tape, Bit, Disk & Rawal bolt 10mm) for the 140-H Reception DB replacement work, as per email-", "amount": 1300.0, "type": "expense", "balance": 174806.0}, {"date": "2026-04-30", "bu": "Disrupt Procurement", "category": "Disrupt Procurement", "description": "Paid for Raashan offloading to (Mr. Aijaz 0347-0246990) - Disrupt Procurement", "amount": 4000.0, "type": "expense", "balance": 170806.0}, {"date": "2026-04-30", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to Arif Iron Works for labor charges for the 141-C shed repair work, as per the email- 22-03-26", "amount": 16000.0, "type": "expense", "balance": 154806.0}, {"date": "2026-05-02", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 04 acid bottles for the restroom cleaning, as instructed by Shahbaz-", "amount": 1000.0, "type": "expense", "balance": 153806.0}, {"date": "2026-05-02", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 channel patti (60x60) for the 140-H Reception DB work, as instructed by Shamroze-", "amount": 1250.0, "type": "expense", "balance": 152556.0}, {"date": "2026-05-02", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Tye clip pack & 01 electric tape, as instructed by Shamroze- 01-05-26", "amount": 450.0, "type": "expense", "balance": 152106.0}, {"date": "2026-05-02", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased a chamber rubber (gasket) 32Nos for general maintenance work, as instructed by Shahbaz- 28-04-26", "amount": 660.0, "type": "expense", "balance": 151446.0}, {"date": "2026-05-04", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 04-04-26", "amount": 310.0, "type": "expense", "balance": 151136.0}, {"date": "2026-05-04", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased lunch for (Daniyal, Abdul Rehman & Munam, as per the email-", "amount": 1560.0, "type": "expense", "balance": 149576.0}, {"date": "2026-05-04", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased cold drinks for (Daniyal, Abdul Rehman, & Munam, as per the email-", "amount": 400.0, "type": "expense", "balance": 149176.0}, {"date": "2026-05-04", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased a 100 ft measuring tape for the maintenance team, as instructed by Akram", "amount": 650.0, "type": "expense", "balance": 148526.0}, {"date": "2026-05-04", "bu": "Disrupt Admin", "category": "R&M - Equipments Admin", "description": "Purchased 1 pair of battery terminal, as instructed by Shamroze", "amount": 200.0, "type": "expense", "balance": 148326.0}, {"date": "2026-05-04", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the color printout with lamination (Room Reservation), as instructed by Shahbaz-", "amount": 250.0, "type": "expense", "balance": 148076.0}, {"date": "2026-05-04", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 0 Nos sanitizer (Cool & Cool Ocean Hand) for Kashif Siddiqui's room, as instructed by Shahbaz-", "amount": 1051.0, "type": "expense", "balance": 147025.0}, {"date": "2026-05-05", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 05-04-26", "amount": 175.0, "type": "expense", "balance": 146850.0}, {"date": "2026-05-05", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for ODOO team, as per email-", "amount": 1240.0, "type": "expense", "balance": 145610.0}, {"date": "2026-05-05", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased cold drinks for ODOO team, as per email-", "amount": 157.0, "type": "expense", "balance": 145453.0}, {"date": "2026-05-05", "bu": "Wellows", "category": "Wellows", "description": "Purchased lunch for the Wellows team, as per ticket # 95193 of M Bilal Arif-", "amount": 50100.0, "type": "expense", "balance": 95353.0}, {"date": "2026-05-05", "bu": "Wellows", "category": "Wellows", "description": "Purchased 16Nos cold drinks for the Wellows team, as per ticket # 95193 of M Bilal Arif-", "amount": 1681.0, "type": "expense", "balance": 93672.0}, {"date": "2026-05-05", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 bulb & a holder for the maintenance team, as instructed by Shamroze-", "amount": 170.0, "type": "expense", "balance": 93502.0}, {"date": "2026-05-05", "bu": "Disrupt Security", "category": "Disrupt Security", "description": "Purchase ice for 03 car parking plot x 01,02 & 03, 01 100 x 15 = 1500, Plot 02 , 50 x 11 = 550 & Plot 03, 50 x 11 = 550, 16-Apr-2026 to 30-Apr-2026, 15 days", "amount": 2600.0, "type": "expense", "balance": 90902.0}, {"date": "2026-05-05", "bu": "Disrupt Security", "category": "Disrupt Security", "description": "Purchase ice for Bike parking 141-D, 100 x 15 = 1500, 16-Apr-2026 to 30-Apr-2026, 15 days", "amount": 1500.0, "type": "expense", "balance": 89402.0}, {"date": "2026-05-05", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 140-H front 15 x 300 = 4500, 16-Apr-2026 to 30-Apr-2026, 15 days", "amount": 4500.0, "type": "expense", "balance": 84902.0}, {"date": "2026-05-05", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 141-D front 15 x 300 = 4500, 16-Apr-2026 to 30-Apr-2026, 15 days", "amount": 4500.0, "type": "expense", "balance": 80402.0}, {"date": "2026-05-05", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Paid to ARA Associates for door repair of room # 06 in 140-H office, as per email of Akram- 02-04-26", "amount": 2000.0, "type": "expense", "balance": 78402.0}, {"date": "2026-05-06", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 06-04-26", "amount": 165.0, "type": "expense", "balance": 78237.0}, {"date": "2026-05-06", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos PVC Tee cock, for the", "amount": 700.0, "type": "expense", "balance": 77537.0}, {"date": "2026-05-06", "bu": "Auto Os", "category": "Auto Os", "description": "Purchased 01 OTG USB for the Auto Os team, as instructed by Shahbaz-", "amount": 250.0, "type": "expense", "balance": 77287.0}, {"date": "2026-05-06", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to M. Arif Iron Works for the fabrication and installation of an iron cover for the tank water filling pipe at the backside of 141-C, as per the email- 04-05-26", "amount": 2500.0, "type": "expense", "balance": 74787.0}, {"date": "2026-05-06", "bu": "Disrupt Admin", "category": "Utilities Expenses", "description": "Pay Salary to Mr. Abdullah for monthly garbage collection of 140-H and 141-D & 141-C", "amount": 4000.0, "type": "expense", "balance": 70787.0}, {"date": "2026-05-07", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 07-04-26", "amount": 100.0, "type": "expense", "balance": 70687.0}, {"date": "2026-05-07", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid for towel washing for the Advisor room, as instructed by Shahbaz-", "amount": 160.0, "type": "expense", "balance": 70527.0}, {"date": "2026-05-07", "bu": "Auot Os", "category": "Auot Os", "description": "Purchased 01 (UGreen 10902 M.2 NVME Portable SSD Enclosure 10GBPS) for the AutoOs team, as instructed by Akram- 23-04-26", "amount": 5700.0, "type": "expense", "balance": 64827.0}, {"date": "2026-05-07", "bu": "Disrupt Admin", "category": "Water Bottles", "description": "Paid for the 12Nos water bottle refilling from RO Plant, as instructed by Khaleeq Kamali-", "amount": 700.0, "type": "expense", "balance": 64127.0}, {"date": "2026-05-07", "bu": "Auot Os", "category": "Auot Os", "description": "Purchased 01 Jazz USB Dongle, for the Auto Os team, requested by Ammar Gadit, instructed by Shahbaz-", "amount": 4500.0, "type": "expense", "balance": 59627.0}, {"date": "2026-05-07", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Paid to refill 02Nos cylinder for Oxygen gas for the AC maintenance team, as per email-", "amount": 600.0, "type": "expense", "balance": 59027.0}, {"date": "2026-05-07", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid for washing 01 Prayer Mat (Dari) prayer area 141-C, as instructed by Khaleeq Kamali-", "amount": 500.0, "type": "expense", "balance": 58527.0}, {"date": "2026-05-07", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased (Grass Carpet) for the 140-H office, as instructed by Shahbaz- 28-04-26", "amount": 1500.0, "type": "expense", "balance": 57027.0}, {"date": "2026-05-08", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 08-04-26", "amount": 200.0, "type": "expense", "balance": 56827.0}, {"date": "2026-05-08", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "“Paid for the repair of the Karcher nozzle, for the AC maintenance team, as instructed by Akram-", "amount": 700.0, "type": "expense", "balance": 56127.0}, {"date": "2026-05-08", "bu": "Auto Os", "category": "Auto Os", "description": "Purchased 03Nos 64GB SD cards for the Auto Os team, as instructed by Shahbaz-", "amount": 10500.0, "type": "expense", "balance": 45627.0}, {"date": "2026-05-08", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 lock for securing the water tanker pipe box, as instructed by Shamroze", "amount": 350.0, "type": "expense", "balance": 45277.0}, {"date": "2026-05-09", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 03Kg hypo for the restroom cleaning, as instructed by Khaleeq Kamali-", "amount": 450.0, "type": "expense", "balance": 44827.0}, {"date": "2026-05-11", "bu": "", "category": "", "description": "Cash Received from Finance", "amount": 121500.0, "type": "inflow", "balance": 166327.0}, {"date": "2026-05-11", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 11-04-26", "amount": 140.0, "type": "expense", "balance": 166187.0}, {"date": "2026-05-11", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Spindle for the 141-C Cafe washing area tap, as instructed by Akram-", "amount": 450.0, "type": "expense", "balance": 165737.0}, {"date": "2026-05-11", "bu": "Disrupt Admin", "category": "Utilities Expenses", "description": "Pay to SKY Fast cable media monthly Cable fees 140-H (MAY)", "amount": 800.0, "type": "expense", "balance": 164937.0}, {"date": "2026-05-11", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 220V (NOULUX) driver, for the basement light in 140-H office, as per email-", "amount": 3800.0, "type": "expense", "balance": 161137.0}, {"date": "2026-05-11", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the 02 oven repair for 141-C Cafe, as instructed by Khaleeq Kamali-", "amount": 250.0, "type": "expense", "balance": 160887.0}, {"date": "2026-05-12", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 12-04-26", "amount": 420.0, "type": "expense", "balance": 160467.0}, {"date": "2026-05-12", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased cold drinks for ODOO team, as instructed by Khaleeq Kamali-", "amount": 240.0, "type": "expense", "balance": 160227.0}, {"date": "2026-05-12", "bu": "Auto Os", "category": "Auto Os", "description": "Purchased 01pair of speakers for the Auto Os team, as instructed by Shahbaz- 11-05-26", "amount": 400.0, "type": "expense", "balance": 159827.0}, {"date": "2026-05-13", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 13-04-26", "amount": 740.0, "type": "expense", "balance": 159087.0}, {"date": "2026-05-13", "bu": "Auto Os", "category": "Auto Os", "description": "Purchased (speaker, 2m wire, tape, double tape, paper tape) for the Auto Os team, as instructed by Shahbaz-", "amount": 1150.0, "type": "expense", "balance": 157937.0}, {"date": "2026-05-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 15ft pipe for the replacement of the damaged diesel fuel tank pipe, as instructed by Akram-", "amount": 825.0, "type": "expense", "balance": 157112.0}, {"date": "2026-05-13", "bu": "Gz Systems", "category": "Gz Systems", "description": "Purchased 07 cold drinks (Fizzup cans) for the Secure.com workshop, as instructed by Shahbaz-", "amount": 910.0, "type": "expense", "balance": 156202.0}, {"date": "2026-05-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for repair the microwave (paper change, magnet nob change, paint & bulb), for 141-C cafe, as instructed by Akram-", "amount": 700.0, "type": "expense", "balance": 155502.0}, {"date": "2026-05-13", "bu": "Disrupt Admin", "category": "Water & Sewerage", "description": "Purchase a water tanker to refill the tank of 140-H- office as instructed by Akram-", "amount": 7000.0, "type": "expense", "balance": 148502.0}, {"date": "2026-05-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to repair the grinder for the maintenance team, as instructed by Akram-", "amount": 2200.0, "type": "expense", "balance": 146302.0}, {"date": "2026-05-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to Mr. Khurram for the Dumbbell repair, as instructed by Shahbaz-", "amount": 3000.0, "type": "expense", "balance": 143302.0}, {"date": "2026-05-14", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 14-04-26", "amount": 400.0, "type": "expense", "balance": 142902.0}, {"date": "2026-05-14", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for ODOO team, as instructed by Khaleeq Kamali-", "amount": 980.0, "type": "expense", "balance": 141922.0}, {"date": "2026-05-14", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased a Dasani water bottle for Ali Samir, as instructed by Khaleeq Kamali-", "amount": 342.0, "type": "expense", "balance": 141580.0}, {"date": "2026-05-15", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 15-04-26", "amount": 40.0, "type": "expense", "balance": 141540.0}, {"date": "2026-05-15", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased refreshments (Biscuits Maire & wheatable, jelly) for Ali Samir, as instructed by Khaleeq Kamali-", "amount": 390.0, "type": "expense", "balance": 141150.0}, {"date": "2026-05-15", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased candies for Ali Samir, as instructed by Khaleeq Kamali-", "amount": 50.0, "type": "expense", "balance": 141100.0}, {"date": "2026-05-15", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased plants ( Kamini 04, China Rose 02, Zedrufa 02, and Gul Mohar) for the 140-H pool and outside area ) as instructed by Shahbaz-", "amount": 5900.0, "type": "expense", "balance": 135200.0}, {"date": "2026-05-15", "bu": "Disrupt Admin", "category": "Water & Sewerage", "description": "Purchase a water tanker to refill the tank of 140-H- office as instructed by Shahbaz-", "amount": 7000.0, "type": "expense", "balance": 128200.0}, {"date": "2026-05-18", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 18-04-26", "amount": 345.0, "type": "expense", "balance": 127855.0}, {"date": "2026-05-18", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased Dasani water bottles for Ali Samir, as instructed by Khaleeq Kamali-", "amount": 342.0, "type": "expense", "balance": 127513.0}, {"date": "2026-05-18", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased refreshments (Biscuits Maire & wheatable, jelly) for Ali Samir, as instructed by Khaleeq Kamali-", "amount": 200.0, "type": "expense", "balance": 127313.0}, {"date": "2026-05-18", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Paid to refill the Nitrogen and Oxygen gas cylinder's for the maintenance team, as instructed by Shamroze-", "amount": 700.0, "type": "expense", "balance": 126613.0}, {"date": "2026-05-18", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the color printout with lamination (Room Reservation), as instructed by Shahbaz-", "amount": 150.0, "type": "expense", "balance": 126463.0}, {"date": "2026-05-18", "bu": "Disrupt Admin", "category": "Water & Sewerage", "description": "Purchase a water tanker to refill the tank of 140-H- office as instructed by Shahbaz-", "amount": 7000.0, "type": "expense", "balance": 119463.0}, {"date": "2026-05-18", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to Mr. Arif for learning center door repair, 141-D 2nd floor, as per email-", "amount": 2500.0, "type": "expense", "balance": 116963.0}, {"date": "2026-05-19", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 19-04-26", "amount": 375.0, "type": "expense", "balance": 116588.0}, {"date": "2026-05-19", "bu": "Disrupt Admin", "category": "Water & Sewerage", "description": "Purchase a water tanker to refill the tank of 140-H- office as instructed by Shahbaz-", "amount": 9000.0, "type": "expense", "balance": 107588.0}, {"date": "2026-05-19", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02 pack of grouting powder for maintenance team", "amount": 500.0, "type": "expense", "balance": 107088.0}, {"date": "2026-05-20", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 20-04-26", "amount": 140.0, "type": "expense", "balance": 106948.0}, {"date": "2026-05-20", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased a water cooler for outside area , 140-H guards and drivers", "amount": 4500.0, "type": "expense", "balance": 102448.0}, {"date": "2026-05-20", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to Arif Welder for the fabrication of the cooler frame, as instructed by Shahbaz-", "amount": 5000.0, "type": "expense", "balance": 97448.0}, {"date": "2026-05-20", "bu": "GTM", "category": "GTM", "description": "Paid for the printing of the Web 3 feedback form 50 sets, as per email-", "amount": 1500.0, "type": "expense", "balance": 95948.0}, {"date": "2026-05-20", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 AC outdoor motor for 140-H AC Room # 09, as per email-", "amount": 1500.0, "type": "expense", "balance": 94448.0}, {"date": "2026-05-20", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to Raees Plumber for the repair of 140-H pool motor as per email- 17-04-26", "amount": 5000.0, "type": "expense", "balance": 89448.0}, {"date": "2026-05-20", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to Raees Plumber for the water line repair of the security guard restroom as per email- 25-04-26", "amount": 6000.0, "type": "expense", "balance": 83448.0}, {"date": "2026-05-20", "bu": "Auto Os", "category": "Auto Os", "description": "Purchased 01 Multimeter for the AutoOs team, as instructed by Shahbaz-", "amount": 2400.0, "type": "expense", "balance": 81048.0}, {"date": "2026-05-20", "bu": "Squatwolf", "category": "Squatwolf", "description": "Paid to KCCI for Katharine Mary Visa Fee, as instructed- 15-05-26", "amount": 2000.0, "type": "expense", "balance": 79048.0}, {"date": "2026-05-20", "bu": "Squatwolf", "category": "Squatwolf", "description": "Paid for the passport-sized photos of Katharine Mary, as instructed- 15-05-26", "amount": 60.0, "type": "expense", "balance": 78988.0}, {"date": "2026-05-20", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 commode machine for 141-D ground floor restroom, as instructed by Akram-", "amount": 600.0, "type": "expense", "balance": 78388.0}, {"date": "2026-05-20", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the window blind repair of the Business Security room in 140-H office, as per email-", "amount": 1500.0, "type": "expense", "balance": 76888.0}, {"date": "2026-05-21", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 21-04-26", "amount": 150.0, "type": "expense", "balance": 76738.0}, {"date": "2026-05-21", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Voldam exhaust fan for  room # 11 ground floor, 141-D ground, as per ticket # 95345", "amount": 5800.0, "type": "expense", "balance": 70938.0}, {"date": "2026-05-21", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 dozen RJ17 phone connectors, as instructed by Shamroze-", "amount": 200.0, "type": "expense", "balance": 70738.0}, {"date": "2026-05-21", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Paid to refill the Nitrogen gas cylinder for the maintenance team, as instructed by Shamroze-", "amount": 500.0, "type": "expense", "balance": 70238.0}, {"date": "2026-05-21", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the change of the fuse of Cafe 141-C microwave, as instructed by Khaleeq Kamali-", "amount": 50.0, "type": "expense", "balance": 70188.0}, {"date": "2026-05-21", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 tap for cafe kettle 141-C, as instructed by Khaleeq Kamali-", "amount": 200.0, "type": "expense", "balance": 69988.0}, {"date": "2026-05-21", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 plug for cafe kettle 141-C, as instructed by Khaleeq Kamali-", "amount": 100.0, "type": "expense", "balance": 69888.0}, {"date": "2026-05-22", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 22-04-26", "amount": 65.0, "type": "expense", "balance": 69823.0}, {"date": "2026-05-22", "bu": "Gz Systems", "category": "Gz Systems", "description": "Purchased lunch for Hasan Ahmed (Contractor Egyptian National) with the team, as per the email of Tayyeba Memon- 18-05-26", "amount": 25820.0, "type": "expense", "balance": 44003.0}, {"date": "2026-05-22", "bu": "Gz Systems", "category": "Gz Systems", "description": "Purchased lunch for Hasan Ahmed (Contractor Egyptian National) with the team, as per the email of Tayyeba Memon- 19-05-26", "amount": 7100.0, "type": "expense", "balance": 36903.0}, {"date": "2026-05-22", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for ODOO team, as instructed by Khaleeq Kamali-", "amount": 980.0, "type": "expense", "balance": 35923.0}, {"date": "2026-05-22", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased cold drink for ODOO team, as instructed by Khaleeq Kamali-", "amount": 100.0, "type": "expense", "balance": 35823.0}, {"date": "2026-05-22", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased Hypochemical & bleach for the restroom cleaning, as instructed by Khaleeq Kamali-", "amount": 1000.0, "type": "expense", "balance": 34823.0}, {"date": "2026-05-24", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased Magic Nut 3/8 x 1/2, flare nut 1/2, flare nut 1/4, for both offices, as instructed by Shamroz-", "amount": 1040.0, "type": "expense", "balance": 33783.0}, {"date": "2026-05-24", "bu": "Gz Systems", "category": "Gz Systems", "description": "Purchased refreshments (Peanut salted, peanut coated, crinkle BBQ chips, Crinkle Ketcup chips), for the PVPN team, as per email-", "amount": 1275.0, "type": "expense", "balance": 32508.0}, {"date": "2026-05-24", "bu": "Gz Systems", "category": "Gz Systems", "description": "Purchased 08 Fresh juice, for the PVPN team, as per email-", "amount": 800.0, "type": "expense", "balance": 31708.0}, {"date": "2026-05-25", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 25-04-26", "amount": 440.0, "type": "expense", "balance": 31268.0}, {"date": "2026-05-25", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for ODOO team, as instructed by Khaleeq Kamali-", "amount": 400.0, "type": "expense", "balance": 30868.0}, {"date": "2026-05-25", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased cold drink for ODOO team, as instructed by Khaleeq Kamali-", "amount": 160.0, "type": "expense", "balance": 30708.0}, {"date": "2026-05-25", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased 04 Jumbo cold drinks for the birthday celebration of May (Disrupt employees) as instructed by Shahbaz-", "amount": 1000.0, "type": "expense", "balance": 29708.0}, {"date": "2026-05-25", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased (bulb, holder, and a tester) for the AC maintenance team, as instructed by Akram-", "amount": 200.0, "type": "expense", "balance": 29508.0}, {"date": "2026-05-25", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased (screw driver + -, and a handsaw blade) for the AC maintenance team, as instructed by Akram-", "amount": 410.0, "type": "expense", "balance": 29098.0}, {"date": "2026-05-25", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the oven repair for 141-C cafe, as instructed by Khaleeq Kamali-", "amount": 2500.0, "type": "expense", "balance": 26598.0}, {"date": "2026-05-25", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to Shani Aluminum for the Door machine change room # 06 with labor charges for 141-D ground floor, as per ticket # 95529-", "amount": 10000.0, "type": "expense", "balance": 16598.0}, {"date": "2026-05-26", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 26-04-26", "amount": 80.0, "type": "expense", "balance": 16518.0}, {"date": "2026-05-29", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 29-04-26", "amount": 20.0, "type": "expense", "balance": 16498.0}, {"date": "2026-06-01", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 01-06-26", "amount": 80.0, "type": "expense", "balance": 16418.0}, {"date": "2026-06-01", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased 03meter drain pipe & 02Nos reducer for AC room # 3 141-C, as instructed by Akram-", "amount": 580.0, "type": "expense", "balance": 15838.0}, {"date": "2026-06-01", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos dammar tape for the maintenance team, as instructed by Akram-", "amount": 300.0, "type": "expense", "balance": 15538.0}, {"date": "2026-06-01", "bu": "Squatwolf", "category": "Squatwolf", "description": "Purchased 01 flower bouquet for Squatwolf Director Finance, as per ticket # 95559 of Ayesha Arif Abbasi-", "amount": 1500.0, "type": "expense", "balance": 14038.0}, {"date": "2026-06-01", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Paid to ARA Associates for the repair of (Glass meeting room Reception 141-C, Door Glass support installation of Cafeteria 140-H & Table Top repair room # 11 141-D), as per email-", "amount": 8000.0, "type": "expense", "balance": 6038.0}, {"date": "2026-06-01", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 05Nos. Tape for the 140-H Main DB work, as instructed by Akram- 27-05-26", "amount": 300.0, "type": "expense", "balance": 5738.0}, {"date": "2026-06-01", "bu": "Disrupt Admin", "category": "R&M - Equipments Admin", "description": "Purchased 01 Genuine Grey High Temp Silicone for 141-C genset, as instructed by Akram- 30-05-26", "amount": 600.0, "type": "expense", "balance": 5138.0}, {"date": "2026-06-02", "bu": "", "category": "", "description": "Cash Received from Finance", "amount": 183500.0, "type": "inflow", "balance": 188638.0}, {"date": "2026-06-02", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 02-06-26", "amount": 20.0, "type": "expense", "balance": 188618.0}, {"date": "2026-06-02", "bu": "Disrupt Security", "category": "Disrupt Security", "description": "Purchase ice for 03 car parking plot x 01,02 & 03, 01 100 x 11 = 1100, Plot 02 , 100 x 11 = 1100 & Plot 03, 150 x 15 = 550, 01-May-2026 to 15-May-2026, 15 days", "amount": 4450.0, "type": "expense", "balance": 184168.0}, {"date": "2026-06-02", "bu": "Disrupt Security", "category": "Disrupt Security", "description": "Purchase ice for Bike parking 141-D, 100 x 15 = 1500, 01-May-2026 to 15-May-2026, 15 days", "amount": 1500.0, "type": "expense", "balance": 182668.0}, {"date": "2026-06-02", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 140-H front 15 x 300 = 4500, 01-May-2026 to 15-May-2026, 15 days", "amount": 4500.0, "type": "expense", "balance": 178168.0}, {"date": "2026-06-02", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 141-D front 15 x 300 = 4500, 01-May-2026 to 15-May-2026, 15 days", "amount": 4500.0, "type": "expense", "balance": 173668.0}, {"date": "2026-06-02", "bu": "Disrupt Procurement", "category": "Disrupt Procurement", "description": "Paid for Raashan offloading to (Mr. Noman 0317-2152713) - Disrupt Procurement", "amount": 4000.0, "type": "expense", "balance": 169668.0}, {"date": "2026-06-03", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 03-06-26", "amount": 60.0, "type": "expense", "balance": 169608.0}, {"date": "2026-06-03", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Capacitor 3.5 UF, for the 141-C Pantry fan, as instructed by Akram-", "amount": 200.0, "type": "expense", "balance": 169408.0}, {"date": "2026-06-03", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the replacement of the burned-out water pump motor at 141-C campus. The new motor cost PKR 17,000/-, with PKR 5,000/- adjusted against the old motor's exchange value, and PKR 2,500/- paid for labor and fitting charges, as per email- 19-05-26", "amount": 14500.0, "type": "expense", "balance": 154908.0}, {"date": "2026-06-04", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 04-06-26", "amount": 40.0, "type": "expense", "balance": 154868.0}, {"date": "2026-06-04", "bu": "Disrupt Admin", "category": "Travel Expense", "description": "Paid to Haris (Technician) for transportation charges, including urgent travel to the office (PKR 1,500/-) and return travel (PKR 2,000/-), to restore electricity at the 140-H office, as per email-", "amount": 3500.0, "type": "expense", "balance": 151368.0}, {"date": "2026-06-04", "bu": "Squatwolf", "category": "Squatwolf", "description": "Purchased Lunch (25 biryani 10 Raita Rs.10750, 28 Plain Kulfi Rs.4480, 06 Jumbo cold drinks Rs.1500, 50 Disposable cups Rs.200 & 07 Salad Rs.490) for the Squatwolf team lunch as per the ticket # 95632 of Ayesha Arif Abbasi-", "amount": 17420.0, "type": "expense", "balance": 133948.0}, {"date": "2026-06-04", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for ODOO team, as instructed by Khaleeq Kamali-", "amount": 900.0, "type": "expense", "balance": 133048.0}, {"date": "2026-06-05", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 05-06-26", "amount": 60.0, "type": "expense", "balance": 132988.0}, {"date": "2026-06-05", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for ODOO team, as instructed by Khaleeq Kamali-", "amount": 1050.0, "type": "expense", "balance": 131938.0}, {"date": "2026-06-05", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased a 02-ton AC compressor for the Learning Center's AC unit, as per the email of Shamroze Nasir-", "amount": 15000.0, "type": "expense", "balance": 116938.0}, {"date": "2026-06-05", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased 10Nos Compressor lead for room # 18 140-H office, 01 lead will be used for this AC. The rest will be kept for general use as needed, as per email-", "amount": 3000.0, "type": "expense", "balance": 113938.0}, {"date": "2026-06-06", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the document color printout (Room Reservation for Kasia, Saad Gadit, Rafay Gadit), as instructed by Shahbaz-", "amount": 600.0, "type": "expense", "balance": 113338.0}, {"date": "2026-06-06", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased Castic soda for AC maintenance team, as instructed by Akram-", "amount": 200.0, "type": "expense", "balance": 113138.0}, {"date": "2026-06-06", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Paid to refill cylinder for Oxygen gas for AC maintenance team , as instructed by Akram-", "amount": 300.0, "type": "expense", "balance": 112838.0}, {"date": "2026-06-08", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 08-06-26", "amount": 120.0, "type": "expense", "balance": 112718.0}, {"date": "2026-06-08", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 04Nos Nut bolt 3/8x2, for the general use, as instructed by Akram-", "amount": 140.0, "type": "expense", "balance": 112578.0}, {"date": "2026-06-08", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for ODOO team, as instructed by Khaleeq Kamali-", "amount": 520.0, "type": "expense", "balance": 112058.0}, {"date": "2026-06-08", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased cold drink for ODOO team, as instructed by Khaleeq Kamali-", "amount": 160.0, "type": "expense", "balance": 111898.0}, {"date": "2026-06-08", "bu": "Disrupt Admin", "category": "Utilities Expenses", "description": "Pay Salary to Mr. Abdullah for monthly garbage collection of 140-H and 141-D & 141-C", "amount": 4000.0, "type": "expense", "balance": 107898.0}, {"date": "2026-06-08", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to M Arif  Iron works for the door 140-H Basement bike main entrance door cutting and repairing & Parking # 03 main entrance door repairing, as per the email-", "amount": 4000.0, "type": "expense", "balance": 103898.0}, {"date": "2026-06-08", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Paid to Madina Aluminum for the for the Finance door repair work, as per the email-", "amount": 2000.0, "type": "expense", "balance": 101898.0}, {"date": "2026-06-09", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 09-06-26", "amount": 90.0, "type": "expense", "balance": 101808.0}, {"date": "2026-06-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02 Nos. Masawa sheets (1/2\" x 8' x 4') for PKR 9,000/- for the construction of a wooden structure and installation of a protective net at the Gym. Labor charges of PKR 10,000/- were also incurred, as per the emai 04-06-2026", "amount": 19000.0, "type": "expense", "balance": 82808.0}, {"date": "2026-06-09", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Paid for the maintenance work carried out at Ground Floor (140-H, Kashif’s room). Corner edges were trimmed by approximately 3 feet each to ensure proper placement and stability of the TV on its stand, as per email-", "amount": 1050.0, "type": "expense", "balance": 81758.0}, {"date": "2026-06-09", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Paid PKR 5,000/- for carpenter work in the first-floor female washroom, including the purchase of a wooden sheet costing PKR 4,880/- and the fixing of a wooden support base to secure the fallen basin marble, as per the email-", "amount": 9880.0, "type": "expense", "balance": 71878.0}, {"date": "2026-06-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the purchase and installation of a wooden structure and a fresh air intake net (Rs. 10,200) with required wall-cutting work (Rs. 9,500/-) for the Gym, as per email", "amount": 19700.0, "type": "expense", "balance": 52178.0}, {"date": "2026-06-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased hardware items (screws, nails, adhesive solution, disc, etc.) with labor charges Rs.10,000 and paid rickshaw fare for the delivery from Haji Camp to the office, as per email- 06-06-2026", "amount": 14040.0, "type": "expense", "balance": 38138.0}, {"date": "2026-06-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Royal 24'' exhaust fan for the Gym and paid labor charges for sheet cutting & fixing, as per email- 08-06-2026", "amount": 19000.0, "type": "expense", "balance": 19138.0}, {"date": "2026-06-09", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid for washing 01 Prayer Mat (Dari) 06 Jaye Namaz for prayer area 141-C, as instructed by Khaleeq Kamali-", "amount": 1100.0, "type": "expense", "balance": 18038.0}, {"date": "2026-06-09", "bu": "Disrupt Legal", "category": "Disrupt Legal", "description": "Pay the airport parking fee to Sahib ur Rehman driver for picking up M. Ovais from the airport,", "amount": 120.0, "type": "expense", "balance": 17918.0}, {"date": "2026-06-10", "bu": "Disrupt Admin", "category": "Utilities Expenses", "description": "Pay to SKY Fast cable media monthly Cable fees 140-H (JUN)", "amount": 800.0, "type": "expense", "balance": 17118.0}, {"date": "2026-06-11", "bu": "", "category": "", "description": "Cash Received from Finance", "amount": 182000.0, "type": "inflow", "balance": 199118.0}, {"date": "2026-06-11", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 11-06-26", "amount": 40.0, "type": "expense", "balance": 199078.0}, {"date": "2026-06-11", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 flexible shower for the 141-D female restroom washbasin, as instructed by Akram-", "amount": 600.0, "type": "expense", "balance": 198478.0}, {"date": "2026-06-11", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the Treadmil service & Elptilac repair and service, for Gym, as instructed by Kamran Haider-", "amount": 18000.0, "type": "expense", "balance": 180478.0}, {"date": "2026-06-11", "bu": "Disrupt Security", "category": "Disrupt Security", "description": "Purchase ice for 03 car parking plot x 01,02 & 03, 01 100 x 07 = 700, Plot 02 , 100 x 07 = 700 & Plot 03, 150 x 16 = 2400 , 16-May-2026 to 31-May-2026, 16 days", "amount": 3800.0, "type": "expense", "balance": 176678.0}, {"date": "2026-06-11", "bu": "Disrupt Security", "category": "Disrupt Security", "description": "Purchase ice for Bike parking 141-D, 100 x 16 = 1600, 16-May-2026 to 31-May-2026, 16 days", "amount": 1600.0, "type": "expense", "balance": 175078.0}, {"date": "2026-06-11", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 140-H front 16 x 300 = 4800, 16-May-2026 to 31-May-2026, 16 days", "amount": 4800.0, "type": "expense", "balance": 170278.0}, {"date": "2026-06-11", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 141-D front 16 x 300 = 4800, 16-May-2026 to 31-May-2026, 16 days", "amount": 4800.0, "type": "expense", "balance": 165478.0}, {"date": "2026-06-12", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 12-06-26", "amount": 240.0, "type": "expense", "balance": 165238.0}, {"date": "2026-06-12", "bu": "Disrupt Admin", "category": "R&M - Electronics", "description": "Purchased 01 Card for Voldam Ceiling fan 2nd floor ladies restroom 141-D, as per email-", "amount": 2000.0, "type": "expense", "balance": 163238.0}, {"date": "2026-06-12", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased 02 Jumbo cold drinks & 02 Lemon Malt for the birthday celebration of JUNE (Disrupt employees) as instructed by Shahbaz-", "amount": 800.0, "type": "expense", "balance": 162438.0}, {"date": "2026-06-12", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased Plaster of Paris & Black Cement for the 140-H office, as instructed by Akram-", "amount": 170.0, "type": "expense", "balance": 162268.0}, {"date": "2026-06-12", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Paid technician visiting charges for the Kenwood AC at the 140-H office, as instructed by Akram", "amount": 1000.0, "type": "expense", "balance": 161268.0}, {"date": "2026-06-12", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Paid to refill 02 cylinder for Oxygen gas for AC maintenance team , as instructed by Akram-", "amount": 600.0, "type": "expense", "balance": 160668.0}, {"date": "2026-06-12", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased a screw wrench 12'' for the maintenance team, as instructed by Akram-", "amount": 900.0, "type": "expense", "balance": 159768.0}, {"date": "2026-06-12", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01Nos T-P Box, 06Nos Lux & 03Nos electric tape, for the 140-H Boring pump connection, as per email-", "amount": 1800.0, "type": "expense", "balance": 157968.0}, {"date": "2026-06-12", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased 07 Nos wrapping tape, for the AC maintenance team, as instructed by Akram- 13-06-2026", "amount": 1050.0, "type": "expense", "balance": 156918.0}, {"date": "2026-06-15", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 15-06-26", "amount": 80.0, "type": "expense", "balance": 156838.0}, {"date": "2026-06-15", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for ODOO team, as instructed by Khaleeq Kamali-", "amount": 500.0, "type": "expense", "balance": 156338.0}, {"date": "2026-06-15", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased cold drink for ODOO team, as instructed by Khaleeq Kamali-", "amount": 160.0, "type": "expense", "balance": 156178.0}, {"date": "2026-06-15", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid for washing 02 Prayer Mat (Dari) 03 Jaye Namaz for prayer area 141-C, as instructed by Khaleeq Kamali-", "amount": 1300.0, "type": "expense", "balance": 154878.0}, {"date": "2026-06-15", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Paid to ARA Associates for the fixation of 10 cable tray lids and locks at the 140-H office, as per email. (Basement)", "amount": 5000.0, "type": "expense", "balance": 149878.0}, {"date": "2026-06-16", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 16-06-26", "amount": 100.0, "type": "expense", "balance": 149778.0}, {"date": "2026-06-16", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the document color printout (Room Reservation for Osman Erdogan), as instructed by Shahbaz-", "amount": 150.0, "type": "expense", "balance": 149628.0}, {"date": "2026-06-16", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Purchased 15 pairs of Push & Pull stickers for both offices, as per email-", "amount": 2200.0, "type": "expense", "balance": 147428.0}, {"date": "2026-06-16", "bu": "Disrupt Admin", "category": "R&M - Equipments Admin", "description": "Purchased a hand pump for Diesel refilling in gensets for the maintenance team, as per email-", "amount": 3500.0, "type": "expense", "balance": 143928.0}, {"date": "2026-06-16", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Paid to refill 01 cylinder for Oxygen gas for AC maintenance team , as instructed by Akram-", "amount": 300.0, "type": "expense", "balance": 143628.0}, {"date": "2026-06-17", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 17-06-26", "amount": 80.0, "type": "expense", "balance": 143548.0}, {"date": "2026-06-17", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid to Mr. Tariq 0330-4817061 for the Ground Floor 141-D male restroom drain line opening, as instructed by Khaleeq Kamali-", "amount": 500.0, "type": "expense", "balance": 143048.0}, {"date": "2026-06-17", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased lunch from (Dus Numberi) for Osman Erdogan, as per the email-", "amount": 1622.0, "type": "expense", "balance": 141426.0}, {"date": "2026-06-17", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased lunch from (Zeytin) for Osman Erdogan, as per the email-", "amount": 8500.0, "type": "expense", "balance": 132926.0}, {"date": "2026-06-18", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 18-06-26", "amount": 160.0, "type": "expense", "balance": 132766.0}, {"date": "2026-06-18", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 04Nos cold drinks for the training session at the learning center, as per the email- 04-06-26", "amount": 1000.0, "type": "expense", "balance": 131766.0}, {"date": "2026-06-18", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 commode machine (Ball cock) for the 141-D ground floor restroom, as instructed by Akram-", "amount": 500.0, "type": "expense", "balance": 131266.0}, {"date": "2026-06-18", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased a handsaw blade and a scrapper for the maintenance team, as instructed by Akram-", "amount": 370.0, "type": "expense", "balance": 130896.0}, {"date": "2026-06-18", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Paid to M Sikander 0302-2202639 for the chair repair of Waseem Ahmed as per the ticket # 95836 of Waseem Ahmed-", "amount": 500.0, "type": "expense", "balance": 130396.0}, {"date": "2026-06-18", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to Mr Kamran (vendor) for the wall cutting at 140-H office (New DB installation), as per email- 17-06-2026", "amount": 2000.0, "type": "expense", "balance": 128396.0}, {"date": "2026-06-18", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to Saeed Boring work for repair Submersible pump 0.75hp & installation charges, for 141-D office, as per email- 16-06-2026", "amount": 13000.0, "type": "expense", "balance": 115396.0}, {"date": "2026-06-18", "bu": "Disrupt Admin", "category": "Stationery", "description": "Purchased 01 Ball Pen box for the valet staff, as instructed by Khaleeq Kamali-", "amount": 300.0, "type": "expense", "balance": 115096.0}, {"date": "2026-06-18", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased two AC compressors for Room 17 (140-H) and the Reception Area (141-C). The total purchase cost was PKR 28,000/-, against which PKR 16,000/- was recovered from the sale of the old compressors as scrap, resulting in a net cost of PKR 12,000/", "amount": 12000.0, "type": "expense", "balance": 103096.0}, {"date": "2026-06-18", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased compressor oil for the AC maintenance team, as per email-", "amount": 1000.0, "type": "expense", "balance": 102096.0}, {"date": "2026-06-18", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased (Plaster of Paris, cement, soil, gurmala, scrap & 01 dozen Knail) for the plaster work at 140-H genset wall, as per email-", "amount": 1700.0, "type": "expense", "balance": 100396.0}, {"date": "2026-06-19", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Paid for the document printout for Kashif Siddiqui, requested by Shaharyar Awan & instructed by Shahbaz-", "amount": 200.0, "type": "expense", "balance": 100196.0}, {"date": "2026-06-19", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Paid for the document printout for Kashif Siddiqui, requested by Shaharyar Awan & instructed by Shahbaz-", "amount": 100.0, "type": "expense", "balance": 100096.0}, {"date": "2026-06-19", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 04 Nos Ferrule 35mm for the electric work at 140-H office, as instructed by Akram-", "amount": 400.0, "type": "expense", "balance": 99696.0}, {"date": "2026-06-19", "bu": "Disrupt Security", "category": "Disrupt Security", "description": "Purchase ice for 03 car parking plot x 01,02 & 03, 01 100 x 11 = 1100, Plot 02 , 100 x 11 = 1100 & Plot 03, 150 x 15 = 2250 , 01-Jun-2026 to 15-Jun-2026, 15 days", "amount": 4450.0, "type": "expense", "balance": 95246.0}, {"date": "2026-06-19", "bu": "Disrupt Security", "category": "Disrupt Security", "description": "Purchase ice for Bike parking 141-D, 100 x 15 = 1500, 01-Jun-2026 to 15-Jun-2026, 15 days", "amount": 1500.0, "type": "expense", "balance": 93746.0}, {"date": "2026-06-19", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 140-H front 15 x 300 = 4500, 01-Jun-2026 to 15-Jun-2026, 15 days", "amount": 4500.0, "type": "expense", "balance": 89246.0}, {"date": "2026-06-19", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 141-D front 15 x 300 = 4500, 01-Jun-2026 to 15-Jun-2026, 15 days", "amount": 4500.0, "type": "expense", "balance": 84746.0}, {"date": "2026-06-22", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 22-06-26", "amount": 20.0, "type": "expense", "balance": 84726.0}, {"date": "2026-06-22", "bu": "Disrupt Admin", "category": "Commission Expense", "description": "Paid to Mr Majid 0311-2696657 (KE) for the 140-H office main line cut-off and DB installation (02 Visits), as instructed by Kamran Haider- 19-06-26", "amount": 11000.0, "type": "expense", "balance": 73726.0}, {"date": "2026-06-22", "bu": "Disrupt Admin", "category": "Entertainment", "description": "Purchased dinner for (Shamroze, Akram, Ibraheem Haris, Owaiz & Sagar) for 140-H DB installation work (late night sitting)- as instructed by Kamran Haider- + DB Installation vendors (04Nos)", "amount": 2200.0, "type": "expense", "balance": 71526.0}, {"date": "2026-06-23", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 23-06-26", "amount": 145.0, "type": "expense", "balance": 71381.0}, {"date": "2026-06-23", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 04Nos Valet Jacket and embosing on Valet name on jacket, as per email-", "amount": 2050.0, "type": "expense", "balance": 69331.0}, {"date": "2026-06-23", "bu": "Disrupt Admin", "category": "R&M - Equipments Admin", "description": "Purchased 06Nos Jubilee clip for genset 141-C, as instructed by Shamroze-", "amount": 360.0, "type": "expense", "balance": 68971.0}, {"date": "2026-06-23", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased lunch for the Indus Hospital team (Blood Donation Drive) (Beef Pulao 10 Nos Rs.4000, Raita 02Nos Rs.100, Cold drink Fizzup 1.5 ltr 2 Nos Rs. 400 & Salad 02Nos Rs.200), as per email", "amount": 4700.0, "type": "expense", "balance": 64271.0}, {"date": "2026-06-23", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01  End cap for Cafe motor pipe, as instructed by Akram-", "amount": 50.0, "type": "expense", "balance": 64221.0}, {"date": "2026-06-23", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 box (Black Gloves) for the Pantry & Cafe staff, as instructed by Shahbaz-", "amount": 1200.0, "type": "expense", "balance": 63021.0}, {"date": "2026-06-23", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid for washing 01 Prayer Mat (Dari) 01 Jaye Namaz for prayer area 141-C, as instructed by Khaleeq Kamali-", "amount": 500.0, "type": "expense", "balance": 62521.0}, {"date": "2026-06-27", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 35mm Bit, for the maintenance team, as instructed by Akram-", "amount": 650.0, "type": "expense", "balance": 61871.0}, {"date": "2026-06-27", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 pack of C Clip for the maintenance team general use, as instructed by Akram-", "amount": 150.0, "type": "expense", "balance": 61721.0}, {"date": "2026-06-27", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased ( socket 01, endcap 02, solution) and paid labor charges for plumbing work at 141-C Cafe motor line, as instructed by Akram-", "amount": 2100.0, "type": "expense", "balance": 59621.0}, {"date": "2026-06-27", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Funnel for the maintenance team general use, as instructed by Akram-", "amount": 100.0, "type": "expense", "balance": 59521.0}, {"date": "2026-06-27", "bu": "Disrupt Admin", "category": "R&M - Equipments Admin", "description": "Purchased 02 cartons of distilled water for UPS battery water refilling at both offices, as per email-", "amount": 2200.0, "type": "expense", "balance": 57321.0}, {"date": "2026-06-27", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the 14Nos color printout on glossy paper with lamination, for foreigners (Room Reservation, workplace support, etc) as instructed by Shahbaz-", "amount": 1310.0, "type": "expense", "balance": 56011.0}, {"date": "2026-06-29", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 29-06-26", "amount": 385.0, "type": "expense", "balance": 55626.0}, {"date": "2026-06-29", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for ODOO team, as instructed by Khaleeq Kamali-", "amount": 500.0, "type": "expense", "balance": 55126.0}, {"date": "2026-06-29", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased cold drink for ODOO team, as instructed by Khaleeq Kamali-", "amount": 160.0, "type": "expense", "balance": 54966.0}, {"date": "2026-06-29", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the color printout on glossy paper with lamination, QR Codes, as instructed by Shahbaz-", "amount": 200.0, "type": "expense", "balance": 54766.0}, {"date": "2026-06-29", "bu": "Disrupt Admin", "category": "Stationery", "description": "Purchased stamp paper, including document formatting, printing, and photocopying charges, for K.E meter request, as instructed by Akram-", "amount": 400.0, "type": "expense", "balance": 54366.0}, {"date": "2026-06-29", "bu": "Disrupt IT", "category": "Disrupt IT", "description": "Purchased Energizer Max AA BP-8 battery cell, as per ticket # 95944, of Faham Hanif-", "amount": 2121.0, "type": "expense", "balance": 52245.0}, {"date": "2026-06-29", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02 Spindle for the 140-H & 141-C Cafe washing area tap, as instructed by Shamroze-", "amount": 900.0, "type": "expense", "balance": 51345.0}, {"date": "2026-06-30", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 30-06-26", "amount": 60.0, "type": "expense", "balance": 51285.0}, {"date": "2026-06-30", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Card for Voldam Ceiling fan 140-H floor Pantry, as instructed by Akram-", "amount": 2000.0, "type": "expense", "balance": 49285.0}, {"date": "2026-06-30", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to Saeed Boring work for Submersible pump fitting work at 141-D, as instructed by Shamroze-", "amount": 2000.0, "type": "expense", "balance": 47285.0}, {"date": "2026-07-01", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 01-07-26", "amount": 85.0, "type": "expense", "balance": 47200.0}, {"date": "2026-07-01", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for ODOO team, as instructed by Khaleeq Kamali-", "amount": 500.0, "type": "expense", "balance": 46700.0}, {"date": "2026-07-01", "bu": "Gz Systems", "category": "Gz Systems", "description": "Paid for the color printout with lamination for PVPN teams, as instructed by Khaleeq Kamali-", "amount": 500.0, "type": "expense", "balance": 46200.0}, {"date": "2026-07-01", "bu": "Disrupt Admin", "category": "R&M - Equipments Admin", "description": "Purchased 02Nos Genset belts A-53 CAT for the genset, as instructed by Akram-", "amount": 700.0, "type": "expense", "balance": 45500.0}, {"date": "2026-07-01", "bu": "Auto Os", "category": "Auto Os", "description": "Paid for the laptop courier via TCS to 3546 Abdur Rehman to Lahore, (CN # 306064113254), as per the email-", "amount": 4005.0, "type": "expense", "balance": 41495.0}, {"date": "2026-07-02", "bu": "", "category": "", "description": "Cash Received from Finance", "amount": 143500.0, "type": "inflow", "balance": 184995.0}, {"date": "2026-07-02", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 02-06-26", "amount": 145.0, "type": "expense", "balance": 184850.0}, {"date": "2026-07-02", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for ODOO team, as instructed by Khaleeq Kamali-", "amount": 751.0, "type": "expense", "balance": 184099.0}, {"date": "2026-07-02", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased 02 Nos. Mango Shake for the ODOO team, as instructed by Khaleeq Kamali-", "amount": 600.0, "type": "expense", "balance": 183499.0}, {"date": "2026-07-02", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to repair the aluminum window for Sir Rafay Gadit's room, as instructed by Akram-", "amount": 2000.0, "type": "expense", "balance": 181499.0}, {"date": "2026-07-02", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 01 mango Shake for Mobeen Ahmed's (3465), as per the ticket # 95983 of Sanober Syed-", "amount": 450.0, "type": "expense", "balance": 181049.0}, {"date": "2026-07-02", "bu": "Disrupt Procurement", "category": "Disrupt Procurement", "description": "Paid for Raashan offloading to (Mr. Irfan 0348-3825412) - Disrupt Procurement", "amount": 4000.0, "type": "expense", "balance": 177049.0}, {"date": "2026-07-02", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased 01 Football Game set for the 141-D campus, as per email- 10-06-2026", "amount": 3500.0, "type": "expense", "balance": 173549.0}, {"date": "2026-07-02", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased 01 football and a table tennis net for the 141-D campus, as per email- 15-06-2026", "amount": 1400.0, "type": "expense", "balance": 172149.0}, {"date": "2026-07-02", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased 01 Football Game set for the 140-H campus, as per email- 22-06-2026", "amount": 3500.0, "type": "expense", "balance": 168649.0}, {"date": "2026-07-02", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased plants (Black Ficus 04, Ixora 03, Z-Roofa 04 & Lady Palm 04) for 141-D first floor walkway area, as per email- 26-06-2026", "amount": 7400.0, "type": "expense", "balance": 161249.0}, {"date": "2026-07-02", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased plants (Kent Palm 06, Kaner 01, Fertilizer khaad & soil) for 141-D first floor walkway area, as per email- 28-06-2026", "amount": 5150.0, "type": "expense", "balance": 156099.0}, {"date": "2026-07-03", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased medicine (Imodium 01 strip Rs.80 & Enterogermina 02 Rs.190) for a foreign employee, as per email-", "amount": 270.0, "type": "expense", "balance": 155829.0}, {"date": "2026-07-03", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased lunch from Xanders for foreign employee, as per the email- 01-07-2026", "amount": 2100.0, "type": "expense", "balance": 153729.0}, {"date": "2026-07-03", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased refreshments (Chilli mili, cocomo, Tea) for Ali Samir, as per email- 29-06-2026", "amount": 410.0, "type": "expense", "balance": 153319.0}, {"date": "2026-07-03", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased cold drinks 12Nos for the Aqib Zafar's team meeting, as per the email- 01-07-2026", "amount": 1440.0, "type": "expense", "balance": 151879.0}, {"date": "2026-07-03", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 01 Tea for the CLT meeting, as per email- 29-06-2026", "amount": 80.0, "type": "expense", "balance": 151799.0}, {"date": "2026-07-03", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased refreshments (cocomo, chilli mili) for Ali Oosman Samir, as per email- 29-06-2026", "amount": 300.0, "type": "expense", "balance": 151499.0}, {"date": "2026-07-03", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 04Nos cold drinks for the foreign employee's, as instructed by Shahbaz-", "amount": 480.0, "type": "expense", "balance": 151019.0}, {"date": "2026-07-03", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 commode push button for the 141-D, restroom, as instructed by Akram-", "amount": 400.0, "type": "expense", "balance": 150619.0}, {"date": "2026-07-03", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to repair the 100W LED light for 140-H backside street, as instructed by Shamroze-", "amount": 1000.0, "type": "expense", "balance": 149619.0}, {"date": "2026-07-06", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 06-07-26", "amount": 325.0, "type": "expense", "balance": 149294.0}, {"date": "2026-07-06", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Paid for the 140-H meeting POD room & 140-H Cafe door repair, as instructed by Akram-", "amount": 3500.0, "type": "expense", "balance": 145794.0}, {"date": "2026-07-07", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 07-07-26", "amount": 130.0, "type": "expense", "balance": 145664.0}, {"date": "2026-07-08", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 08-06-26", "amount": 250.0, "type": "expense", "balance": 145414.0}, {"date": "2026-07-08", "bu": "Gz Systems", "category": "Gz Systems", "description": "Purchased refreshments for secure.com workshop, as per email- 02-07-26", "amount": 6200.0, "type": "expense", "balance": 139214.0}, {"date": "2026-07-08", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased cakes for a birthday celebration for the July batch 01 ( 991 Ahmer Jamil, 1343 Ahsan Hussain, 2485 Zeeshan Rehman & 3466 Arsalan Yousuf) , as instructed per email- 02-07-26", "amount": 7460.0, "type": "expense", "balance": 131754.0}, {"date": "2026-07-08", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased 05Nos Foil balloons for the birthday celebration, as per email-", "amount": 500.0, "type": "expense", "balance": 131254.0}, {"date": "2026-07-08", "bu": "Disrupt Legal", "category": "Disrupt Legal", "description": "Purchased lunch for the Legal department Team, as instructed by Khaleeq Kamali- 02-07-26", "amount": 5560.0, "type": "expense", "balance": 125694.0}, {"date": "2026-07-08", "bu": "Zignaly", "category": "Zignaly", "description": "Purchased lunch for the Interns-Zignaly Team, as instructed by Shahbaz-", "amount": 600.0, "type": "expense", "balance": 125094.0}, {"date": "2026-07-08", "bu": "Zignaly", "category": "Zignaly", "description": "Purchased lunch for the Interns-Zignaly Team, as instructed by Shahbaz-", "amount": 950.0, "type": "expense", "balance": 124144.0}, {"date": "2026-07-08", "bu": "Zignaly", "category": "Zignaly", "description": "Purchased 03Nos Cold drinks for the Interns-Zignaly team, as instructed by Shahbaz-", "amount": 390.0, "type": "expense", "balance": 123754.0}, {"date": "2026-07-08", "bu": "Zignaly", "category": "Zignaly", "description": "Purchased 10Nos Cold drinks for the Interns-Zignaly team, as instructed by Shahbaz- 07-07-26", "amount": 800.0, "type": "expense", "balance": 122954.0}, {"date": "2026-07-08", "bu": "N-Dir Entertainment", "category": "N-Dir Entertainment", "description": "Purchased refreshments for Sir Rafay Gadit & guests, as instructed by Shahbaz- 06-07-26", "amount": 1834.0, "type": "expense", "balance": 121120.0}, {"date": "2026-07-08", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the color printout on glossy paper with lamination, for the Director's (Room Reservation, workplace support, etc) as instructed by Shahbaz-", "amount": 400.0, "type": "expense", "balance": 120720.0}, {"date": "2026-07-08", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the color printout on glossy paper with lamination, for the Director's (Welcome Template, QR Codes, for ordering) as instructed by Shahbaz-", "amount": 400.0, "type": "expense", "balance": 120320.0}, {"date": "2026-07-08", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Tap head for the 141-C GCR, as instructed by Akram-", "amount": 650.0, "type": "expense", "balance": 119670.0}, {"date": "2026-07-08", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased 01 fizzup jumbo cold drink and Ice, for fifa match, at 140-H Cafe, for employees, as instructed by Khaleeq Kamali-", "amount": 300.0, "type": "expense", "balance": 119370.0}, {"date": "2026-07-08", "bu": "Disrupt Security", "category": "Disrupt Security", "description": "Purchase ice for 03 car parking plot x 01,02 & 03, 01 100 x 09 = 900, Plot 02 , 100 x 09 = 900 & Plot 03, 150 x 15 = 2250 , 16-Jun-2026 to 30-Jun-2026, 15 days", "amount": 4050.0, "type": "expense", "balance": 115320.0}, {"date": "2026-07-08", "bu": "Disrupt Security", "category": "Disrupt Security", "description": "Purchase ice for Bike parking 141-D, 100 x 15 = 1500, 16-Jun-2026 to 30-Jun-2026, 15 days", "amount": 1500.0, "type": "expense", "balance": 113820.0}, {"date": "2026-07-08", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 140-H front 15 x 300 = 4500, 16-Jun-2026 to 30-Jun-2026, 15 days", "amount": 4500.0, "type": "expense", "balance": 109320.0}, {"date": "2026-07-08", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 141-D front 15 x 300 = 4500, 16-Jun-2026 to 30-Jun-2026, 15 days", "amount": 4500.0, "type": "expense", "balance": 104820.0}, {"date": "2026-07-08", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid for the photos printing for birthday celebration, as instructed by Shahbaz-", "amount": 200.0, "type": "expense", "balance": 104620.0}, {"date": "2026-07-08", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid for the photos printing for birthday celebration, as instructed by Shahbaz-", "amount": 150.0, "type": "expense", "balance": 104470.0}, {"date": "2026-07-08", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid for the photos printing for birthday celebration, as instructed by Shahbaz-", "amount": 250.0, "type": "expense", "balance": 104220.0}, {"date": "2026-07-08", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased 02Nos Foil balloons for the birthday celebration, as per email-", "amount": 200.0, "type": "expense", "balance": 104020.0}, {"date": "2026-07-08", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Paid for the printouts (Star performance of the month) for Disrupt Lab, as instructed by Shahbaz-", "amount": 100.0, "type": "expense", "balance": 103920.0}, {"date": "2026-07-08", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Paid for the printouts (Star performance of the month) for Disrupt Lab, as instructed by Shahbaz-", "amount": 400.0, "type": "expense", "balance": 103520.0}, {"date": "2026-07-09", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 09-06-26", "amount": 290.0, "type": "expense", "balance": 103230.0}, {"date": "2026-07-09", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased 01 drain pipe for the 140-H backside AC drain line, as instructed by Akram-", "amount": 1000.0, "type": "expense", "balance": 102230.0}, {"date": "2026-07-09", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Paid for the Disrupt.com Letter head printouts, as per ticket # 96076 of Javeria Sami-", "amount": 1400.0, "type": "expense", "balance": 100830.0}, {"date": "2026-07-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased ( earthing box, copper patti, nut bold SS) for 140-H office, as instructed by Shamroze-", "amount": 3000.0, "type": "expense", "balance": 97830.0}, {"date": "2026-07-09", "bu": "Disrupt Legal", "category": "Disrupt Legal", "description": "Paid for the color printouts for the legal department, requested by Tanya and instructed by Mohsin-", "amount": 470.0, "type": "expense", "balance": 97360.0}, {"date": "2026-07-09", "bu": "N-Dir Entertainment", "category": "N-Dir Entertainment", "description": "Purchased 02Nos cold drinks for Sir Rafay & Uzair Gadit, as instructed-", "amount": 260.0, "type": "expense", "balance": 97100.0}, {"date": "2026-07-09", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 drain strainer SS, for the 141-C Wuzu area, as instructed by Shahbaz-", "amount": 600.0, "type": "expense", "balance": 96500.0}, {"date": "2026-07-10", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 10-06-26", "amount": 120.0, "type": "expense", "balance": 96380.0}, {"date": "2026-07-10", "bu": "Zignaly", "category": "Zignaly", "description": "Purchased lunch for the Interns-Zignaly Team, as instructed by Shahbaz-", "amount": 600.0, "type": "expense", "balance": 95780.0}, {"date": "2026-07-10", "bu": "Zignaly", "category": "Zignaly", "description": "Purchased 03Nos Cold drinks for the Interns-Zignaly team, as instructed by Shahbaz-", "amount": 800.0, "type": "expense", "balance": 94980.0}, {"date": "2026-07-13", "bu": "", "category": "", "description": "Cash Received from Finance (08-07-26 received by Shahbaz for SLT event)", "amount": 220000.0, "type": "inflow", "balance": 314980.0}, {"date": "2026-07-13", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 13-06-26", "amount": 145.0, "type": "expense", "balance": 314835.0}, {"date": "2026-07-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 commode seat cover for 141-D 2nd floor female restroom, as instructed by Akram-", "amount": 1900.0, "type": "expense", "balance": 312935.0}, {"date": "2026-07-13", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid for Photo printout for M Adil, for Birthday celebration, as instructed by Shahbaz-", "amount": 50.0, "type": "expense", "balance": 312885.0}, {"date": "2026-07-13", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased 01Nos Foil Balloon for M Adil, birthday celebration, as instructed by Shahbaz-", "amount": 150.0, "type": "expense", "balance": 312735.0}, {"date": "2026-07-13", "bu": "G&A", "category": "G&A", "description": "Purchased 02Kg apple for weekly G&A meeting, as instructed by Shahbaz-", "amount": 600.0, "type": "expense", "balance": 312135.0}, {"date": "2026-07-13", "bu": "Squatwolf", "category": "Squatwolf", "description": "Paid for photos printout for Ayesha Arif Abbasi, as requested by Majid-", "amount": 150.0, "type": "expense", "balance": 311985.0}, {"date": "2026-07-13", "bu": "Squatwolf", "category": "Squatwolf", "description": "Paid to KCCI for Ayesha Arif Abbasi, Visa Fee, as instructed-", "amount": 2000.0, "type": "expense", "balance": 309985.0}, {"date": "2026-07-13", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 04Nos Acid for 140-H pool cleaning, as instructed by Shahbaz- 11-07-26", "amount": 600.0, "type": "expense", "balance": 309385.0}, {"date": "2026-07-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 05Nos double push button for general use, as instructed by Akram- 10-07-26", "amount": 1750.0, "type": "expense", "balance": 307635.0}, {"date": "2026-07-13", "bu": "Disrupt Admin", "category": "R&M - Electronics", "description": "Paid for TCL AC display repair for 141-D Room # 17, as instructed by Akram- 10-07-26", "amount": 300.0, "type": "expense", "balance": 307335.0}, {"date": "2026-07-13", "bu": "N-Dir Entertainment", "category": "N-Dir Entertainment", "description": "Purchased 02Ctn Fizzup & Next Cola for EC meeting, as instructed by Khaleeq Kamali- 10-07-26", "amount": 2200.0, "type": "expense", "balance": 305135.0}, {"date": "2026-07-13", "bu": "N-Dir Entertainment", "category": "N-Dir Entertainment", "description": "Purchcased 01ctn Sparkling water for EC meeting, as instructed by Khaleeq Kamali- 10-07-26", "amount": 1140.0, "type": "expense", "balance": 303995.0}, {"date": "2026-07-13", "bu": "N-Dir Entertainment", "category": "N-Dir Entertainment", "description": "Purchased 01 Ctn Diet Cola Next & 01Ctn Diet Fizzup, for EC meeting, as instructed by Khaleeq Kamali- 10-07-26", "amount": 2154.0, "type": "expense", "balance": 301841.0}, {"date": "2026-07-13", "bu": "Corp Comm", "category": "Corp Comm", "description": "Purchased 90 Pizzas Live, Chicken Tikka, Beef Pepperoni, Margarita, vegi, each person 1.5, with 4 waiters, for SLT event", "amount": 60000.0, "type": "expense", "balance": 241841.0}, {"date": "2026-07-13", "bu": "Corp Comm", "category": "Corp Comm", "description": "Purchased Chicken cheese tempura 150 with Opa fries Live cooking, for SLT event", "amount": 32000.0, "type": "expense", "balance": 209841.0}, {"date": "2026-07-13", "bu": "Corp Comm", "category": "Corp Comm", "description": "Purchased lunch: Rental 10 buffet with tongs and transportation for SLT event", "amount": 10000.0, "type": "expense", "balance": 199841.0}, {"date": "2026-07-13", "bu": "Corp Comm", "category": "Corp Comm", "description": "Purchcased Hotel Tea without sugar and 2 packets of softmint ice candy, for SLT event", "amount": 7100.0, "type": "expense", "balance": 192741.0}, {"date": "2026-07-14", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 14-06-26", "amount": 145.0, "type": "expense", "balance": 192596.0}, {"date": "2026-07-14", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Purchased 1kg Iron Nail for work at 141-D 1st floor, bamboo partition fixing, 01 rope & 01 Needle, for fix the 141-C smoking area shade, as instructed by Akram", "amount": 750.0, "type": "expense", "balance": 191846.0}, {"date": "2026-07-14", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid for 13 Nos. of photo printouts for (Arsalan Rashid, Isfand Yar Khan, Shehroze Hussain, Ali Azaz, Junaid Sharif, Jebran Rasheed, Ammar Ali Danish, Amir Raza, Mujtaba Sheikh, Syed Shoaib Ahmed, Hassan Dad Khan, Dhanesh Kumar, Hareem Fatima & Areeba Shahid) for the birthday celebration, as instructed by Shahbaz-", "amount": 650.0, "type": "expense", "balance": 191196.0}, {"date": "2026-07-14", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased 01Nos Foil Balloon for Areeba Shahid, birthday celebration, as instructed by Shahbaz-", "amount": 200.0, "type": "expense", "balance": 190996.0}, {"date": "2026-07-14", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Pay Salary to Mr. Abdullah for monthly garbage collection of 140-H and 141-D & 141-C", "amount": 4000.0, "type": "expense", "balance": 186996.0}, {"date": "2026-07-14", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchasd 17Nos spray gun for the both offices, general use, as instructed by Khaleeq Kamali-", "amount": 3060.0, "type": "expense", "balance": 183936.0}, {"date": "2026-07-14", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 02Nos empty hand sanitizer bottles, as instructed by Khaleeq Kamali-", "amount": 130.0, "type": "expense", "balance": 183806.0}, {"date": "2026-07-14", "bu": "Zignaly", "category": "Zignaly", "description": "Purchased lunch (Chicken Matka Biryani) for Zignaly team guest, as instructed by Shahbaz- 10-07-26", "amount": 5600.0, "type": "expense", "balance": 178206.0}, {"date": "2026-07-15", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 15-06-26", "amount": 550.0, "type": "expense", "balance": 177656.0}, {"date": "2026-07-15", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased a dry filter & a pin valve for the 141-D second floor water dispenser, as instructed by Akram-", "amount": 400.0, "type": "expense", "balance": 177256.0}, {"date": "2026-07-15", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 holesaw for the maintenance team, general use, as instructed by Akram-", "amount": 600.0, "type": "expense", "balance": 176656.0}, {"date": "2026-07-15", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos tissue holders for the ground floor 141-D restroom, as instructed by Akram-", "amount": 800.0, "type": "expense", "balance": 175856.0}, {"date": "2026-07-15", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the kettle repair for 141-D 2nd floor pantry, as instructed by Khaleeq Kamali-", "amount": 300.0, "type": "expense", "balance": 175556.0}, {"date": "2026-07-15", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Kettle top cap, for kettle, as instructed by Khaleeq Kamali-", "amount": 150.0, "type": "expense", "balance": 175406.0}, {"date": "2026-07-15", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for kettle chrome, for 141-D 2nd floor kettle, as instructed by Khaleeq Kamali-", "amount": 200.0, "type": "expense", "balance": 175206.0}, {"date": "2026-07-15", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid for washing 02 Prayer Mat (Dari)  for prayer area 141-C, as instructed by Khaleeq Kamali-", "amount": 1000.0, "type": "expense", "balance": 174206.0}, {"date": "2026-07-15", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 bowl, for general use, as instructed by Khaleeq Kamali-", "amount": 95.0, "type": "expense", "balance": 174111.0}, {"date": "2026-07-15", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid for Photo printout for Syed Ashar Rashidi, for Birthday celebration, as instructed by Shahbaz-", "amount": 50.0, "type": "expense", "balance": 174061.0}, {"date": "2026-07-15", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid for 06 Nos. of photo printouts  for the birthday celebration, as instructed by Shahbaz-", "amount": 250.0, "type": "expense", "balance": 173811.0}, {"date": "2026-07-15", "bu": "Disrupt Admin", "category": "Disrupt Admin", "description": "Purchased 02Nos holder for the maintenance team, as instructed by Shamroze-", "amount": 100.0, "type": "expense", "balance": 173711.0}, {"date": "2026-07-15", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the drain line opening from Gym till outside of 141-D, to Mr Tariq & Mr. Dilawar, 0330-4817061, as instructed by Khaleeq Kamali-", "amount": 5500.0, "type": "expense", "balance": 168211.0}, {"date": "2026-07-16", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 16-06-26", "amount": 205.0, "type": "expense", "balance": 168006.0}, {"date": "2026-07-16", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 foot valve for 141-C pool and 01 commode machine for 141-D restroom, as instructed by Akram-", "amount": 1600.0, "type": "expense", "balance": 166406.0}, {"date": "2026-07-16", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased wire 1/2kg, iron nail 1.5 dozen & steel nail 1.5 dozen for the 1st floor bamboo installation, as instructed by Akram-", "amount": 825.0, "type": "expense", "balance": 165581.0}, {"date": "2026-07-16", "bu": "Disrupt Security", "category": "Disrupt Security", "description": "Purchase ice for 03 car parking plot x 01,02 & 03, 01 100 x 11 = 1100, Plot 02 , 100 x 11 = 1100 & Plot 03, 150 x 15 = 2250 , 01-Jul-2026 to 15-Jul-2026, 15 days", "amount": 4450.0, "type": "expense", "balance": 161131.0}, {"date": "2026-07-16", "bu": "Disrupt Security", "category": "Disrupt Security", "description": "Purchase ice for Bike parking 141-D, 100 x 15 = 1500, 01-Jul-2026 to 15-Jul-2026, 15 days", "amount": 1500.0, "type": "expense", "balance": 159631.0}, {"date": "2026-07-16", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 140-H front 15 x 300 = 4500, 01-Jul-2026 to 15-Jul-2026, 15 days", "amount": 4500.0, "type": "expense", "balance": 155131.0}, {"date": "2026-07-16", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 141-D front 15 x 300 = 4500, 01-Jul-2026 to 15-Jul-2026, 15 days", "amount": 4500.0, "type": "expense", "balance": 150631.0}, {"date": "2026-07-17", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 17-06-26", "amount": 170.0, "type": "expense", "balance": 150461.0}, {"date": "2026-07-17", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid to for main drain line opening at the backside alley of 140-H, as instructed by Shahbaz-", "amount": 1500.0, "type": "expense", "balance": 148961.0}, {"date": "2026-07-17", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Soil (raiti) bag for pavor fixing work at 141-C, as instructed by Akram-", "amount": 250.0, "type": "expense", "balance": 148711.0}, {"date": "2026-07-17", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased termite treatment chemical and one 2-liter hand sprayer for applying the termite control solution, as instructed by Akram-", "amount": 2650.0, "type": "expense", "balance": 146061.0}, {"date": "2026-07-17", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased one 18W indoor AC blower motor for Rs. 3,000. The old blower motor was exchanged for Rs. 1,000, resulting in a net payable amount of Rs. 2,000 , for 140-H office room # 08, as instructed by Akram-", "amount": 2000.0, "type": "expense", "balance": 144061.0}, {"date": "2026-07-17", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 11Kg Hypo and 02 Acid bottles for both campuses, restroom's & pool cleaning, as instructed by Khaleeq Kamali-", "amount": 980.0, "type": "expense", "balance": 143081.0}, {"date": "2026-07-18", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 02 chamber cover 12 x 12, for the 140-H & 141-C Wuzu Area, as instructed by Khaleeq Kamali-", "amount": 1300.0, "type": "expense", "balance": 141781.0}, {"date": "2026-07-18", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid for 01 Nos. of photo printouts  for the birthday celebration Hassan Dad Khan, as instructed by Shahbaz-", "amount": 50.0, "type": "expense", "balance": 141731.0}, {"date": "2026-07-20", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 20-06-26", "amount": 260.0, "type": "expense", "balance": 141471.0}, {"date": "2026-07-20", "bu": "Disrupt Admin", "category": "Commission Expense", "description": "Paid for the (wire installation + meter connection charges) to third party for 140-H office, as instructed by Kamran Hadier", "amount": 35000.0, "type": "expense", "balance": 106471.0}, {"date": "2026-07-20", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased one 03'' E deluxe light for the 141-D ground floor restroom, as instructed by Akram-", "amount": 300.0, "type": "expense", "balance": 106171.0}, {"date": "2026-07-20", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid for the 07 manholes opening at 140-H backside alley, to Mr Nasir, as per email-", "amount": 3000.0, "type": "expense", "balance": 103171.0}, {"date": "2026-07-21", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 21-06-26", "amount": 510.0, "type": "expense", "balance": 102661.0}, {"date": "2026-07-21", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased plants (Lady Palm, Ixora Red mini, Sada Bahar, for the 140-H main door walkways, entrance), Greenery Enhancement as per the email- 11-07-2026", "amount": 9800.0, "type": "expense", "balance": 92861.0}, {"date": "2026-07-21", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased  Plants (Areca Palm, Croton, Euphorbia, for the 140-H Garden area boundary, main door walkways), Greenery Enhancement as per the email- 12-07-2026", "amount": 8250.0, "type": "expense", "balance": 84611.0}, {"date": "2026-07-21", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased  Plants (Cane Palm Golden Ficus, with transportation charges, for the 141-C main entrance wall and boundary wall), Greenery Enhancement as per the email- 11-07-2026", "amount": 8650.0, "type": "expense", "balance": 75961.0}, {"date": "2026-07-21", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased  Plants (Areca Palm, Croton, Jatropha Golden Araila plant, for the 141-C D water pool boundary), Greenery Enhancement as per the email- 12-07-2026", "amount": 7850.0, "type": "expense", "balance": 68111.0}, {"date": "2026-07-21", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos Gul Mohar plant, fertilizer, suzuki fare + labor charges, for parking plot No. 2, as per email- 01-07-2026", "amount": 7500.0, "type": "expense", "balance": 60611.0}, {"date": "2026-07-21", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for 01 Nos. of photo printouts  for the birthday celebration Taimoor, as instructed by Shahbaz-", "amount": 50.0, "type": "expense", "balance": 60561.0}, {"date": "2026-07-21", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 03Ltr SBR chemical, Plaster of Paris 3kg & white cement 10Kg, for both campuses waterproofing, for rain precautions, as instructed by Akram-", "amount": 2550.0, "type": "expense", "balance": 58011.0}, {"date": "2026-07-21", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 commode machine set for the 141-D 2nd floor restroom, as instructed by Akram-", "amount": 2500.0, "type": "expense", "balance": 55511.0}, {"date": "2026-07-21", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 double tape for general use, as instructed by Shahbaz", "amount": 195.0, "type": "expense", "balance": 55316.0}, {"date": "2026-07-21", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for ODOO team, as instructed by Khaleeq Kamali-", "amount": 900.0, "type": "expense", "balance": 54416.0}, {"date": "2026-07-21", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased cold drink for ODOO team, as instructed by Khaleeq Kamali-", "amount": 270.0, "type": "expense", "balance": 54146.0}, {"date": "2026-07-21", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid for towel washing for the Advisor room, as instructed by Shahbaz-", "amount": 80.0, "type": "expense", "balance": 54066.0}, {"date": "2026-07-21", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Paid for washing 01 Prayer Mat (Dari) prayer area 141-C, as instructed by Khaleeq Kamali-", "amount": 500.0, "type": "expense", "balance": 53566.0}, {"date": "2026-07-22", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 22-07-26", "amount": 585.0, "type": "expense", "balance": 52981.0}, {"date": "2026-07-22", "bu": "Auto Os", "category": "Auto Os", "description": "Pay for Car Fuel fill-up  BYA-346, for the Auto OS team, as per e-mail, closing balance is Rs. 3,000", "amount": 3000.0, "type": "expense", "balance": 49981.0}, {"date": "2026-07-22", "bu": "Disrupt Admin", "category": "Water & Sewerage", "description": "Purchase a water tanker to refill the tank of 140-H- office as instructed by Shahbaz-", "amount": 6000.0, "type": "expense", "balance": 43981.0}, {"date": "2026-07-22", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos Turtles and their feed for the 140-H office pool, as instructed by Shahbaz-", "amount": 1400.0, "type": "expense", "balance": 42581.0}, {"date": "2026-07-22", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 05 bags of soil for the 140-H office to cover the area from rain water (rain precaution) , as instructed by Akram", "amount": 1250.0, "type": "expense", "balance": 41331.0}, {"date": "2026-07-22", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid for 01 Nos. of photo printouts for the birthday celebration of Danish Khan, as instructed by Shahbaz-", "amount": 50.0, "type": "expense", "balance": 41281.0}, {"date": "2026-07-22", "bu": "Disrupt Admin", "category": "Utilities Expenses", "description": "Pay to SKY Fast cable media monthly Cable fees 140-H (JUL) 10-07-26", "amount": 800.0, "type": "expense", "balance": 40481.0}, {"date": "2026-07-23", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 23-07-26", "amount": 280.0, "type": "expense", "balance": 40201.0}, {"date": "2026-07-23", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to repair 03Nos lights for front street of offices, as instructed by Akram-", "amount": 2500.0, "type": "expense", "balance": 37701.0}, {"date": "2026-07-23", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 light driver 20-24w for the 140-H basement, as instructed by Akram-", "amount": 250.0, "type": "expense", "balance": 37451.0}, {"date": "2026-07-23", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 04Ltr SBR chemical, Plaster of Paris 3kg, for both campuses waterproofing, for rain precautions, as instructed by Akram-", "amount": 1900.0, "type": "expense", "balance": 35551.0}, {"date": "2026-07-23", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid for 01 Nos. of photo printouts for the birthday celebration of Bilal Arif, as instructed by Shahbaz-", "amount": 50.0, "type": "expense", "balance": 35501.0}, {"date": "2026-07-24", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid for 01 Nos. of photo printouts & card for the birthday celebration of Umair Gadit, as instructed by Shahbaz-", "amount": 150.0, "type": "expense", "balance": 35351.0}, {"date": "2026-07-24", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid for 01 Nos. of photo printouts for the birthday celebration of Umair Gadit, as instructed by Shahbaz-", "amount": 50.0, "type": "expense", "balance": 35301.0}, {"date": "2026-07-24", "bu": "Legal Entertainment", "category": "Legal Entertainment", "description": "Purchased lunch For Ovais bhai, - as requested by Ovais bhai-", "amount": 950.0, "type": "expense", "balance": 34351.0}, {"date": "2026-07-24", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 20kg cement, 05Ltr SBR, Plaster of Paris & 05'' brush, for both campuses waterproofing, for rain precautions, as instructed by Akram-", "amount": 4050.0, "type": "expense", "balance": 30301.0}, {"date": "2026-07-25", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 screwdriver for the AC maintenance team, as instructed by Akram-", "amount": 450.0, "type": "expense", "balance": 29851.0}, {"date": "2026-07-25", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02 Nos. hinges for the door installation outside the maintenance room, as instructed by Akram", "amount": 200.0, "type": "expense", "balance": 29651.0}, {"date": "2026-07-25", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 valve & 01 lighter for IT room 141-D, as instructed by Akram-", "amount": 750.0, "type": "expense", "balance": 28901.0}, {"date": "2026-07-25", "bu": "N-Dir Entertainment", "category": "N-Dir Entertainment", "description": "Purchased cold drinks for director meeting, as instructed by Shahbaz-", "amount": 2160.0, "type": "expense", "balance": 26741.0}, {"date": "2026-07-25", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Paid for the table top repair of Sir Masab Gadit's room, as instructed by Akram-", "amount": 1500.0, "type": "expense", "balance": 25241.0}, {"date": "2026-07-25", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased dump bell, 06kg x 2, 8kg x 2, for the Gym, as instructed by-", "amount": 9800.0, "type": "expense", "balance": 15441.0}, {"date": "2026-07-25", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 muslim shower set & 01 washbasin drain pipe push button, for Advisor room, as instructed by Akram-", "amount": 3800.0, "type": "expense", "balance": 11641.0}, {"date": "2026-07-27", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 27-07-26", "amount": 290.0, "type": "expense", "balance": 11351.0}, {"date": "2026-07-27", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased 02 Nos. AC side covers to cover the AC electrical wires, as instructed by Shamroze-", "amount": 500.0, "type": "expense", "balance": 10851.0}, {"date": "2026-07-27", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased 02Nos dispenser cup for the 141-D ground floor water dispenser, as instructed by Akram-", "amount": 800.0, "type": "expense", "balance": 10051.0}, {"date": "2026-07-27", "bu": "Legal Entertainment", "category": "Legal Entertainment", "description": "Purchased lunch For Ovais bhai, - as requested by Ovais bhai-", "amount": 1800.0, "type": "expense", "balance": 8251.0}, {"date": "2026-07-27", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased 06Packs of balloons for birthday celebration, as instructed by Khaleeq Kamali-", "amount": 600.0, "type": "expense", "balance": 7651.0}, {"date": "2026-07-27", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased plants (Gulmohar Plants: 2, Soil, Khad & Mitti, transportation (Fare) and Labour Charges) for installation at parking plot 2, as per email- 26-06-26", "amount": 7500.0, "type": "expense", "balance": 151.0}, {"date": "2026-07-28", "bu": "", "category": "", "description": "Cash Received from Finance", "amount": 146400.0, "type": "inflow", "balance": 146551.0}, {"date": "2026-07-28", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 28-07-26", "amount": 325.0, "type": "expense", "balance": 146226.0}, {"date": "2026-07-28", "bu": "G&A", "category": "G&A", "description": "Purchased mix fruits for weekly G&A meeting, as instructed by Shahbaz-", "amount": 1800.0, "type": "expense", "balance": 144426.0}, {"date": "2026-07-28", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid for 02 Nos. of photo printouts for the birthday celebration, as instructed by Khaleeq Kamali-", "amount": 100.0, "type": "expense", "balance": 144326.0}, {"date": "2026-07-28", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 06 Nos. overhead tank cap covers for both campuses, as instructed by Shamroze-", "amount": 4800.0, "type": "expense", "balance": 139526.0}, {"date": "2026-07-28", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 04Nos end cap for 141-D, over head tanks, as instructed by Akram-", "amount": 200.0, "type": "expense", "balance": 139326.0}, {"date": "2026-07-29", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 29-07-26", "amount": 145.0, "type": "expense", "balance": 139181.0}, {"date": "2026-07-29", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased 27 Nos. AC side covers to cover the AC electrical wires for both campuses, as instructed by Shamroze-", "amount": 5400.0, "type": "expense", "balance": 133781.0}, {"date": "2026-07-29", "bu": "Auto Os", "category": "Auto Os", "description": "Purchased 01Nos Car cover for BYA-346, for the Auto OS, as instructed by Khaleeq Kamali-", "amount": 4500.0, "type": "expense", "balance": 129281.0}, {"date": "2026-07-30", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 30-07-26", "amount": 190.0, "type": "expense", "balance": 129091.0}, {"date": "2026-07-30", "bu": "Auto Os", "category": "Auto Os", "description": "Pay for Car Fuel fill-up  BYA-346, for the Auto OS team, as per e-mail, closing balance is Rs. 7,000", "amount": 4000.0, "type": "expense", "balance": 125091.0}, {"date": "2026-07-30", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased 02 Nos. valve 1/4 for AC, for work at 141-D (new procurement room and meeting room)  as instructed by Akram-", "amount": 1440.0, "type": "expense", "balance": 123651.0}, {"date": "2026-07-30", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 20ft 02'' flexible pipe for wire segregation of street lights, as instructed by Shamroze-", "amount": 1200.0, "type": "expense", "balance": 122451.0}, {"date": "2026-07-30", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid for 06 Nos. of photo printouts for the birthday celebration, as instructed by Khaleeq Kamali-", "amount": 300.0, "type": "expense", "balance": 122151.0}, {"date": "2026-07-30", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Paid to refill 02 cylinders for Oxygen gas for the AC maintenance team, as instructed by Akram-", "amount": 600.0, "type": "expense", "balance": 121551.0}, {"date": "2026-07-31", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 31-07-26", "amount": 45.0, "type": "expense", "balance": 121506.0}, {"date": "2026-07-31", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased 23ft karcher pipe for the AC maintenance team, as instructed by Shamroze-", "amount": 2800.0, "type": "expense", "balance": 118706.0}, {"date": "2026-07-31", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased lunch for the United Hospital team 16 Biryani 320 x 16 = 5120, 03 Biryani 300 x 3 = 900, 03 cold drink 120 x 3 = 360 and 01 cold drink 120, as instructed by Khaleeq Kamali-", "amount": 6500.0, "type": "expense", "balance": 112206.0}, {"date": "2026-07-31", "bu": "Disrupt Family", "category": "Disrupt Family", "description": "Paid for the documents photocopy for (Directors), as instructed by Kamran Haider-", "amount": 11800.0, "type": "expense", "balance": 100406.0}, {"date": "2026-07-31", "bu": "Disrupt Family", "category": "Disrupt Family", "description": "Paid for the documents photocopy for (Directors), as instructed by Kamran Haider-", "amount": 7300.0, "type": "expense", "balance": 93106.0}, {"date": "2026-08-01", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 10Kg hypo and for the restroom cleaning, as instructed by Khaleeq Kamali-", "amount": 1000.0, "type": "expense", "balance": 92106.0}, {"date": "2026-08-01", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the debris cleaning from 140-H roof and shift in 141-C, as instructed by Shamroze-", "amount": 3000.0, "type": "expense", "balance": 89106.0}, {"date": "2026-08-03", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 03-08-26", "amount": 245.0, "type": "expense", "balance": 88861.0}, {"date": "2026-08-03", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for ODOO team, as instructed by Khaleeq Kamali-", "amount": 550.0, "type": "expense", "balance": 88311.0}, {"date": "2026-08-03", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased cold drink for ODOO team, as instructed by Khaleeq Kamali-", "amount": 160.0, "type": "expense", "balance": 88151.0}, {"date": "2026-08-03", "bu": "Disrupt Procurement", "category": "Disrupt Procurement", "description": "Paid for Raashan offloading to (Mr. Noman 0317-2152713) - Disrupt Procurement", "amount": 4000.0, "type": "expense", "balance": 84151.0}, {"date": "2026-08-03", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 06Nos channel patti, 02 dozen screw and 02 dozen clip, for the 140-H cafe, as instructed by Shamroze-", "amount": 2600.0, "type": "expense", "balance": 81551.0}, {"date": "2026-08-03", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 sticker sheet for restroom soap dispensers, as instructed by Shahbaz- 25-07-2026", "amount": 400.0, "type": "expense", "balance": 81151.0}, {"date": "2026-08-03", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 06Nos sweet bowls for both campuses, as instructed by Shahbaz- 09-07-2026", "amount": 1680.0, "type": "expense", "balance": 79471.0}, {"date": "2026-08-03", "bu": "Disrupt Security", "category": "Disrupt Security", "description": "Purchase ice for 03 car parking plot x 01,02 & 03, 01 100 x 12 = 1200, Plot 02 , 100 x 12 = 1200 & Plot 03, 150 x 16 = 2400 , 16-Jul-2026 to 31- Jul-2026, 16 days", "amount": 4800.0, "type": "expense", "balance": 74671.0}, {"date": "2026-08-03", "bu": "Disrupt Security", "category": "Disrupt Security", "description": "Purchase ice for Bike parking 141-D, 100 x 16 = 1600, 16-Jul-2026 to 31- Jul-2026, 16 days", "amount": 1600.0, "type": "expense", "balance": 73071.0}, {"date": "2026-08-03", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 140-H front 15 x 300 = 4500, 16-Jul-2026 to 31- Jul-2026, 16 days", "amount": 4800.0, "type": "expense", "balance": 68271.0}, {"date": "2026-08-03", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 141-D front 15 x 300 = 4500, 16-Jul-2026 to 31- Jul-2026, 16 days", "amount": 4800.0, "type": "expense", "balance": 63471.0}, {"date": "2026-08-04", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 04-08-26", "amount": 300.0, "type": "expense", "balance": 63171.0}, {"date": "2026-08-04", "bu": "G&A", "category": "G&A", "description": "Purchased 03 (Anda Paratha) breakfast for weekly G&A meeting, as instructed by Shahbaz-", "amount": 360.0, "type": "expense", "balance": 62811.0}, {"date": "2026-08-04", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 01Nos Dustbin for 140-H 1st floor pantry, as instructed by Shahbaz-", "amount": 250.0, "type": "expense", "balance": 62561.0}, {"date": "2026-08-05", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 05-08-26", "amount": 250.0, "type": "expense", "balance": 62311.0}, {"date": "2026-08-05", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased cut screw 1/4 x 1 1/2 for the maintenance team, as instructed by Akram-", "amount": 200.0, "type": "expense", "balance": 62111.0}, {"date": "2026-08-05", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased 01 drain waste strain, for the GCR restroom washbasin, as instructed by Akram-", "amount": 50.0, "type": "expense", "balance": 62061.0}, {"date": "2026-08-05", "bu": "Disrupt Admin", "category": "Stationery", "description": "Purchased 01 color pencil packet for repairing the 10-year trophy, for the director, as instructed by Khaleeq Kamali-", "amount": 180.0, "type": "expense", "balance": 61881.0}, {"date": "2026-08-05", "bu": "Disrupt Admin", "category": "Travel Expense", "description": "Paid bykea fare to Kalash for return to office from FC Area for dropping off Azhar's due to health condition, as instructed by Khaleeq Kamali-", "amount": 100.0, "type": "expense", "balance": 61781.0}, {"date": "2026-08-05", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased 02Nos dispenser cups for the 141-D first floor water dispenser, as instructed by Akram-", "amount": 800.0, "type": "expense", "balance": 60981.0}, {"date": "2026-08-05", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 48Nos frosted round stickers for pasting on glass for both offices, as instructed by Akram-", "amount": 2000.0, "type": "expense", "balance": 58981.0}, {"date": "2026-08-06", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 06-08-26", "amount": 305.0, "type": "expense", "balance": 58676.0}, {"date": "2026-08-06", "bu": "Disrupt Admin", "category": "Water & Sewerage", "description": "Paid for the 03Nos water bottle refilling from RO Plant for 141-D, as instructed by Khaleeq Kamali-", "amount": 180.0, "type": "expense", "balance": 58496.0}, {"date": "2026-08-06", "bu": "Disrupt Admin", "category": "Water & Sewerage", "description": "Paid for the 03Nos water bottle refilling from RO Plant for 140-H, as instructed by Shahbaz Ahmed-", "amount": 210.0, "type": "expense", "balance": 58286.0}, {"date": "2026-08-06", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for ODOO team, as instructed by Khaleeq Kamali-", "amount": 575.0, "type": "expense", "balance": 57711.0}, {"date": "2026-08-06", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased cold drink for ODOO team, as instructed by Khaleeq Kamali-", "amount": 160.0, "type": "expense", "balance": 57551.0}, {"date": "2026-08-06", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid transportation charges for electric DB deliver from saddar to 140-H office, as instructed by Akram-", "amount": 1000.0, "type": "expense", "balance": 56551.0}, {"date": "2026-08-06", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02 Nos. table tennis balls for the 141-C office, as instructed by Khaleeq Kamali-", "amount": 120.0, "type": "expense", "balance": 56431.0}, {"date": "2026-08-06", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "urchased 12 Traffic Safety Cones for placement at both offices, as instructed by Khaleeq Kamali-", "amount": 3240.0, "type": "expense", "balance": 53191.0}, {"date": "2026-08-06", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchcased 08meter 40/76 wire for maintenance store wiring, 141-C, as instructed by Akram-", "amount": 1000.0, "type": "expense", "balance": 52191.0}, {"date": "2026-08-06", "bu": "Disrupt Admin", "category": "Kitchen Supplies", "description": "Purchased 01Nos water glass, for the 140-H Valet staff and drivers, as instructed by Khaleeq Kamali-", "amount": 150.0, "type": "expense", "balance": 52041.0}, {"date": "2026-08-06", "bu": "N-Dir Entertainment", "category": "N-Dir Entertainment", "description": "Purchased 05Nos Diet Coke, & 01 Candies pack, for the EC meeting, as instructed by Khaleeq Kamali- 02-08-26", "amount": 800.0, "type": "expense", "balance": 51241.0}, {"date": "2026-08-06", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid for the treadmill broken sharp full repair with labor charges, as instructed by Kamran Haider-", "amount": 3200.0, "type": "expense", "balance": 48041.0}, {"date": "2026-08-07", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 07-08-26", "amount": 70.0, "type": "expense", "balance": 47971.0}, {"date": "2026-08-07", "bu": "Auto Os", "category": "Auto Os", "description": "Pay for Car Fuel fill-up  BYA-346, for the Auto OS team, as per e-mail, closing balance is Rs. 3,000", "amount": 3000.0, "type": "expense", "balance": 44971.0}, {"date": "2026-08-07", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Purchased 02Nos cabinet lock & 01 bit for making hole, in 140-H IT cabinets, as instructed by Akram-", "amount": 700.0, "type": "expense", "balance": 44271.0}, {"date": "2026-08-07", "bu": "G&A", "category": "G&A", "description": "Purchased a hand-carry bag for onboarding kits, which was sent to the Dubai office as instructed by Shahbaz-", "amount": 3500.0, "type": "expense", "balance": 40771.0}, {"date": "2026-08-08", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid for 04 Nos. of photo printouts for the birthday celebration of M Akram, Asif and Abdul Rehman siddiqui, as instructed by Khaleeq Kamali-", "amount": 200.0, "type": "expense", "balance": 40571.0}, {"date": "2026-08-08", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased a 12-meter 4 K COB light and 05Nos connectors for light installation at both offices, Water Pool, as instructed by Shahbaz-", "amount": 3450.0, "type": "expense", "balance": 37121.0}, {"date": "2026-08-08", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to make the 3x2 Neon sigh (Blue + Orange) light Recharge Hour, for 141-C, cafe, as instructed by Shahbaz-", "amount": 7000.0, "type": "expense", "balance": 30121.0}, {"date": "2026-08-08", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchcased 10meter 40/76 wire for pool light installation wiring, 141-C, as instructed by Shahbaz-", "amount": 1250.0, "type": "expense", "balance": 28871.0}, {"date": "2026-08-08", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 10Kg black cement for the 140-H office, main entrance, as instructed by Shahbaz-", "amount": 500.0, "type": "expense", "balance": 28371.0}, {"date": "2026-08-08", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 15Nos birhd houses for installation at Trees for Birds, as instructed by Shahbaz-", "amount": 3000.0, "type": "expense", "balance": 25371.0}, {"date": "2026-08-08", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 stone for the 141-C water pool, as instructed by Shahbaz-", "amount": 800.0, "type": "expense", "balance": 24571.0}, {"date": "2026-08-10", "bu": "", "category": "", "description": "Cash Received from Finance", "amount": 137500.0, "type": "inflow", "balance": 162071.0}, {"date": "2026-08-10", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 10-08-26", "amount": 205.0, "type": "expense", "balance": 161866.0}, {"date": "2026-08-10", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased plants (sun palm, firan, Schefflera, and fikas, with transportation charges) for both offices, as instructed by Shahbaz-", "amount": 3400.0, "type": "expense", "balance": 158466.0}, {"date": "2026-08-10", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased plants (Chin Palm, exora, and croton) for both offices, as instructed by Shahbaz-", "amount": 7500.0, "type": "expense", "balance": 150966.0}, {"date": "2026-08-10", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 floor drain strainer for the 141-D ground floor restroom, as instructed by Akram-", "amount": 250.0, "type": "expense", "balance": 150716.0}, {"date": "2026-08-10", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 3 ft × 10 ft iron mesh (net) for installation around the 140-H office water pool to prevent turtles from entering the open area beneath the upper floor, as instructed by Shahbaz-", "amount": 2300.0, "type": "expense", "balance": 148416.0}, {"date": "2026-08-10", "bu": "Disrupt Admin", "category": "Utilities Expenses", "description": "Pay to SKY Fast cable media monthly Cable fees 140-H (AUG)", "amount": 800.0, "type": "expense", "balance": 147616.0}, {"date": "2026-08-10", "bu": "Disrupt Admin", "category": "Utilities Expenses", "description": "Pay Salary to Mr. Abdullah for monthly garbage collection of 140-H and 141-D & 141-C", "amount": 4000.0, "type": "expense", "balance": 143616.0}, {"date": "2026-08-10", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchcased 01 bag of white stones and 02 bags of swati stones for the 140-H entrance around the meter side, plants covered by stones, as per email-", "amount": 2000.0, "type": "expense", "balance": 141616.0}, {"date": "2026-08-10", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased plants (03Nos lady palm, 10Nos Nathra plants, 02 bags white stons, 02 bags swati stones and transportation charges) for installation at 141-D entrance, as per the email-", "amount": 6400.0, "type": "expense", "balance": 135216.0}, {"date": "2026-08-10", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 70ft American grass for installation at the 141-C main door wall and boundary wall of 141-D as per the email-", "amount": 4700.0, "type": "expense", "balance": 130516.0}, {"date": "2026-08-11", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 11-08-26", "amount": 140.0, "type": "expense", "balance": 130376.0}, {"date": "2026-08-11", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchase a water tanker to refill the tank of 140-H- office as instructed by Shahbaz-", "amount": 6000.0, "type": "expense", "balance": 124376.0}, {"date": "2026-08-11", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 15 pairs of Push & Pull stickers for both offices, as per email-", "amount": 2250.0, "type": "expense", "balance": 122126.0}, {"date": "2026-08-11", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased  80 canvas, 12 poster colors, and 10 paintbrushes for the 14th August celebration, as instructed by Sanober Syed-", "amount": 11460.0, "type": "expense", "balance": 110666.0}, {"date": "2026-08-11", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos commode machine set and 02Nos commode push button, for the 140-H restrooms, as instructed by Akram-", "amount": 5200.0, "type": "expense", "balance": 105466.0}, {"date": "2026-08-11", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos commode push button, for the 140-H restrooms, as instructed by Akram-", "amount": 600.0, "type": "expense", "balance": 104866.0}, {"date": "2026-08-11", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 9-meter fish wire for installation of birdhouses on trees, as instructed by Shahbaz-", "amount": 500.0, "type": "expense", "balance": 104366.0}, {"date": "2026-08-11", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos Used Car tyres to cover the tree bottom, outside 141-D, as instructed by Shahbaz-", "amount": 800.0, "type": "expense", "balance": 103566.0}, {"date": "2026-08-11", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Symetex glue for pasting the artificial grass on the 140-H office, as instructed by Shahbaz-", "amount": 100.0, "type": "expense", "balance": 103466.0}, {"date": "2026-08-11", "bu": "Disrupt Finance", "category": "Disrupt Finance", "description": "Purchased 02Nos Stamp for finance, as instructed by Muskan", "amount": 2800.0, "type": "expense", "balance": 100666.0}, {"date": "2026-08-11", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 end cap for the 140-H motor side, as instructed by Akram-", "amount": 40.0, "type": "expense", "balance": 100626.0}, {"date": "2026-08-11", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased 01 TWO-TON AC compressor for Cafe AC (141-C). The total purchase cost was PKR 23,000/-, against which PKR 10,000/- was recovered from the sale of the old compressors as scrap, resulting in a net cost of PKR 13,000/-", "amount": 13000.0, "type": "expense", "balance": 87626.0}, {"date": "2026-08-11", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased compressor oil for the AC maintenance team, as per email-", "amount": 750.0, "type": "expense", "balance": 86876.0}, {"date": "2026-08-11", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02 Nos. of umbrellas for the outside guards at 140-H to provide shade and protection from the sun, as instructed by Shahbaz-", "amount": 17000.0, "type": "expense", "balance": 69876.0}, {"date": "2026-08-11", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02 QTR oil mat paint, 03 ltr Kerosine oil and 01 brush, for the paint work, as instructed by Shahbaz-", "amount": 5250.0, "type": "expense", "balance": 64626.0}, {"date": "2026-08-11", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased 02KG R-410 AC gas for the AC maintenance team, as instructed by Shamroze-", "amount": 5600.0, "type": "expense", "balance": 59026.0}, {"date": "2026-08-11", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid for 12Nos certificates printout with Lamination, for Super Awards distribution to staff, as instructed by Khaleeq Kamali", "amount": 1300.0, "type": "expense", "balance": 57726.0}, {"date": "2026-08-12", "bu": "", "category": "", "description": "Cash Received from Finance", "amount": 142000.0, "type": "inflow", "balance": 199726.0}, {"date": "2026-08-12", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 12-08-26", "amount": 80.0, "type": "expense", "balance": 199646.0}, {"date": "2026-08-12", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for ODOO team, as instructed by Khaleeq Kamali-", "amount": 575.0, "type": "expense", "balance": 199071.0}, {"date": "2026-08-12", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased cold drink for ODOO team, as instructed by Khaleeq Kamali-", "amount": 160.0, "type": "expense", "balance": 198911.0}, {"date": "2026-08-12", "bu": "Auto Os", "category": "Auto Os", "description": "Purchased 08Nos cold drinks for Auto team lunch, as per email-", "amount": 640.0, "type": "expense", "balance": 198271.0}, {"date": "2026-08-13", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 13-08-26", "amount": 190.0, "type": "expense", "balance": 198081.0}, {"date": "2026-08-13", "bu": "Squatwolf", "category": "Squatwolf", "description": "Purchased 25Nos Lassi (butter milk) for the Independence day celebration, as per email- Squatwolf-", "amount": 4500.0, "type": "expense", "balance": 193581.0}, {"date": "2026-08-13", "bu": "Squatwolf", "category": "Squatwolf", "description": "Purchased 03pack of mix nimco,  for the Squatwolf Kahoot Session, as per email", "amount": 744.0, "type": "expense", "balance": 192837.0}, {"date": "2026-08-13", "bu": "Squatwolf", "category": "Squatwolf", "description": "Purchased 03 Pakistani flags & 03 badge, for the Squatwolf Kahoot Session, as per email", "amount": 260.0, "type": "expense", "balance": 192577.0}, {"date": "2026-08-13", "bu": "Squatwolf", "category": "Squatwolf", "description": "Purchased mix biscuits, and Pakola Cans,  for the Squatwolf Kahoot Session, as per email", "amount": 780.0, "type": "expense", "balance": 191797.0}, {"date": "2026-08-13", "bu": "Squatwolf", "category": "Squatwolf", "description": "Purchased 03 Nos. empty gift baskets and paid wrapping charges for gift basket distribution", "amount": 2400.0, "type": "expense", "balance": 189397.0}, {"date": "2026-08-13", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Nos 40W LED tube light for Paramedics room, as instructed by Shamroze-", "amount": 900.0, "type": "expense", "balance": 188497.0}, {"date": "2026-08-13", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased chat paper and ribbons for the Independence day celebration gift distribution, as instructed by Shahbaz-", "amount": 1560.0, "type": "expense", "balance": 186937.0}, {"date": "2026-08-13", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for ODOO team, as instructed by Khaleeq Kamali-", "amount": 1050.0, "type": "expense", "balance": 185887.0}, {"date": "2026-08-13", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased cold drink for ODOO team, as instructed by Khaleeq Kamali-", "amount": 240.0, "type": "expense", "balance": 185647.0}, {"date": "2026-08-15", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 03Kg hypo and 01Kg castic soda for the restroom cleaning, as instructed by Khaleeq Kamali-", "amount": 450.0, "type": "expense", "balance": 185197.0}, {"date": "2026-08-15", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 15Nos birhd houses for installation at Trees for Birds, as instructed by Shahbaz-", "amount": 3000.0, "type": "expense", "balance": 182197.0}, {"date": "2026-08-15", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 wire coil (40x76) for the 140-H office, as instructed by Akram-", "amount": 9000.0, "type": "expense", "balance": 173197.0}, {"date": "2026-08-15", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 20Nos lugx, 02 ferrol and 04 electric tape, for the 140-H office, as instructed by Akram-", "amount": 900.0, "type": "expense", "balance": 172297.0}, {"date": "2026-08-15", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Paid for the AC card circuit repairing for 140-H office Room # 14, as instructed by Akram-", "amount": 500.0, "type": "expense", "balance": 171797.0}, {"date": "2026-08-17", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 17-08-26", "amount": 320.0, "type": "expense", "balance": 171477.0}, {"date": "2026-08-17", "bu": "Squatwolf", "category": "Squatwolf", "description": "Purchased 01Pack of Everyday milk powder, for Squatwolf team, as instruted by Khaleeq Kamali-", "amount": 850.0, "type": "expense", "balance": 170627.0}, {"date": "2026-08-17", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Purchased 01 door latch for 2nd floor male restroom 141-D, as instructed by Akram-", "amount": 250.0, "type": "expense", "balance": 170377.0}, {"date": "2026-08-17", "bu": "Disrupt IT", "category": "Disrupt IT", "description": "Purchased 01 USB C Cable for the 141-D first floor meeting room, as instructed by Akram-", "amount": 800.0, "type": "expense", "balance": 169577.0}, {"date": "2026-08-17", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 connector strip for the 141-D 1st floor connection, as instructed by Akram-", "amount": 600.0, "type": "expense", "balance": 168977.0}, {"date": "2026-08-17", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased U PVC fittings 1\", elbow 6 pcs, 1\" Tee 3 pcs, 1\" socket 3 pcs, 3/4 pipe 10 fit, 3/4 Lbow 6 pcs, 3/4 tee 3 pcs , 3/4 socket 3 pcs, Handsaw blade 2  , C clip 2 dozen,  1\" pipe for 140-H backside AC drain line work, as instructed by Akram-", "amount": 1800.0, "type": "expense", "balance": 167177.0}, {"date": "2026-08-17", "bu": "Squatwolf", "category": "Squatwolf", "description": "Purchased 01 flower bouquet for the Squatwolf management, as instructed by Khaleeq Kamali-", "amount": 1100.0, "type": "expense", "balance": 166077.0}, {"date": "2026-08-17", "bu": "Squatwolf", "category": "Squatwolf", "description": "Purchased 03 flower bouquets for the Squatwolf management, as instructed by Khaleeq Kamali-", "amount": 3300.0, "type": "expense", "balance": 162777.0}, {"date": "2026-08-17", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos Turtles and their feed for the 140-H office pool, as instructed by Shahbaz-", "amount": 900.0, "type": "expense", "balance": 161877.0}, {"date": "2026-08-17", "bu": "Disrupt Security", "category": "Disrupt Security", "description": "Purchase ice for 03 car parking plot x 01,02 & 03, 01 100 x 11 = 1100, Plot 02 , 100 x 11 = 1100 & Plot 03, 150 x 15 = 2250 , 01-Aug-2026 to 15- Aug-2026, 15 days", "amount": 4450.0, "type": "expense", "balance": 157427.0}, {"date": "2026-08-17", "bu": "Disrupt Security", "category": "Disrupt Security", "description": "Purchase ice for Bike parking 141-D, 100 x 15 = 1500, 01-Aug-2026 to 15- Aug-2026, 15 days", "amount": 1500.0, "type": "expense", "balance": 155927.0}, {"date": "2026-08-17", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 140-H front 15 x 300 = 4500, 01-Aug-2026 to 15- Aug-2026, 15 days", "amount": 4500.0, "type": "expense", "balance": 151427.0}, {"date": "2026-08-17", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 141-D front 15 x 300 = 4500, 01-Aug-2026 to 15- Aug-2026, 15 days", "amount": 4500.0, "type": "expense", "balance": 146927.0}, {"date": "2026-08-18", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 18-08-26", "amount": 270.0, "type": "expense", "balance": 146657.0}, {"date": "2026-08-18", "bu": "Squatwolf", "category": "Squatwolf", "description": "Purchased lunch (Chicken biryani, Raita, and Salad) for the Squatwolf management, as instructed by Khaleeq Kamali-", "amount": 2450.0, "type": "expense", "balance": 144207.0}, {"date": "2026-08-18", "bu": "Squatwolf", "category": "Squatwolf", "description": "Purchased 05 Nos cold drink for the Squatwolf management, as instructed by Khaleeq Kamali-", "amount": 580.0, "type": "expense", "balance": 143627.0}, {"date": "2026-08-18", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for ODOO team, as instructed by Khaleeq Kamali-", "amount": 730.0, "type": "expense", "balance": 142897.0}, {"date": "2026-08-18", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased cold drink for ODOO team, as instructed by Khaleeq Kamali-", "amount": 160.0, "type": "expense", "balance": 142737.0}, {"date": "2026-08-18", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased Imported Croton Plant, White Stones (20 KG), Sada Bahar Flower Plants, Kamni Plant & Ficus Plants for the 140-H outdoor seating area and the water body surroundings, as per email-", "amount": 3700.0, "type": "expense", "balance": 139037.0}, {"date": "2026-08-18", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Purchased 01 lock and 01 door latch for the parking plot restroom, as instructed by Akram-", "amount": 300.0, "type": "expense", "balance": 138737.0}, {"date": "2026-08-18", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Paid to refill 02 cylinders for Oxygen gas for the AC maintenance team, as instructed by Akram-", "amount": 500.0, "type": "expense", "balance": 138237.0}, {"date": "2026-08-18", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Tester for the maintenance team, as instructed by Akram-", "amount": 70.0, "type": "expense", "balance": 138167.0}, {"date": "2026-08-18", "bu": "Squatwolf", "category": "Squatwolf", "description": "Paid rental charges for 2 Chandni to cover the table for refreshments- Squatwolf", "amount": 400.0, "type": "expense", "balance": 137767.0}, {"date": "2026-08-19", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 19-08-26", "amount": 125.0, "type": "expense", "balance": 137642.0}, {"date": "2026-08-19", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Purchased 02Nos lasani sheets, for GYM, and paid for cutting charges, as instructed by Akram- (to fix Green Front)", "amount": 3200.0, "type": "expense", "balance": 134442.0}, {"date": "2026-08-19", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Paid PKR 800/- as rickshaw fare to Mr. Sajjad for delivering the Lasani sheet from Liaquatabad Market to Allama Iqbal Road, (to fix Green Front)", "amount": 800.0, "type": "expense", "balance": 133642.0}, {"date": "2026-08-19", "bu": "Squatwolf", "category": "Squatwolf", "description": "Purchased 05 cups of tea (doodh Patti) for Squatwolf management, as instructed by Khaleeq Kamali-", "amount": 400.0, "type": "expense", "balance": 133242.0}, {"date": "2026-08-19", "bu": "Squatwolf", "category": "Squatwolf", "description": "Purchased 01 cup of Tea (Doodh Patti without sugar) for Squatwolf management, as instructed by Khaleeq Kamali-", "amount": 80.0, "type": "expense", "balance": 133162.0}, {"date": "2026-08-19", "bu": "Rs.1800 charged to Disrupt Lab \n&\nRs.1300 charged to Gz Systems", "category": "Rs.1800 charged to Disrupt Lab \n&\nRs.1300 charged to Gz Systems", "description": "Purchased 03Nos Stamp for PVPN, as instructed by Arham-", "amount": 3100.0, "type": "expense", "balance": 130062.0}, {"date": "2026-08-19", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 socket and a solution for 140-H office, (RO Plant), as instructed by Shamroze-", "amount": 140.0, "type": "expense", "balance": 129922.0}, {"date": "2026-08-20", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 20-08-26", "amount": 100.0, "type": "expense", "balance": 129822.0}, {"date": "2026-08-20", "bu": "Disrupt.com", "category": "Disrupt.com", "description": "Purchased 01 Instax mini film sheets for Camera and 02 AA battery cell, for the HR engagement activities, as instructed by Sanober Syed-", "amount": 8500.0, "type": "expense", "balance": 121322.0}, {"date": "2026-08-20", "bu": "Disrupt.com", "category": "Disrupt.com", "description": "Purchased 02 dozen bananas for the training session at learning center, as requested by Sanober Syed instructed by Khaleeq Kamali-", "amount": 350.0, "type": "expense", "balance": 120972.0}, {"date": "2026-08-21", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 21-08-26", "amount": 140.0, "type": "expense", "balance": 120832.0}, {"date": "2026-08-21", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Cementex solution for general use, as instructed by Shamroze-", "amount": 900.0, "type": "expense", "balance": 119932.0}, {"date": "2026-08-21", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased  01 gallon color bucket (Gobis 8000) for 140-H office, as instructed by Shamroze-", "amount": 4950.0, "type": "expense", "balance": 114982.0}, {"date": "2026-08-24", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 24-08-26", "amount": 515.0, "type": "expense", "balance": 114467.0}, {"date": "2026-08-24", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the lamination printout for pasting on the Valet Parking counter, as instructed by Shahbaz-", "amount": 1800.0, "type": "expense", "balance": 112667.0}, {"date": "2026-08-24", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch and cold drink for ODOO team, as instructed by Khaleeq Kamali-", "amount": 720.0, "type": "expense", "balance": 111947.0}, {"date": "2026-08-24", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for ODOO team, as instructed by Khaleeq Kamali-", "amount": 280.0, "type": "expense", "balance": 111667.0}, {"date": "2026-08-24", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 valve 1 1/2, 1 /1/1 and end cap, for the 140-H backside area water line repair work, as instructed by Shamroze-", "amount": 1290.0, "type": "expense", "balance": 110377.0}, {"date": "2026-08-25", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 25-08-26", "amount": 265.0, "type": "expense", "balance": 110112.0}, {"date": "2026-08-25", "bu": "Squatwolf", "category": "Squatwolf", "description": "Paid for the Ground (Maidan) booking in KMC Sports Complex for team Squatwolf-", "amount": 18000.0, "type": "expense", "balance": 92112.0}, {"date": "2026-08-25", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid allowances to 05 staff members for participation in the Talent Day gift distribution activity (Hadi Khan internet package and food allowance Rs.750 , Muzammil Ahmed internet package Rs.250, Ali Hassan internet package and food allowance Rs.750, Abdul Mateen internet package, fuel and food allowance Rs. 1150 & ) (M Hussain fuel Rs.390, mobile load Rs.250 & dinner Rs. 500) ), as per email 12-08-26", "amount": 4040.0, "type": "expense", "balance": 88072.0}, {"date": "2026-08-25", "bu": "G&A", "category": "G&A", "description": "Purchased 12 Glass (Apple Fresh Juice) for weekly G&A meeting, as instructed by Khaleeq Kamali-", "amount": 3450.0, "type": "expense", "balance": 84622.0}, {"date": "2026-08-25", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Paid for the color pitntout Room Reservation (Hassanain Anver), as instructed by Shahbaz-", "amount": 100.0, "type": "expense", "balance": 84522.0}, {"date": "2026-08-25", "bu": "Disrupt.com", "category": "Disrupt.com", "description": "Purchased 02 dozen bananas for the training session at learning center, as requested by Sanober Syed instructed by Khaleeq Kamali-", "amount": 350.0, "type": "expense", "balance": 84172.0}, {"date": "2026-08-27", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 27-08-26", "amount": 95.0, "type": "expense", "balance": 84077.0}, {"date": "2026-08-27", "bu": "Disrupt Admin", "category": "Water & Sewerage", "description": "Purchase a water tanker to refill the tank of 140-H- office as instructed by Shahbaz-", "amount": 6500.0, "type": "expense", "balance": 77577.0}, {"date": "2026-08-27", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased refreshments (Chilli mili, Candies, Nimco & Marie Biscuit) for Ali Samir, as instructed by Khaleeq Kamali-", "amount": 460.0, "type": "expense", "balance": 77117.0}, {"date": "2026-08-27", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Paid for the color pitntout Room Reservation (Ali Oosman), as instructed by Shahbaz-", "amount": 100.0, "type": "expense", "balance": 77017.0}, {"date": "2026-08-27", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased 02Packs of balloons for birthday celebration, as instructed by Khaleeq Kamali-", "amount": 500.0, "type": "expense", "balance": 76517.0}, {"date": "2026-08-27", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid for 02 Nos. of photo printouts for the birthday celebration, as instructed by Khaleeq Kamali-", "amount": 100.0, "type": "expense", "balance": 76417.0}, {"date": "2026-08-28", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 28-08-26", "amount": 80.0, "type": "expense", "balance": 76337.0}, {"date": "2026-08-28", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos Used Car tyres to cover the tree bottom, outside 140-H, as instructed by Shahbaz-", "amount": 1000.0, "type": "expense", "balance": 75337.0}, {"date": "2026-08-28", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02Nos (Mushroom showpiece) for the 140-H garden area, as instructed by Shahbaz-", "amount": 800.0, "type": "expense", "balance": 74537.0}, {"date": "2026-08-28", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased 0KG R-410 AC gas for the AC maintenance team, as instructed by Shamroze-", "amount": 8100.0, "type": "expense", "balance": 66437.0}, {"date": "2026-08-28", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Plastic rack shower area, as instructed by Akram-", "amount": 600.0, "type": "expense", "balance": 65837.0}, {"date": "2026-08-28", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch and cold drink for ODOO team, as instructed by Khaleeq Kamali-", "amount": 900.0, "type": "expense", "balance": 64937.0}, {"date": "2026-08-28", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 04Amp driver for the Rope light in 140-H office, as instructed by Akram-", "amount": 1100.0, "type": "expense", "balance": 63837.0}, {"date": "2026-08-28", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Shower for the Gym shower area, as instructed by Akram-", "amount": 1500.0, "type": "expense", "balance": 62337.0}, {"date": "2026-08-28", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 shower Rod for the Gym shower area, as instructed by Akram-", "amount": 250.0, "type": "expense", "balance": 62087.0}, {"date": "2026-08-28", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased gasket for the 141-D restroom's tissue roll, as instructed by Akram-", "amount": 200.0, "type": "expense", "balance": 61887.0}, {"date": "2026-08-28", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 jafari large for the 140-H office, outside wall, as instructed by Shahbaz-", "amount": 4200.0, "type": "expense", "balance": 57687.0}, {"date": "2026-08-29", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Aluminum angle, for the 141-C Cabinet fixing, as instructed Akram-", "amount": 900.0, "type": "expense", "balance": 56787.0}, {"date": "2026-08-29", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 teflon tape, 01 tee and 01 B.Nipple, for 140-H Director restroom, as instructed by Akram-", "amount": 430.0, "type": "expense", "balance": 56357.0}, {"date": "2026-08-29", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased (Cementex, silicone gel, screw, and a handsaw blade) for the general use, as instructed by Akram-", "amount": 2810.0, "type": "expense", "balance": 53547.0}, {"date": "2026-08-29", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02 QTR Gobis color, for the 140-H office, as instructed by Shahbaz-", "amount": 3300.0, "type": "expense", "balance": 50247.0}, {"date": "2026-08-29", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 TEE Cock for the Director's restroom, 140-H office, as instructed by Akram-", "amount": 1600.0, "type": "expense", "balance": 48647.0}, {"date": "2026-08-31", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 31-08-26", "amount": 235.0, "type": "expense", "balance": 48412.0}, {"date": "2026-08-31", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased cold drink for the Onboarding staff Usama Afzal, as instructed by Khaleeq Kamali-", "amount": 160.0, "type": "expense", "balance": 48252.0}, {"date": "2026-08-31", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 03Nos commode push button, for the 140-H restrooms, as instructed by Akram-", "amount": 1700.0, "type": "expense", "balance": 46552.0}, {"date": "2026-08-31", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Purchased 04Nos drawer lock for the 141-D first floor, cabinets, as instructed by Akram-", "amount": 1600.0, "type": "expense", "balance": 44952.0}, {"date": "2026-08-31", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Tap for 140-H washing area, and 01 Spindle for wuzu area 140-H office, as instructed by Akram-", "amount": 1800.0, "type": "expense", "balance": 43152.0}, {"date": "2026-08-31", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased 01 Kenwood AC BODY 01ton for the Tree of Success room, 141-D 2nd floor, as instructed by Akram-", "amount": 3000.0, "type": "expense", "balance": 40152.0}, {"date": "2026-08-31", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the documents printout (Easy Vend Contract), as instructed by Shamroze", "amount": 90.0, "type": "expense", "balance": 40062.0}, {"date": "2026-08-31", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Purchased Lasani sheet and PVC for the 141-C GCR washing area cabinet fixing, as instructed by Akram-", "amount": 1150.0, "type": "expense", "balance": 38912.0}, {"date": "2026-08-31", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the document color printout (Room Reservation for Dr Jonathan Doerr, Ilian Hristov, Alemsah Ozturk and Fakhar Abdullah), as instructed by Shahbaz-", "amount": 200.0, "type": "expense", "balance": 38712.0}, {"date": "2026-08-31", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the document color printout (Room Reservation for Dr Jonathan Doerr, Ilian Hristov, Alemsah Ozturk and Fakhar Abdullah), as instructed by Shahbaz-", "amount": 280.0, "type": "expense", "balance": 38432.0}, {"date": "2026-08-31", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Purchased 01 round lock for the 141-D First floor Janitorial store door lock, as instructed by Akram-", "amount": 750.0, "type": "expense", "balance": 37682.0}, {"date": "2026-08-31", "bu": "N-Dir Entertainment", "category": "N-Dir Entertainment", "description": "Purchased 01 wheatable biscuit pack for Sir Umair Gadit, as instructed by Shahbaz-", "amount": 100.0, "type": "expense", "balance": 37582.0}, {"date": "2026-09-01", "bu": "", "category": "", "description": "Cash Received from Finance", "amount": 162000.0, "type": "inflow", "balance": 199582.0}, {"date": "2026-09-01", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 01-09-26", "amount": 175.0, "type": "expense", "balance": 199407.0}, {"date": "2026-09-01", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 01 bouquet for 140-H office decoration, during delegation visit, as instructed by Khaleeq Kamali-", "amount": 2000.0, "type": "expense", "balance": 197407.0}, {"date": "2026-09-01", "bu": "Disrupt Admin", "category": "Tea & Coffee", "description": "Purchased refreshment candy packet for guests, as instructed by Shahbaz-", "amount": 150.0, "type": "expense", "balance": 197257.0}, {"date": "2026-09-01", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 01 cup of Tea (Doodh Patti without sugar) for Ali Samir Oosman, as instructed by Khaleeq Kamali-", "amount": 80.0, "type": "expense", "balance": 197177.0}, {"date": "2026-09-01", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the color printout (Menu & room reservation) for foreign delegation, as instructed by Shahbaz-", "amount": 1700.0, "type": "expense", "balance": 195477.0}, {"date": "2026-09-01", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the color printout (Menu & room reservation) for foreign delegation, as instructed by Shahbaz-", "amount": 1000.0, "type": "expense", "balance": 194477.0}, {"date": "2026-09-01", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for ODOO team, as instructed by Khaleeq Kamali-", "amount": 560.0, "type": "expense", "balance": 193917.0}, {"date": "2026-09-01", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased cold drink for ODOO team, as instructed by Khaleeq Kamali-", "amount": 160.0, "type": "expense", "balance": 193757.0}, {"date": "2026-09-01", "bu": "Disrupt Venture Builder and Investor", "category": "Disrupt Venture Builder and Investor", "description": "Paid to make stamp for (Disrupt Venture Builder and investor), as instructed by Mohsin-", "amount": 1400.0, "type": "expense", "balance": 192357.0}, {"date": "2026-09-01", "bu": "Disrupt Procurement", "category": "Disrupt Procurement", "description": "Paid for Raashan offloading to (Mr. Noman 0317-2152713) - Disrupt Procurement", "amount": 4000.0, "type": "expense", "balance": 188357.0}, {"date": "2026-09-01", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Tap Neck for the 141-D second floor restroom, as instructed by Akram-", "amount": 700.0, "type": "expense", "balance": 187657.0}, {"date": "2026-09-01", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 Muslim shower set for the 140-H Director restroom, as instructed by Akram- 31-08-26", "amount": 3100.0, "type": "expense", "balance": 184557.0}, {"date": "2026-09-01", "bu": "Disrupt Admin", "category": "Tea & Coffee", "description": "Purchased 02Nos Soda water for the foreign employee, (Jonathan), as instructed by Khaleeq Kamali-", "amount": 291.0, "type": "expense", "balance": 184266.0}, {"date": "2026-09-01", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 01Nos Soda water for the foreign employee, (Jonathan), as instructed by Khaleeq Kamali-", "amount": 150.0, "type": "expense", "balance": 184116.0}, {"date": "2026-09-01", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 01 Reducer for 141-D second floor pantry tap, as instructed by Akram-", "amount": 650.0, "type": "expense", "balance": 183466.0}, {"date": "2026-09-01", "bu": "Disrupt.com", "category": "Disrupt.com", "description": "Purchased 03 dozen bananas for the training session at learning center, as requested by Sanober Syed instructed by Khaleeq Kamali-", "amount": 500.0, "type": "expense", "balance": 182966.0}, {"date": "2026-09-01", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Paid for 19 Nos. of photo printouts for (month of September) birthday celebration of employee's, as instructed by Khaleeq Kamali-", "amount": 2100.0, "type": "expense", "balance": 180866.0}, {"date": "2026-09-02", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 02-09-26", "amount": 250.0, "type": "expense", "balance": 180616.0}, {"date": "2026-09-02", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 12 glasses of buttermilk (Lassi) for the foreign delegation breakfast, as instructed by Shahbaz-", "amount": 2160.0, "type": "expense", "balance": 178456.0}, {"date": "2026-09-02", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased Salad for the Disrupt Lab all-hands lunch, as instructed by Shahbaz-", "amount": 1700.0, "type": "expense", "balance": 176756.0}, {"date": "2026-09-02", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for ODOO team, as instructed by Khaleeq Kamali-", "amount": 520.0, "type": "expense", "balance": 176236.0}, {"date": "2026-09-02", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased cold drink for ODOO team, as instructed by Khaleeq Kamali-", "amount": 160.0, "type": "expense", "balance": 176076.0}, {"date": "2026-09-02", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased (flush washer 03nos, porta commode button 01nos, flush punch clip 03nos and porta ball cock) for the both offices restroom, as instructed by Akram-", "amount": 2300.0, "type": "expense", "balance": 173776.0}, {"date": "2026-09-02", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased 35ft AC drain pipe and 02 dammar tape, for the 140-H office AC work, as instructed by Akram-", "amount": 1005.0, "type": "expense", "balance": 172771.0}, {"date": "2026-09-02", "bu": "Disrupt HR TA", "category": "Disrupt HR TA", "description": "Purchased cookies for the intern Wajeeh Ishtiaq, as per ticket # 96714 of Javeria Sami-", "amount": 2600.0, "type": "expense", "balance": 170171.0}, {"date": "2026-09-03", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 03-09-26", "amount": 120.0, "type": "expense", "balance": 170051.0}, {"date": "2026-09-03", "bu": "Auto Os", "category": "Auto Os", "description": "Pay for Car Fuel fill-up  BYA-346, for the Auto OS team, as per e-mail, closing balance is Rs. 2,000", "amount": 2000.0, "type": "expense", "balance": 168051.0}, {"date": "2026-09-03", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 02Nos handsoap bottles for the 140-H executive restroom, as instructed by Akram-", "amount": 4000.0, "type": "expense", "balance": 164051.0}, {"date": "2026-09-03", "bu": "Wellows", "category": "Wellows", "description": "Paid for the printout (Certificate of Distinguished Service) for Saleem Ahrar, as instructed by Khaleeq Kamali-", "amount": 80.0, "type": "expense", "balance": 163971.0}, {"date": "2026-09-03", "bu": "Wellows", "category": "Wellows", "description": "Paid for the printout (Certificate of Distinguished Service) for Saleem Ahrar, as instructed by Khaleeq Kamali-", "amount": 80.0, "type": "expense", "balance": 163891.0}, {"date": "2026-09-03", "bu": "Wellows", "category": "Wellows", "description": "Purchased 01 flower bouquet for Saleem Ahrar, as instructed by Khaleeq Kamali-", "amount": 1200.0, "type": "expense", "balance": 162691.0}, {"date": "2026-09-03", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased 01 flower bouquet for Sir Saad Gadit, as instructed by Khaleeq Kamali-", "amount": 1200.0, "type": "expense", "balance": 161491.0}, {"date": "2026-09-03", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased 01 greeting card (Get Well Soon) for Sir Saad Gadit, as instructed by Khaleeq Kamali-", "amount": 20.0, "type": "expense", "balance": 161471.0}, {"date": "2026-09-03", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Paid to make 02nos duplicate keys 140-h cafe (inverter room), as instructed by Shamroze-", "amount": 300.0, "type": "expense", "balance": 161171.0}, {"date": "2026-09-03", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased bottle trap for the 141-D ground floor male restroom, as instructed by Akram-", "amount": 600.0, "type": "expense", "balance": 160571.0}, {"date": "2026-09-03", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 porta tank fitting and porta washer difference, for the 141-D first floor male restroom, as instructed by Akram-", "amount": 890.0, "type": "expense", "balance": 159681.0}, {"date": "2026-09-03", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased Fumigation Chemicals (insecticides), for the 140-H office, as instructed by Akram-", "amount": 2500.0, "type": "expense", "balance": 157181.0}, {"date": "2026-09-03", "bu": "Disrupt Admin", "category": "R&M - Furniture & Fixture", "description": "Purchased 02 magnet ketcher for the 141-C cafe cabinets, as instructed by Akram-", "amount": 140.0, "type": "expense", "balance": 157041.0}, {"date": "2026-09-04", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 04-09-26", "amount": 20.0, "type": "expense", "balance": 157021.0}, {"date": "2026-09-04", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 05Nos artificial decorative greenery to hand on tress, as instructed by Shahbaz-", "amount": 4500.0, "type": "expense", "balance": 152521.0}, {"date": "2026-09-04", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased Inchi tape for the maintenance team, as instructed by Akram", "amount": 450.0, "type": "expense", "balance": 152071.0}, {"date": "2026-09-04", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 02 Gallon Gobis paint, 04Nos plaster of Paris, and 01 deco set, for paint work at 140-H office, as instructed by Shamroze-", "amount": 9460.0, "type": "expense", "balance": 142611.0}, {"date": "2026-09-04", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 20 NosNenthera plant for both campuses, street tyre, plantation and White Stone ( 20 kg bag) for 140-H, outdoor tyre, as per email-", "amount": 2400.0, "type": "expense", "balance": 140211.0}, {"date": "2026-09-04", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased DAP Khaad, 1KG for 141-D Plants and Proclaim Spray for both campuses' plant maintenance.", "amount": 1600.0, "type": "expense", "balance": 138611.0}, {"date": "2026-09-04", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased DAP Khaad, 2 kg, and Urea Khaad 1 Kg 140-H Garden and plants, as per email-", "amount": 800.0, "type": "expense", "balance": 137811.0}, {"date": "2026-09-04", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 10 conocarpus 141-D Near Cafeteria door, as per email-", "amount": 1500.0, "type": "expense", "balance": 136311.0}, {"date": "2026-09-04", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased chemical safety masks and splash goggles for the maintenance team, for fumigation work at both offices,", "amount": 750.0, "type": "expense", "balance": 135561.0}, {"date": "2026-09-04", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 01 safety vest orange jacket, for the valet staff, as instructed by Shahbaz-", "amount": 220.0, "type": "expense", "balance": 135341.0}, {"date": "2026-09-04", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 20Ltr spray tank for fumigation work (general use), as instructed by Akram-", "amount": 7500.0, "type": "expense", "balance": 127841.0}, {"date": "2026-09-04", "bu": "Disrupt Security", "category": "Disrupt Security", "description": "Purchase ice for 03 car parking plot x 01,02 & 03, 01 50 x 11 = 550, Plot 02 , 50 x 11 = 550 & Plot 03, 150 x 16 = 2250 , 16-Aug-2026 to 31- Aug-2026, 16 days", "amount": 4600.0, "type": "expense", "balance": 123241.0}, {"date": "2026-09-04", "bu": "Disrupt Security", "category": "Disrupt Security", "description": "Purchase ice for Bike parking 141-D, 100 x 16 = 1600, 16-Aug-2026 to 31- Aug-2026, 16 days", "amount": 1600.0, "type": "expense", "balance": 121641.0}, {"date": "2026-09-04", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 140-H front 16 x 300 = 4800, 16-Aug-2026 to 31- Aug-2026, 16 days", "amount": 4800.0, "type": "expense", "balance": 116841.0}, {"date": "2026-09-04", "bu": "Disrupt Admin", "category": "Daily - Meal", "description": "Purchase ice for 141-D front 16 x 300 = 4800, 16-Aug-2026 to 31- Aug-2026, 16 days", "amount": 4800.0, "type": "expense", "balance": 112041.0}, {"date": "2026-09-05", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Paid to refill 01 cylinder for Oxygen gas for the AC maintenance team, as instructed by Akram-", "amount": 300.0, "type": "expense", "balance": 111741.0}, {"date": "2026-09-05", "bu": "Disrupt Admin", "category": "R&M - AC and Appliances", "description": "Purchased AC coil 01 Ton and lacqure spray for the 141-D Data center, as instructed by Shamroze-", "amount": 15600.0, "type": "expense", "balance": 96141.0}, {"date": "2026-09-05", "bu": "Disrupt Admin", "category": "Stationery", "description": "Paid for the document color printout (Room Reservation for Osman Erdogan), as instructed by Shahbaz-", "amount": 100.0, "type": "expense", "balance": 96041.0}, {"date": "2026-09-05", "bu": "N-Dir Entertainment", "category": "N-Dir Entertainment", "description": "Purchased 03 Glass juices for the director's meeting, as instructed by Khaleeq Kamali-", "amount": 540.0, "type": "expense", "balance": 95501.0}, {"date": "2026-09-05", "bu": "Disrupt.Group", "category": "Disrupt.Group", "description": "Purchased flower bouquet for the director's meeting, as instructed by Shahbaz-", "amount": 1000.0, "type": "expense", "balance": 94501.0}, {"date": "2026-09-05", "bu": "N-Dir Entertainment", "category": "N-Dir Entertainment", "description": "Purchased 10 cups fo tea for the director's meeting, as instructed by Shahbaz-", "amount": 800.0, "type": "expense", "balance": 93701.0}, {"date": "2026-09-05", "bu": "N-Dir Entertainment", "category": "N-Dir Entertainment", "description": "Purchased 12 cups fo tea for the director's meeting, as instructed by Shahbaz-", "amount": 960.0, "type": "expense", "balance": 92741.0}, {"date": "2026-09-05", "bu": "N-Dir Entertainment", "category": "N-Dir Entertainment", "description": "Purchased 03 Nestle Orange juices for the director's meeting, as instructed by Shahbaz-", "amount": 300.0, "type": "expense", "balance": 92441.0}, {"date": "2026-09-05", "bu": "Disrupt Admin", "category": "Janitorial Expense", "description": "Purchased 03ltr Hypo chemical for the restroom, cleaning both offices, as instructed by Shahbaz-", "amount": 500.0, "type": "expense", "balance": 91941.0}, {"date": "2026-09-07", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 07-09-26", "amount": 435.0, "type": "expense", "balance": 91506.0}, {"date": "2026-09-07", "bu": "Gz Systems", "category": "Gz Systems", "description": "Purchased newborn gifts for the Majid Mushtaq (204) Muhammad Ali Khan (768) Muhammad Anas Adeel Khan (1464), (PKR 43,800) through credit card due to insufficient balance in card remaining payment of 1200, paid through cash, as per email-", "amount": 1200.0, "type": "expense", "balance": 90306.0}, {"date": "2026-09-07", "bu": "Disrupt HR TA", "category": "Disrupt HR TA", "description": "Purchased cookies, as requested by Javeria Sami and instructed by Shahbaz-", "amount": 2500.0, "type": "expense", "balance": 87806.0}, {"date": "2026-09-07", "bu": "Disrupt Admin", "category": "Utilities Expenses", "description": "Pay to SKY Fast cable media monthly Cable fees 140-H (SEP)", "amount": 800.0, "type": "expense", "balance": 87006.0}, {"date": "2026-09-07", "bu": "Disrupt Admin", "category": "Utilities Expenses", "description": "Pay Salary to Mr. Abdullah for monthly garbage collection of 140-H and 141-D & 141-C", "amount": 4000.0, "type": "expense", "balance": 83006.0}, {"date": "2026-09-07", "bu": "Disrupt Admin", "category": "Tea & Coffee", "description": "Purchased 02kg sugar for the 140-H Cafe due to shortage, as instructed by Shahbaz-", "amount": 350.0, "type": "expense", "balance": 82656.0}, {"date": "2026-09-07", "bu": "Disrupt Lab", "category": "Disrupt Lab", "description": "Purchased 05 glass of Oreo Milk Shake for the Synapse Team, as per email-", "amount": 3400.0, "type": "expense", "balance": 79256.0}, {"date": "2026-09-07", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch and cold drink for ODOO team, as instructed by Khaleeq Kamali-", "amount": 360.0, "type": "expense", "balance": 78896.0}, {"date": "2026-09-08", "bu": "Disrupt Employees", "category": "Disrupt Employees", "description": "Purchased Portal lunch for Disrupt Employees, advance date 07-09-26", "amount": 420.0, "type": "expense", "balance": 78476.0}, {"date": "2026-09-08", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased 01 cupcake for the Muskan Virani, as requested by Ali Turab and instructed by Khaleeq Kamali-", "amount": 290.0, "type": "expense", "balance": 78186.0}, {"date": "2026-09-08", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased lunch for ODOO team, as instructed by Khaleeq Kamali-", "amount": 300.0, "type": "expense", "balance": 77886.0}, {"date": "2026-09-08", "bu": "ODOO ERP", "category": "ODOO ERP", "description": "Purchased cold drink for ODOO team, as instructed by Khaleeq Kamali-", "amount": 90.0, "type": "expense", "balance": 77796.0}, {"date": "2026-09-08", "bu": "Disrupt.com", "category": "Disrupt.com", "description": "Purchased 02 dozen bananas for the training session at learning center, as requested by Sanober Syed instructed by Khaleeq Kamali-", "amount": 200.0, "type": "expense", "balance": 77596.0}, {"date": "2026-09-08", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased cake for a birthday celebration for (3486 Abdul Basit), as instructed by Khaleeq Kamali-", "amount": 1690.0, "type": "expense", "balance": 75906.0}, {"date": "2026-09-08", "bu": "Disrupt Admin", "category": "General Maintenance", "description": "Purchased 06ft 06'' PVC pipe and 06ft 04'' PVC pipe for 140-H cafe solar drain line installation, as instructed by Shamroze-", "amount": 3000.0, "type": "expense", "balance": 72906.0}, {"date": "2026-09-08", "bu": "Disrupt HR", "category": "Disrupt HR", "description": "Purchased 02pack of Deemah Candy mini for the (Birthday celebration) distribution to employees, as instructed by Khaleeq Kamali-", "amount": 1929.0, "type": "expense", "balance": 70977.0}, {"date": "2026-09-08", "bu": "Disrupt Admin", "category": "Tea & Coffee", "description": "Purchased 01 pack of Softmint for visitors at the 140-H reception, as instructed by Shahbaz-", "amount": 150.0, "type": "expense", "balance": 70827.0}];


/* ---------------------------------- THEME ---------------------------------- */
const C = {
  sidebar: "#0A0A0A",
  sidebarActive: "#1F1F1F",
  sidebarText: "#A3A3A3",
  sidebarMuted: "#6B6B6B",
  bg: "#F7F7F7",
  card: "#FFFFFF",
  border: "#E5E5E5",
  text: "#0A0A0A",
  muted: "#6B6B6B",
  green: "#0C2B66",
  greenLight: "#E7ECF5",
  amber: "#C8791E",
  amberLight: "#FBF1E0",
  red: "#CB3B32",
  redLight: "#FBEAE8",
  blue: "#2C5AA0",
  purple: "#C68A5D",
  accent: "#F3D5BA",
};
const CHART_COLORS = ["#0C2B66", "#C68A5D", "#6B6B6B", "#C8791E", "#A3A3A3", "#CB3B32", "#0A0A0A", "#3F3F46"];

/* ---------------------------------- HELPERS ---------------------------------- */
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  return `${String(d.getDate()).padStart(2,"0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};
const fmtPKR = (n) => `PKR ${Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
const pct = (used, budget) => (budget > 0 ? (used / budget) * 100 : 0);
const uid = (p) => `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
const todayISO = () => new Date().toISOString().slice(0, 10);

/* ---------------------------------- RECEIPT OCR PARSING ---------------------------------- */
// Best-effort parsing of raw OCR text from a receipt/invoice image. No API calls —
// runs entirely in the browser via tesseract.js. Always let the user review/correct
// the filled fields, since OCR on receipts is never 100% reliable.
function parseReceiptText(rawText) {
  const lines = rawText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const result = { vendor: "", amount: "", date: "", description: "" };

  // --- Vendor: first line that has real letters and isn't just numbers/symbols ---
  for (const line of lines.slice(0, 6)) {
    const letters = (line.match(/[A-Za-z]/g) || []).length;
    if (letters >= 3 && !/^(receipt|invoice|tax invoice|cash memo)$/i.test(line)) {
      result.vendor = line.replace(/[^A-Za-z0-9&.,'\-\s]/g, "").trim().slice(0, 60);
      break;
    }
  }

  // --- Amount: prefer a line with total-like keywords, else the largest number found ---
  const numberPattern = /(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)/g;
  const totalKeywordLine = lines.find((l) =>
    /(grand\s*total|net\s*total|total\s*amount|amount\s*due|balance\s*due|^total\b)/i.test(l) &&
    !/sub\s*total/i.test(l)
  );
  const pickLargest = (text) => {
    const matches = text.match(numberPattern) || [];
    const nums = matches.map((m) => parseFloat(m.replace(/,/g, ""))).filter((n) => !isNaN(n) && n > 0);
    return nums.length ? Math.max(...nums) : null;
  };
  let amount = totalKeywordLine ? pickLargest(totalKeywordLine) : null;
  if (amount === null) amount = pickLargest(rawText);
  if (amount !== null) result.amount = amount;

  // --- Date: common numeric formats, normalized to YYYY-MM-DD ---
  const isoMatch = rawText.match(/\b(20\d{2})-(\d{1,2})-(\d{1,2})\b/);
  const dmyMatch = rawText.match(/\b(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})\b/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    result.date = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  } else if (dmyMatch) {
    let [, d, m, y] = dmyMatch;
    if (y.length === 2) y = `20${y}`;
    if (Number(d) <= 31 && Number(m) <= 12) {
      result.date = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }
  }

  // --- Description: short summary line, falls back to vendor-based text ---
  const startsWithDigits = /^\d/;
  const itemLine = lines.find((l) => /[A-Za-z]{3,}/.test(l) && l !== result.vendor && !startsWithDigits.test(l));
  result.description = result.vendor ? `Purchase from ${result.vendor}` : (itemLine ? itemLine.slice(0, 60) : "");

  return result;
}

/* ---------------------------------- BUDGET DATA ---------------------------------- */
// Real per-segment Budget + already-Exhausted amounts, taken directly from the company's
// "Budget" tab (Google Sheet). "priorExhausted" is spend already recorded in that sheet
// BEFORE this dashboard existed — new expenses added here are added on top of it, not
// instead of it, so totals stay accurate with the real sheet.
const SEGMENT_BUDGETS = {
  "REFRESHMENTS (TEA, COFFEE, ETC.)": {
    "Supplies - PK": { budget: 12123502, priorExhausted: 665636 },
    "Vending machines rent": { budget: 910800, priorExhausted: 468270 },
  },
  "OFFICE SUPPLIES": {
    "Janitorial expenses": { budget: 2630921, priorExhausted: 250 },
    "Kitchen expenses": { budget: 150940, priorExhausted: 0 },
    "Office supplies": { budget: 50365, priorExhausted: 845 },
    "Drinking water": { budget: 2718810, priorExhausted: 905270 },
  },
  "MISCELLANEOUS": {
    "Postage and Delivery": { budget: 12000, priorExhausted: 0 },
    "Stationery": { budget: 235950, priorExhausted: 11200 },
    "Printing and Reproduction": { budget: 200000, priorExhausted: 0 },
    "Fare allowance": { budget: 333840, priorExhausted: 0 },
    "Entertainment": { budget: 572840, priorExhausted: 4180 },
    "Other Expenses": { budget: 6000, priorExhausted: 8340 },
    "Daily meals": { budget: 400000, priorExhausted: 0 },
    "Engagement": { budget: 200000, priorExhausted: 62471 },
  },
};
const sumSegmentBudgets = (headerName) => Object.values(SEGMENT_BUDGETS[headerName] || {}).reduce((s, seg) => s + seg.budget, 0);
const sumSegmentPriorExhausted = (headerName) => Object.values(SEGMENT_BUDGETS[headerName] || {}).reduce((s, seg) => s + (seg.priorExhausted || 0), 0);

const SEED_HEADERS = [
  { id: "h1", name: "REFRESHMENTS (TEA, COFFEE, ETC.)", budget: sumSegmentBudgets("REFRESHMENTS (TEA, COFFEE, ETC.)"), startDate: "2026-07-20", endDate: "", status: "Active" },
  { id: "h2", name: "OFFICE SUPPLIES", budget: sumSegmentBudgets("OFFICE SUPPLIES"), startDate: "2026-07-20", endDate: "", status: "Active" },
  { id: "h3", name: "MISCELLANEOUS", budget: sumSegmentBudgets("MISCELLANEOUS"), startDate: "2026-07-20", endDate: "", status: "Active" },
];

// Segment (sub-category) options per Budget Header — matches the Google Sheet's row structure.
const SEGMENTS_BY_HEADER = {
  "REFRESHMENTS (TEA, COFFEE, ETC.)": ["Supplies - PK", "Vending machines rent"],
  "OFFICE SUPPLIES": ["Janitorial expenses", "Kitchen expenses", "Office supplies", "Drinking water"],
  "MISCELLANEOUS": ["Postage and Delivery", "Stationery", "Printing and Reproduction", "Fare allowance", "Entertainment", "Other Expenses", "Daily meals", "Engagement"],
};
const DEFAULT_SEGMENTS = ["General"];
const segmentsForHeader = (headerName) => SEGMENTS_BY_HEADER[headerName] || DEFAULT_SEGMENTS;

// Full segment breakdown for a header: every defined segment, each with its own real
// Budget / Used (prior-exhausted + app-tracked) / Remaining — matching the sheet's columns.
function getSegmentBreakdown(headerName, headerId, expenses) {
  const knownSegments = segmentsForHeader(headerName);
  const segBudgets = SEGMENT_BUDGETS[headerName] || {};
  const appUsedBySegment = expenses.filter((e) => e.headerId === headerId).reduce((acc, e) => {
    const key = e.segment || "Unspecified";
    acc[key] = (acc[key] || 0) + Number(e.amount);
    return acc;
  }, {});

  const rows = knownSegments.map((seg) => {
    const info = segBudgets[seg] || {};
    const budget = info.budget || 0;
    const used = (info.priorExhausted || 0) + (appUsedBySegment[seg] || 0);
    const remaining = budget - used;
    return { segment: seg, budget, used, remaining, utilization: pct(used, budget), over: budget > 0 && used > budget };
  });

  Object.keys(appUsedBySegment).forEach((key) => {
    if (!knownSegments.includes(key)) {
      rows.push({ segment: key, budget: 0, used: appUsedBySegment[key], remaining: -appUsedBySegment[key], utilization: 0, over: true });
    }
  });

  return rows;
}

// Mode of Payment options (matches the "Credit card useage" / "Petty Cash Usage" tabs on the sheet)
const PAYMENT_MODES = ["Credit Card", "Petty Cash"];
const PAYMENT_MODE_LIMIT = 150000; // shared limit for both Credit Card and Petty Cash

// Added By options
const ADDED_BY_OPTIONS = ["Muhammad Khaleeq Kamali", "Shahbaz Ahmed"];

// Business Unit options
const BU_OPTIONS = ["Pure", "SquatWolf", "Disrupt Lab", "Disrupt", "Wellows", "Secure", "Soft FM", "Hard FM", "HR-Ops"];

// Real expense entries start empty — data is added via the app or synced from the Google Sheet.
const SEED_EXPENSES = [];

const STORAGE_KEY = "wsbd-app-data-v1";

// Paste the Apps Script Web App URL here after deploying (ends in /exec).
// Leave empty and the app just keeps working off local storage, same as before.
// PREVIEW BUILD NOTE: disabled here so testing in this chat preview never
// writes to your real Google Sheet. Your deployed Vercel app still has the
// real URL — this only affects this in-chat preview copy.
const GOOGLE_SHEETS_WEBHOOK_URL = "";
// Paste the Apps Script Web App URL for the HISTORY backend here (Code-History.gs,
// deployed on the existing "Petty cash from Sep 2025 to onwards" sheet).
// (History is now a static one-time import baked in from historyData.js — see STATIC_HISTORY.)

/* ---------------------------------- SMALL UI PARTS ---------------------------------- */
function Badge({ children, tone = "muted" }) {
  const tones = {
    muted: { bg: "#EEEEEE", fg: C.muted },
    green: { bg: C.greenLight, fg: C.green },
    amber: { bg: C.amberLight, fg: C.amber },
    red: { bg: C.redLight, fg: C.red },
  };
  const t = tones[tone];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ background: t.bg, color: t.fg }}
    >
      {children}
    </span>
  );
}

function ProgressBar({ percent, over }) {
  const clamped = Math.min(percent, 100);
  const color = over ? C.red : percent >= 80 ? C.amber : C.green;
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ background: "#E5E5E5", height: 8 }}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${clamped}%`, background: color }}
      />
    </div>
  );
}

function SegmentRow({ seg }) {
  return (
    <div className="py-1.5" style={{ opacity: seg.budget > 0 ? 1 : 0.7 }}>
      <div className="flex items-center justify-between text-xs mb-1 gap-3">
        <span className="flex items-center gap-1.5 min-w-0">
          <span className="truncate font-medium" style={{ color: C.text }}>{seg.segment}</span>
          {seg.over && <Badge tone="red">Over</Badge>}
        </span>
        <span className="font-semibold shrink-0" style={{ color: seg.remaining < 0 ? C.red : C.text }}>{fmtPKR(seg.remaining)} left</span>
      </div>
      <ProgressBar percent={seg.utilization} over={seg.over} />
      <div className="flex justify-between mt-1 text-[11px]" style={{ color: C.muted }}>
        <span>{fmtPKR(seg.used)} used</span>
        <span>{fmtPKR(seg.budget)} budget</span>
      </div>
    </div>
  );
}

function Gauge({ percent, size = 108, stroke = 11, over }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(percent, 100));
  const color = over ? C.red : percent >= 80 ? C.amber : C.green;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#E5E5E5" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={c - (clamped / 100) * c}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text x="50%" y="47%" textAnchor="middle" fontSize={size * 0.19} fontWeight="700" fill={C.text}>
        {percent.toFixed(1)}%
      </text>
      <text x="50%" y="65%" textAnchor="middle" fontSize={size * 0.1} fill={C.muted}>
        used
      </text>
    </svg>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  const isErr = toast.type === "error";
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 shadow-lg text-sm font-medium"
      style={{ background: isErr ? C.red : C.green, color: "#fff" }}
    >
      {isErr ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
      {toast.msg}
    </div>
  );
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,36,28,0.45)" }}>
      <div
        className={`w-full ${wide ? "max-w-2xl" : "max-w-md"} rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto`}
        style={{ background: C.card }}
      >
        <div className="flex items-center justify-between px-6 py-4 sticky top-0" style={{ background: C.card, borderBottom: `1px solid ${C.border}` }}>
          <h3 className="text-base font-semibold" style={{ color: C.text }}>{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X size={18} color={C.muted} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>{label}</span>
      {children}
      {hint && <span className="block text-xs mt-1" style={{ color: C.muted }}>{hint}</span>}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  border: `1px solid ${C.border}`,
  borderRadius: 10,
  padding: "9px 12px",
  fontSize: 14,
  color: C.text,
  outline: "none",
  background: "#fff",
};

/* ---------------------------------- APP ---------------------------------- */
export default function Dashboard() {
  const [headers, setHeaders] = useState(SEED_HEADERS);
  const [expenses, setExpenses] = useState(SEED_EXPENSES);
  const [topUps, setTopUps] = useState([]); // { id, mode, date, amount }
  const [buBudgets, setBuBudgets] = useState(() => Object.fromEntries(BU_OPTIONS.map((b) => [b, 0])));
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const [expenseModal, setExpenseModal] = useState(null); // null | {} | expense obj
  const [headerModal, setHeaderModal] = useState(null);
  const [deleteExpenseId, setDeleteExpenseId] = useState(null);
  const [deleteHeaderId, setDeleteHeaderId] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // PREVIEW BUILD NOTE: the real app persists to browser localStorage (see
  // Vercel version). Artifacts can't use localStorage, so this preview just
  // keeps data in memory for the session — behavior is otherwise identical.
  useEffect(() => {
    setLoaded(true);
  }, []);

  const notify = (msg, type = "success") => {
    setToast({ msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  /* ---------------- Google Sheet sync (Apps Script webhook) ---------------- */
  async function pushExpenseToSheet(action, expense, headerName) {
    if (!GOOGLE_SHEETS_WEBHOOK_URL) return; // not configured yet — app keeps working locally
    try {
      await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" }, // avoids a CORS preflight to Apps Script
        body: JSON.stringify({ action, headerName, ...expense }),
      });
    } catch (err) {
      notify("Saved locally, but couldn't sync to Google Sheet.", "error");
    }
  }

  async function pullFromSheet() {
    if (!GOOGLE_SHEETS_WEBHOOK_URL) {
      notify("Google Sheet link isn't set up yet.", "error");
      return;
    }
    setSyncing(true);
    try {
      const res = await fetch(GOOGLE_SHEETS_WEBHOOK_URL);
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Unknown error");
      const pulled = (data.entries || []).map((r) => ({
        id: r.id,
        date: r.date,
        headerId: r.headerId,
        segment: r.segment || "",
        description: r.description,
        vendor: r.vendor || "",
        amount: Number(r.amount) || 0,
        mode: r.mode || "",
        bu: r.bu || "",
        addedBy: r.addedBy,
        email: r.email || "",
        imageData: null,
        imageName: "",
        documentData: null,
        documentName: "",
        remarks: r.remarks || "",
        receiptLink: r.receiptLink || "",
        documentLink: r.documentLink || "",
      }));
      setExpenses(pulled);
      if (data.topUps) {
        setTopUps(data.topUps.map((t) => ({ id: t.id, mode: t.mode, date: t.date, amount: Number(t.amount) || 0 })));
      }
      notify(`Pulled ${pulled.length} entries from the Google Sheet.`);
    } catch (err) {
      notify("Couldn't pull from Google Sheet — check the Apps Script deployment.", "error");
    } finally {
      setSyncing(false);
    }
  }


  async function pushTopUpToSheet(topUp) {
    if (!GOOGLE_SHEETS_WEBHOOK_URL) return;
    try {
      await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "topup", ...topUp }),
      });
    } catch (err) {
      notify("Top-up saved locally, but couldn't sync to Google Sheet.", "error");
    }
  }

  /* ---------------- Derived data ---------------- */
  const headerStats = useMemo(() => {
    return headers.map((h) => {
      const priorExhausted = sumSegmentPriorExhausted(h.name);
      const appUsed = expenses.filter((e) => e.headerId === h.id).reduce((s, e) => s + Number(e.amount), 0);
      const used = priorExhausted + appUsed;
      const remaining = h.budget - used;
      const utilization = pct(used, h.budget);
      return { ...h, used, remaining, utilization, over: used > h.budget };
    });
  }, [headers, expenses]);

  const totals = useMemo(() => {
    const activeStats = headerStats.filter((h) => h.status === "Active");
    const totalBudget = activeStats.reduce((s, h) => s + Number(h.budget), 0);
    const totalUsed = activeStats.reduce((s, h) => s + h.used, 0);
    return { totalBudget, totalUsed, remaining: totalBudget - totalUsed, utilization: pct(totalUsed, totalBudget) };
  }, [headerStats]);

  const overBudgetHeaders = headerStats.filter((h) => h.over);
  const headerNameById = useMemo(() => Object.fromEntries(headers.map((h) => [h.id, h.name])), [headers]);

  const buStats = useMemo(() => {
    return BU_OPTIONS.map((bu) => {
      const budget = Number(buBudgets[bu] || 0);
      const used = expenses.filter((e) => e.bu === bu).reduce((s, e) => s + Number(e.amount || 0), 0);
      return { bu, budget, used, remaining: budget - used, utilization: pct(used, budget) };
    });
  }, [buBudgets, expenses]);

  const setBuBudget = (bu, amount) => {
    setBuBudgets((b) => ({ ...b, [bu]: Number(amount) || 0 }));
  };

  const paymentModeStats = useMemo(() => {
    return PAYMENT_MODES.map((mode) => {
      const used = expenses.filter((e) => e.mode === mode).reduce((s, e) => s + Number(e.amount), 0);
      const toppedUp = topUps.filter((t) => t.mode === mode).reduce((s, t) => s + Number(t.amount), 0);
      const limit = PAYMENT_MODE_LIMIT + toppedUp;
      const remaining = limit - used;
      return { mode, limit, used, remaining, toppedUp, utilization: pct(used, limit), over: used > limit };
    });
  }, [expenses, topUps]);

  const [paymentModeView, setPaymentModeView] = useState(null); // null | "Credit Card" | "Petty Cash"

  function addTopUp(mode, date, amount) {
    const amt = Number(amount);
    if (!date) return notify("Please select a date.", "error");
    if (isNaN(amt) || amt <= 0) return notify("Top-up amount must be a positive number.", "error");
    const topUp = { id: uid("t"), mode, date, amount: amt, createdAt: new Date().toISOString() };
    setTopUps((prev) => [topUp, ...prev]);
    notify(`${mode} topped up by ${fmtPKR(amt)}.`);
    pushTopUpToSheet(topUp);
  }

  /* ---------------- Expense CRUD ---------------- */
  function saveExpense(form, editingId) {
    const amount = Number(form.amount);
    if (!form.date) return notify("Please select an expense date.", "error");
    if (!form.headerId) return notify("Please select a Budget Header.", "error");
    if (!form.description.trim()) return notify("Description is required.", "error");
    if (!form.addedBy.trim()) return notify("Please enter Added By.", "error");
    if (isNaN(amount) || amount <= 0) return notify("Amount must be a positive number.", "error");

    const headerName = headers.find((h) => h.id === form.headerId)?.name || "";
    if (editingId) {
      setExpenses((prev) => prev.map((e) => (e.id === editingId ? { ...e, ...form, amount } : e)));
      notify("Expense updated successfully.");
      pushExpenseToSheet("update", { ...form, amount, id: editingId }, headerName);
    } else {
      const newExpense = { id: uid("e"), ...form, amount, createdAt: new Date().toISOString() };
      setExpenses((prev) => [newExpense, ...prev]);
      notify("Expense added successfully.");
      pushExpenseToSheet("add", newExpense, headerName);
    }
    setExpenseModal(null);
  }

  function deleteExpense(id) {
    const target = expenses.find((e) => e.id === id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    setDeleteExpenseId(null);
    notify("Expense deleted. Budget updated successfully.");
    pushExpenseToSheet("delete", { id }, target ? headerNameById[target.headerId] : "");
  }

  /* ---------------- Header CRUD ---------------- */
  function saveHeader(form, editingId) {
    const budget = Number(form.budget);
    if (!form.name.trim()) return notify("Header name is required.", "error");
    if (isNaN(budget) || budget <= 0) return notify("Allocated budget must be a positive number.", "error");
    const dup = headers.some((h) => h.name.trim().toLowerCase() === form.name.trim().toLowerCase() && h.id !== editingId);
    if (dup) return notify("A Budget Header with this name already exists.", "error");

    if (editingId) {
      setHeaders((prev) => prev.map((h) => (h.id === editingId ? { ...h, ...form, budget } : h)));
      notify("Budget header updated successfully.");
    } else {
      setHeaders((prev) => [...prev, { id: uid("h"), ...form, budget }]);
      notify("Budget header added successfully.");
    }
    setHeaderModal(null);
  }

  function deleteHeader(id) {
    const inUse = expenses.some((e) => e.headerId === id);
    if (inUse) {
      notify("Cannot delete — this header has linked expenses. Remove them first.", "error");
      setDeleteHeaderId(null);
      return;
    }
    setHeaders((prev) => prev.filter((h) => h.id !== id));
    setDeleteHeaderId(null);
    notify("Budget header deleted.");
  }

  function clearAllData() {
    setHeaders([]);
    setExpenses([]);
    notify("All data cleared.");
  }

  /* ---------------- Nav ---------------- */
  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "headers", label: "Budget Headers", icon: Wallet },
    { id: "buBudgets", label: "BU Budgets", icon: Building2 },
    { id: "expenses", label: "Expense Entries", icon: ReceiptText },
    { id: "history", label: "History", icon: RotateCcw },
    { id: "reports", label: "Reports", icon: FileBarChart2 },
    { id: "export", label: "Export Data", icon: Download },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="flex min-h-screen w-full" style={{ background: C.bg, fontFamily: "'Segoe UI', ui-sans-serif, system-ui, -apple-system, sans-serif" }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 md:hidden" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-40 w-64 shrink-0 flex flex-col transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{ background: `linear-gradient(180deg, ${C.sidebar} 0%, #000000 100%)`, boxShadow: "2px 0 12px rgba(0,0,0,0.08)" }}
      >
        <div className="px-6 py-6">
          <div className="text-white font-bold text-lg tracking-tight">Disrupt.com</div>
          <div className="text-[11px] leading-tight mt-1.5" style={{ color: C.sidebarMuted }}>Workplace Services</div>
        </div>
        <nav className="flex-1 px-3 mt-2 space-y-1">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = view === n.id;
            return (
              <button
                key={n.id}
                onClick={() => { setView(n.id); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                style={{
                  background: active ? C.sidebarActive : "transparent",
                  color: active ? "#fff" : C.sidebarText,
                  boxShadow: active ? `inset 3px 0 0 ${C.accent}` : "none",
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <Icon size={17} />
                {n.label}
                {active && <ChevronRight size={15} className="ml-auto opacity-70" />}
              </button>
            );
          })}
        </nav>
        <div className="px-6 py-5 text-[11px]" style={{ color: C.sidebarMuted, borderTop: `1px solid ${C.sidebarActive}` }}>
          Budget Cycle<br />
          <span className="text-white font-medium">20 Jul 2026 → Till Date</span>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 px-5 md:px-8 py-4" style={{ background: C.bg, boxShadow: "0 1px 3px rgba(15,36,28,0.05)" }}>
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-lg" style={{ background: C.card, border: `1px solid ${C.border}` }} onClick={() => setSidebarOpen(true)}>
              <Menu size={18} color={C.text} />
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-bold" style={{ color: C.text }}>
                {NAV.find((n) => n.id === view)?.label || "Dashboard"}
              </h1>
              <p className="text-xs md:text-[13px]" style={{ color: C.muted }}>20 Jul 2026 → Till Date</p>
            </div>
          </div>
          <button
            onClick={() => setExpenseModal({})}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm shrink-0"
            style={{ background: C.accent, color: C.text }}
          >
            <Plus size={16} /> <span className="hidden sm:inline">New Expense</span>
          </button>
        </header>

        <main className="flex-1 px-5 md:px-8 py-6">
          {view === "dashboard" && (
            <DashboardView
              totals={totals}
              headerStats={headerStats}
              overBudgetHeaders={overBudgetHeaders}
              expenses={expenses}
              headerNameById={headerNameById}
              paymentModeStats={paymentModeStats}
              onViewPaymentMode={(mode) => setPaymentModeView(mode)}
              onAddExpense={() => setExpenseModal({})}
              onEditExpense={(e) => setExpenseModal(e)}
              onDeleteExpense={(id) => setDeleteExpenseId(id)}
              onViewAll={() => setView("expenses")}
            />
          )}
          {view === "headers" && (
            <HeadersView
              headerStats={headerStats}
              expenses={expenses}
              onAdd={() => setHeaderModal({})}
              onEdit={(h) => setHeaderModal(h)}
              onDelete={(id) => setDeleteHeaderId(id)}
            />
          )}
          {view === "buBudgets" && (
            <BuBudgetsView buStats={buStats} onSetBudget={setBuBudget} />
          )}
          {view === "expenses" && (
            <ExpensesView
              expenses={expenses}
              headers={headers}
              headerNameById={headerNameById}
              onAdd={() => setExpenseModal({})}
              onEdit={(e) => setExpenseModal(e)}
              onDelete={(id) => setDeleteExpenseId(id)}
            />
          )}
          {view === "history" && <HistoryView history={STATIC_HISTORY} />}
          {view === "reports" && (
            <ReportsView headers={headers} expenses={expenses} headerStats={headerStats} headerNameById={headerNameById} />
          )}
          {view === "export" && <ExportView headers={headers} expenses={expenses} headerNameById={headerNameById} notify={notify} />}
          {view === "settings" && (
            <SettingsView
              onClear={clearAllData}
              headerCount={headers.length}
              expenseCount={expenses.length}
              onPull={pullFromSheet}
              syncing={syncing}
              sheetConfigured={!!GOOGLE_SHEETS_WEBHOOK_URL}
            />
          )}
          <div className="text-center text-xs py-6 mt-2" style={{ color: C.muted }}>
            Created by Shahbaz & Khaleeq
          </div>
        </main>
      </div>

      {expenseModal !== null && (
        <ExpenseModal
          headers={headers}
          initial={expenseModal}
          onClose={() => setExpenseModal(null)}
          onSave={saveExpense}
          headerStats={headerStats}
          expenses={expenses}
          buStats={buStats}
          notify={notify}
        />
      )}
      {headerModal !== null && (
        <HeaderModal initial={headerModal} onClose={() => setHeaderModal(null)} onSave={saveHeader} />
      )}
      {deleteExpenseId && (
        <ConfirmModal
          title="Delete expense entry?"
          body="This will permanently remove this entry and recalculate all budget totals."
          onCancel={() => setDeleteExpenseId(null)}
          onConfirm={() => deleteExpense(deleteExpenseId)}
        />
      )}
      {deleteHeaderId && (
        <ConfirmModal
          title="Delete budget header?"
          body="This cannot be undone. Headers with linked expenses cannot be deleted."
          onCancel={() => setDeleteHeaderId(null)}
          onConfirm={() => deleteHeader(deleteHeaderId)}
        />
      )}
      {paymentModeView && (
        <PaymentModeModal
          mode={paymentModeView}
          stats={paymentModeStats.find((p) => p.mode === paymentModeView)}
          expenses={expenses.filter((e) => e.mode === paymentModeView)}
          headerNameById={headerNameById}
          onClose={() => setPaymentModeView(null)}
          onTopUp={addTopUp}
        />
      )}
      <Toast toast={toast} />
    </div>
  );
}

/* ---------------------------------- KPI CARD ---------------------------------- */
function KPICard({ label, value, sub, icon: Icon, tone }) {
  const tones = {
    green: { bg: C.greenLight, fg: C.green },
    blue: { bg: "#EAF0F9", fg: C.blue },
    red: { bg: C.redLight, fg: C.red },
    purple: { bg: "#FBEEE3", fg: C.purple },
  };
  const t = tones[tone] || tones.green;
  return (
    <div className="rounded-2xl p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: C.muted }}>{label}</span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: t.bg, boxShadow: `0 0 0 5px ${t.bg}80` }}>
          <Icon size={16} color={t.fg} />
        </div>
      </div>
      <div className="text-2xl font-bold tabular-nums tracking-tight" style={{ color: C.text }}>{value}</div>
      {sub && <div className="text-xs mt-1.5" style={{ color: C.muted }}>{sub}</div>}
    </div>
  );
}

/* ---------------------------------- DASHBOARD VIEW ---------------------------------- */
function DashboardView({ totals, headerStats, overBudgetHeaders, expenses, headerNameById, paymentModeStats, onViewPaymentMode, onAddExpense, onEditExpense, onDeleteExpense, onViewAll }) {
  const recent = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
  const [expandedHeaderId, setExpandedHeaderId] = useState(null);

  return (
    <div className="space-y-6">
      {overBudgetHeaders.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl px-5 py-4" style={{ background: C.redLight, border: `1px solid #F3C7C3` }}>
          <AlertTriangle size={18} color={C.red} className="shrink-0 mt-0.5" />
          <div className="text-sm" style={{ color: "#7A241E" }}>
            <span className="font-semibold">{overBudgetHeaders.length} header{overBudgetHeaders.length > 1 ? "s" : ""} over budget: </span>
            {overBudgetHeaders.map((h) => h.name).join(", ")}. Review expense entries against these headers.
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Budget" value={fmtPKR(totals.totalBudget)} sub="Across all active headers" icon={Wallet} tone="blue" />
        <KPICard label="Total Used" value={fmtPKR(totals.totalUsed)} sub={`${expenses.length} expense entries`} icon={ReceiptText} tone="purple" />
        <KPICard label="Total Remaining" value={fmtPKR(totals.remaining)} sub={totals.remaining < 0 ? "Over allocated budget" : "Available to spend"} icon={totals.remaining < 0 ? TrendingDown : TrendingUp} tone={totals.remaining < 0 ? "red" : "green"} />
        <KPICard label="Utilization" value={`${totals.utilization.toFixed(1)}%`} sub="Overall budget consumed" icon={FileBarChart2} tone={totals.utilization > 100 ? "red" : "blue"} />
      </div>

      {paymentModeStats && (
        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: C.text }}>Payment Mode Limits</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paymentModeStats.map((p) => (
              <button
                key={p.mode}
                onClick={() => onViewPaymentMode(p.mode)}
                className="text-left rounded-2xl p-5 shadow-sm flex items-center gap-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                style={{ background: C.card, border: `1px solid ${p.over ? "#F3C7C3" : C.border}` }}
              >
                <Gauge percent={p.utilization} size={84} stroke={8} over={p.over} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold" style={{ color: C.text }}>{p.mode}</span>
                    {p.over && <Badge tone="red">Over Limit</Badge>}
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span style={{ color: C.muted }}>Limit</span><span className="font-semibold" style={{ color: C.text }}>{fmtPKR(p.limit)}</span></div>
                    <div className="flex justify-between"><span style={{ color: C.muted }}>Used</span><span className="font-semibold" style={{ color: C.text }}>{fmtPKR(p.used)}</span></div>
                    <div className="flex justify-between"><span style={{ color: C.muted }}>Remaining</span><span className="font-semibold" style={{ color: p.remaining < 0 ? C.red : C.green }}>{fmtPKR(p.remaining)}</span></div>
                  </div>
                  <div className="mt-2 text-xs font-semibold flex items-center gap-1" style={{ color: C.green }}>
                    View details <ChevronRight size={13} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 rounded-2xl shadow-sm overflow-hidden" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
            <h3 className="text-sm font-semibold" style={{ color: C.text }}>Budget Overview by Header</h3>
          </div>
          <div className="divide-y" style={{ borderColor: C.border }}>
            {headerStats.map((h) => {
              const isOpen = expandedHeaderId === h.id;
              const segmentBreakdown = isOpen ? getSegmentBreakdown(h.name, h.id, expenses) : [];
              return (
                <div key={h.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <div
                    className="px-5 py-4 flex items-center gap-3 cursor-pointer transition-colors hover:bg-[#FAFAFA]"
                    onClick={() => setExpandedHeaderId(isOpen ? null : h.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-sm font-semibold truncate" style={{ color: C.text }}>{h.name}</span>
                        {h.over && <Badge tone="red">Over Budget</Badge>}
                        {!h.over && h.utilization >= 80 && <Badge tone="amber">Near Limit</Badge>}
                      </div>
                      <ProgressBar percent={h.utilization} over={h.over} />
                      <div className="flex justify-between mt-1.5 text-xs" style={{ color: C.muted }}>
                        <span>{fmtPKR(h.used)} used</span>
                        <span>{fmtPKR(h.budget)} budget</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 hidden sm:block">
                      <div className="text-sm font-bold" style={{ color: h.over ? C.red : C.text }}>{h.utilization.toFixed(1)}%</div>
                      <div className="text-xs" style={{ color: h.remaining < 0 ? C.red : C.muted }}>{fmtPKR(Math.abs(h.remaining))} {h.remaining < 0 ? "over" : "left"}</div>
                    </div>
                    <ChevronRight
                      size={16}
                      color={C.muted}
                      className="shrink-0 transition-transform duration-200"
                      style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                    />
                  </div>
                  {isOpen && (
                    <div className="px-5 pb-4 -mt-1" style={{ background: "#FAFAFA" }}>
                      <div className="text-[10px] font-semibold uppercase tracking-wide mb-2 pt-3" style={{ color: C.muted }}>Segment Breakdown</div>
                      {segmentBreakdown.length === 0 ? (
                        <div className="text-xs pb-1" style={{ color: C.muted }}>No entries yet for this header.</div>
                      ) : (
                        <div className="divide-y" style={{ borderColor: C.border }}>
                          {segmentBreakdown.map((seg) => <SegmentRow key={seg.segment} seg={seg} />)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl shadow-sm p-5 flex flex-col transition-shadow duration-200 hover:shadow-md" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <h3 className="text-sm font-semibold mb-1" style={{ color: C.text }}>Spending Trend by Header</h3>
          <p className="text-xs mb-2" style={{ color: C.muted }}>Cumulative amount used over time</p>
          <HeaderTrendChart headerStats={headerStats} expenses={expenses} />
          <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
            <div className="flex justify-between text-xs mb-1.5"><span style={{ color: C.muted }}>Used</span><span style={{ color: C.muted }}>Remaining</span></div>
            <div className="flex rounded-full overflow-hidden" style={{ height: 10, background: "#E5E5E5" }}>
              <div style={{ width: `${Math.min(pct(totals.totalUsed, totals.totalBudget), 100)}%`, background: `linear-gradient(90deg, ${C.green}, #404040)` }} />
            </div>
            <div className="flex justify-between text-xs mt-1.5 font-medium">
              <span style={{ color: C.text }}>{fmtPKR(totals.totalUsed)}</span>
              <span style={{ color: C.text }}>{fmtPKR(Math.max(totals.remaining, 0))}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
          <h3 className="text-sm font-semibold" style={{ color: C.text }}>Recent Expense Entries</h3>
          <button onClick={onViewAll} className="text-xs font-semibold" style={{ color: C.green }}>View all →</button>
        </div>
        <ExpenseTable rows={recent} headerNameById={headerNameById} onEdit={onEditExpense} onDelete={onDeleteExpense} />
      </div>
    </div>
  );
}

/* ---------------------------------- HEADER TREND CHART ---------------------------------- */
function HeaderTrendChart({ headerStats, expenses }) {
  const activeHeaders = headerStats.filter((h) => h.used > 0);

  const data = useMemo(() => {
    if (expenses.length === 0) return [];
    const sorted = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));
    const dates = [...new Set(sorted.map((e) => e.date))].sort((a, b) => new Date(a) - new Date(b));
    const running = {};
    headerStats.forEach((h) => { running[h.id] = 0; });
    return dates.map((date) => {
      sorted.filter((e) => e.date === date).forEach((e) => {
        running[e.headerId] = (running[e.headerId] || 0) + Number(e.amount);
      });
      const point = { date: fmtDate(date) };
      headerStats.forEach((h) => { point[h.id] = running[h.id]; });
      return point;
    });
  }, [expenses, headerStats]);

  if (data.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-xs" style={{ color: C.muted, height: 240 }}>
        No spending data yet — add an expense to see the trend.
      </div>
    );
  }

  return (
    <div style={{ height: 240 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            {activeHeaders.map((h, i) => {
              const color = CHART_COLORS[i % CHART_COLORS.length];
              return (
                <linearGradient key={h.id} id={`grad-${h.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.38} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: C.muted }} axisLine={{ stroke: C.border }} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)} width={40} />
          <RTooltip content={<TrendTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" iconSize={8} />
          {activeHeaders.map((h, i) => {
            const color = CHART_COLORS[i % CHART_COLORS.length];
            return (
              <Area
                key={h.id}
                type="monotone"
                dataKey={h.id}
                name={h.name}
                stroke={color}
                fill={`url(#grad-${h.id})`}
                strokeWidth={2.5}
                dot={{ r: 3.5, strokeWidth: 0, fill: color }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3.5 py-3" style={{ background: "#fff", border: `1px solid ${C.border}`, boxShadow: "0 8px 24px rgba(15,36,28,0.12)" }}>
      <div className="text-xs font-semibold mb-2" style={{ color: C.text }}>{label}</div>
      <div className="space-y-1">
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-5 text-xs">
            <span className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
              <span className="truncate" style={{ color: C.muted }}>{p.name}</span>
            </span>
            <span className="font-semibold shrink-0" style={{ color: C.text }}>{fmtPKR(p.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- EXPENSE TABLE ---------------------------------- */
function ExpenseTable({ rows, headerNameById, onEdit, onDelete }) {
  const showActions = !!(onEdit || onDelete);
  if (rows.length === 0) {
    return <div className="px-5 py-10 text-center text-sm" style={{ color: C.muted }}>No expense entries yet. Add your first expense to get started.</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: "#FAFAFA" }}>
            {["Date", "Budget Header", "Segment", "Description", "Amount", "Mode", "BU", "Added By", ...(showActions ? [""] : [])].map((h) => (
              <th key={h} className="text-left px-5 py-2.5 text-xs font-semibold uppercase tracking-wide" style={{ color: C.muted }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.id} style={{ borderTop: `1px solid ${C.border}` }}>
              <td className="px-5 py-3 whitespace-nowrap" style={{ color: C.text }}>{fmtDate(e.date)}</td>
              <td className="px-5 py-3 whitespace-nowrap">
                <span className="inline-flex items-center gap-1.5">
                  {headerNameById[e.headerId] || "—"}
                </span>
              </td>
              <td className="px-5 py-3 whitespace-nowrap" style={{ color: C.muted }}>{e.segment || "—"}</td>
              <td className="px-5 py-3 max-w-[220px] truncate" title={e.description} style={{ color: C.text }}>{e.description}</td>
              <td className="px-5 py-3 font-semibold whitespace-nowrap" style={{ color: C.text }}>{fmtPKR(e.amount)}</td>
              <td className="px-5 py-3 whitespace-nowrap" style={{ color: C.muted }}>{e.mode || "—"}</td>
              <td className="px-5 py-3 whitespace-nowrap" style={{ color: C.muted }}>{e.bu || "—"}</td>
              <td className="px-5 py-3 whitespace-nowrap" style={{ color: C.muted }}>{e.addedBy}</td>
              {showActions && (
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    {onEdit && <button onClick={() => onEdit(e)} className="p-1.5 rounded-lg hover:bg-gray-100"><Pencil size={14} color={C.muted} /></button>}
                    {onDelete && <button onClick={() => onDelete(e.id)} className="p-1.5 rounded-lg hover:bg-gray-100"><Trash2 size={14} color={C.red} /></button>}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------------------------- PAYMENT MODE MODAL ---------------------------------- */
function PaymentModeModal({ mode, stats, expenses, headerNameById, onClose, onTopUp }) {
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpDate, setTopUpDate] = useState(todayISO());
  const [topUpAmount, setTopUpAmount] = useState("");

  if (!stats) return null;
  const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleTopUp = () => {
    onTopUp(mode, topUpDate, topUpAmount);
    setShowTopUp(false);
    setTopUpAmount("");
  };

  return (
    <Modal title={`${mode} — Limit Overview`} onClose={onClose} wide>
      <div className="flex items-center gap-6 mb-5 flex-wrap">
        <Gauge percent={stats.utilization} size={120} stroke={11} over={stats.over} />
        <div className="flex-1 min-w-[180px] space-y-2 text-sm">
          <div className="flex justify-between"><span style={{ color: C.muted }}>Limit</span><span className="font-semibold" style={{ color: C.text }}>{fmtPKR(stats.limit)}</span></div>
          {stats.toppedUp > 0 && (
            <div className="flex justify-between"><span style={{ color: C.muted }}>Topped Up</span><span className="font-semibold" style={{ color: C.green }}>+{fmtPKR(stats.toppedUp)}</span></div>
          )}
          <div className="flex justify-between"><span style={{ color: C.muted }}>Used</span><span className="font-semibold" style={{ color: C.text }}>{fmtPKR(stats.used)}</span></div>
          <div className="flex justify-between"><span style={{ color: C.muted }}>Remaining</span><span className="font-semibold" style={{ color: stats.remaining < 0 ? C.red : C.green }}>{fmtPKR(stats.remaining)}</span></div>
          <div className="flex justify-between"><span style={{ color: C.muted }}>Entries</span><span className="font-semibold" style={{ color: C.text }}>{expenses.length}</span></div>
        </div>
      </div>
      {stats.over && (
        <div className="flex items-start gap-2 rounded-xl px-4 py-3 mb-4" style={{ background: C.redLight }}>
          <AlertTriangle size={16} color={C.red} className="shrink-0 mt-0.5" />
          <div className="text-xs" style={{ color: "#7A241E" }}>
            <span className="font-semibold">{mode} is over its {fmtPKR(stats.limit)} limit</span> by {fmtPKR(Math.abs(stats.remaining))}.
          </div>
        </div>
      )}

      {!showTopUp ? (
        <button
          onClick={() => setShowTopUp(true)}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold mb-4"
          style={{ background: C.greenLight, color: C.green }}
        >
          <Plus size={16} /> Top Up {mode}
        </button>
      ) : (
        <div className="rounded-xl p-4 mb-4" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <Field label="Date"><input type="date" value={topUpDate} onChange={(e) => setTopUpDate(e.target.value)} style={inputStyle} /></Field>
            <Field label="Amount (PKR)"><input type="number" min="0" value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)} placeholder="0" style={inputStyle} /></Field>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowTopUp(false)} className="rounded-lg px-3.5 py-2 text-xs font-semibold" style={{ background: "#EEEEEE", color: C.muted }}>Cancel</button>
            <button onClick={handleTopUp} className="rounded-lg px-3.5 py-2 text-xs font-semibold" style={{ background: C.accent, color: C.text }}>Confirm Top Up</button>
          </div>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        <ExpenseTable rows={sorted} headerNameById={headerNameById} />
      </div>
    </Modal>
  );
}


function HeadersView({ headerStats, expenses, onAdd, onEdit, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: C.muted }}>Manage allocated budgets for each Workplace Services spending category. Click a card to see its segment breakdown.</p>
        <button onClick={onAdd} className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold shrink-0" style={{ background: C.accent, color: C.text }}>
          <Plus size={16} /> Add Header
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {headerStats.map((h) => {
          const isOpen = expandedId === h.id;
          const segmentBreakdown = isOpen ? getSegmentBreakdown(h.name, h.id, expenses) : [];
          return (
            <div
              key={h.id}
              className="rounded-2xl p-5 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md"
              style={{ background: C.card, border: `1px solid ${h.over ? "#F3C7C3" : C.border}` }}
              onClick={() => setExpandedId(isOpen ? null : h.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-semibold truncate" style={{ color: C.text }}>{h.name}</h4>
                  </div>
                  <Badge tone={h.status === "Active" ? "green" : "muted"}>{h.status}</Badge>
                </div>
                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => onEdit(h)} className="p-1.5 rounded-lg hover:bg-gray-100"><Pencil size={14} color={C.muted} /></button>
                  <button onClick={() => onDelete(h.id)} className="p-1.5 rounded-lg hover:bg-gray-100"><Trash2 size={14} color={C.red} /></button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Gauge percent={h.utilization} size={92} stroke={9} over={h.over} />
                <div className="flex-1 space-y-1.5 text-xs">
                  <div className="flex justify-between"><span style={{ color: C.muted }}>Budget</span><span className="font-semibold" style={{ color: C.text }}>{fmtPKR(h.budget)}</span></div>
                  <div className="flex justify-between"><span style={{ color: C.muted }}>Used</span><span className="font-semibold" style={{ color: C.text }}>{fmtPKR(h.used)}</span></div>
                  <div className="flex justify-between"><span style={{ color: C.muted }}>Remaining</span><span className="font-semibold" style={{ color: h.remaining < 0 ? C.red : C.green }}>{fmtPKR(h.remaining)}</span></div>
                </div>
              </div>
              {h.over && (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-medium rounded-lg px-3 py-2" style={{ background: C.redLight, color: C.red }}>
                  <AlertTriangle size={13} /> Over budget by {fmtPKR(Math.abs(h.remaining))}
                </div>
              )}
              <div className="mt-3 flex items-center justify-between text-xs" style={{ color: C.muted }}>
                <span>{fmtDate(h.startDate)} {h.endDate ? `→ ${fmtDate(h.endDate)}` : "→ Till Date"}</span>
                <span className="flex items-center gap-1 font-semibold" style={{ color: C.green }}>
                  Segments <ChevronRight size={13} className="transition-transform duration-200" style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }} />
                </span>
              </div>
              {isOpen && (
                <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
                  {segmentBreakdown.length === 0 ? (
                    <div className="text-xs" style={{ color: C.muted }}>No entries yet for this header.</div>
                  ) : (
                    <div className="divide-y" style={{ borderColor: C.border }}>
                      {segmentBreakdown.map((seg) => <SegmentRow key={seg.segment} seg={seg} />)}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {headerStats.length === 0 && (
          <div className="col-span-full text-center py-14 text-sm" style={{ color: C.muted }}>No budget headers yet. Add one to get started.</div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- BU BUDGETS VIEW ---------------------------------- */
function BuBudgetsView({ buStats, onSetBudget }) {
  return (
    <div className="space-y-5">
      <p className="text-sm" style={{ color: C.muted }}>
        Set an allocated budget for each Business Unit. This is for visibility only — it shows how much each BU
        has spent against its own budget, but does <span className="font-semibold">not</span> reduce the
        Budget Header/Segment totals above. Only <span className="font-semibold">Soft FM</span> is flagged when it
        goes over its allocated amount.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {buStats.map((b) => {
          const enforced = b.bu === "Soft FM";
          const over = enforced && b.budget > 0 && b.used > b.budget;
          return (
            <div
              key={b.bu}
              className="rounded-2xl p-5 shadow-sm"
              style={{ background: C.card, border: `1px solid ${over ? "#F3C7C3" : C.border}` }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold truncate" style={{ color: C.text }}>{b.bu}</h4>
                {enforced && <Badge tone={over ? "red" : "green"}>{over ? "Over Budget" : "Tracked"}</Badge>}
              </div>
              <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: C.muted }}>
                <span>Allocated Budget (PKR)</span>
              </div>
              <input
                type="number"
                min="0"
                value={b.budget || ""}
                onChange={(e) => onSetBudget(b.bu, e.target.value)}
                placeholder="0"
                className="w-full rounded-xl px-3 py-2 text-sm font-semibold mb-3"
                style={{ border: `1px solid ${C.border}`, color: C.text, background: "#fff" }}
              />
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: C.muted }}>Spent</span>
                <span className="font-bold tabular-nums" style={{ color: over ? C.red : C.text }}>{fmtPKR(b.used)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs" style={{ color: C.muted }}>
                <span>{fmtPKR(b.budget)} / {fmtPKR(b.used)}</span>
                {over && (
                  <span className="font-semibold" style={{ color: C.red }}>
                    Over by {fmtPKR(Math.abs(b.remaining))}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------- EXPENSES VIEW ---------------------------------- */
function ExpensesView({ expenses, headers, headerNameById, onAdd, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [headerFilter, setHeaderFilter] = useState("all");

  const filtered = useMemo(() => {
    return expenses
      .filter((e) => (headerFilter === "all" ? true : e.headerId === headerFilter))
      .filter((e) => {
        if (!search.trim()) return true;
        const s = search.toLowerCase();
        return e.description.toLowerCase().includes(s) || (e.vendor || "").toLowerCase().includes(s) || e.addedBy.toLowerCase().includes(s);
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, search, headerFilter]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" color={C.muted} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search description, vendor, added by…"
              style={{ ...inputStyle, paddingLeft: 32 }} />
          </div>
          <select value={headerFilter} onChange={(e) => setHeaderFilter(e.target.value)} style={{ ...inputStyle, maxWidth: 200 }}>
            <option value="all">All Headers</option>
            {headers.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
        </div>
        <button onClick={onAdd} className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold shrink-0" style={{ background: C.accent, color: C.text }}>
          <Plus size={16} /> Add Expense
        </button>
      </div>
      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <ExpenseTable rows={filtered} headerNameById={headerNameById} onEdit={onEdit} onDelete={onDelete} />
      </div>
      <p className="text-xs" style={{ color: C.muted }}>{filtered.length} of {expenses.length} entries shown</p>
    </div>
  );
}

/* ---------------------------------- HISTORY VIEW ---------------------------------- */
function HistoryView({ history }) {
  const [search, setSearch] = useState("");
  const [buFilter, setBuFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [tillDate, setTillDate] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 50;

  const bus = useMemo(() => [...new Set(history.map((h) => h.bu).filter(Boolean))].sort(), [history]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return history.filter((h) => {
      if (buFilter !== "all" && h.bu !== buFilter) return false;
      if (typeFilter !== "all" && h.type !== typeFilter) return false;
      if (fromDate && h.date && h.date < fromDate) return false;
      if (tillDate && h.date && h.date > tillDate) return false;
      if (q && !`${h.description} ${h.bu} ${h.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [history, search, buFilter, typeFilter, fromDate, tillDate]);

  const totalExpense = filtered.filter((h) => h.type === "expense").reduce((s, h) => s + Number(h.amount || 0), 0);
  const totalInflow = filtered.filter((h) => h.type === "inflow").reduce((s, h) => s + Number(h.amount || 0), 0);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: C.muted }}>
        Read-only archive imported from the old petty cash tracker (Jan 2026 \u2013 Sep 2026). New expenses added through the app appear in Expense Entries, not here.
      </p>

      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search description, BU or category\u2026"
          className="flex-1 min-w-[200px] rounded-xl px-3 py-2 text-sm"
          style={{ border: `1px solid ${C.border}` }}
        />
        <select
          value={buFilter}
          onChange={(e) => { setBuFilter(e.target.value); setPage(1); }}
          className="rounded-xl px-3 py-2 text-sm"
          style={{ border: `1px solid ${C.border}` }}
        >
          <option value="all">All BUs</option>
          {bus.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="rounded-xl px-3 py-2 text-sm"
          style={{ border: `1px solid ${C.border}` }}
        >
          <option value="all">Expenses + Cash In</option>
          <option value="expense">Expenses only</option>
          <option value="inflow">Cash In only</option>
        </select>
        <div className="flex items-center gap-1.5">
          <label className="text-xs" style={{ color: C.muted }}>From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
            className="rounded-xl px-3 py-2 text-sm"
            style={{ border: `1px solid ${C.border}` }}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <label className="text-xs" style={{ color: C.muted }}>Till</label>
          <input
            type="date"
            value={tillDate}
            onChange={(e) => { setTillDate(e.target.value); setPage(1); }}
            className="rounded-xl px-3 py-2 text-sm"
            style={{ border: `1px solid ${C.border}` }}
          />
        </div>
        {(fromDate || tillDate) && (
          <button
            onClick={() => { setFromDate(""); setTillDate(""); setPage(1); }}
            className="text-xs font-semibold px-3 py-2 rounded-xl"
            style={{ color: C.muted, border: `1px solid ${C.border}` }}
          >
            Clear dates
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <KPICard label="Total Entries" value={String(filtered.length)} icon={ReceiptText} tone="blue" />
        <KPICard label="Total Expenses" value={fmtPKR(totalExpense)} icon={Wallet} tone="red" />
        <KPICard label="Total Cash In" value={fmtPKR(totalInflow)} icon={TrendingUp} tone="green" />
      </div>

      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: C.bg }}>
                <th className="text-left px-4 py-2.5 font-semibold" style={{ color: C.muted }}>Date</th>
                <th className="text-left px-4 py-2.5 font-semibold" style={{ color: C.muted }}>BU</th>
                <th className="text-left px-4 py-2.5 font-semibold" style={{ color: C.muted }}>Category</th>
                <th className="text-left px-4 py-2.5 font-semibold" style={{ color: C.muted }}>Description</th>
                <th className="text-right px-4 py-2.5 font-semibold" style={{ color: C.muted }}>Amount</th>
                <th className="text-left px-4 py-2.5 font-semibold" style={{ color: C.muted }}>Type</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: C.border }}>
              {pageRows.map((h, i) => (
                <tr key={i}>
                  <td className="px-4 py-2.5 whitespace-nowrap" style={{ color: C.text }}>{h.date ? fmtDate(h.date) : "\u2014"}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap" style={{ color: C.text }}>{h.bu || "\u2014"}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap" style={{ color: C.muted }}>{h.category || "\u2014"}</td>
                  <td className="px-4 py-2.5 max-w-md" style={{ color: C.text }}>{h.description || "\u2014"}</td>
                  <td className="px-4 py-2.5 text-right font-semibold whitespace-nowrap" style={{ color: h.type === "inflow" ? C.green : C.text }}>
                    {h.type === "inflow" ? "+" : ""}{fmtPKR(h.amount)}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <Badge tone={h.type === "inflow" ? "green" : "muted"}>{h.type === "inflow" ? "Cash In" : "Expense"}</Badge>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-sm" style={{ color: C.muted }}>No matching entries.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg"
            style={{ border: `1px solid ${C.border}`, opacity: page === 1 ? 0.5 : 1 }}
          >
            Previous
          </button>
          <span style={{ color: C.muted }}>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg"
            style={{ border: `1px solid ${C.border}`, opacity: page === totalPages ? 0.5 : 1 }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
/* ---------------------------------- REPORTS VIEW ---------------------------------- */
function ReportsView({ headers, expenses, headerStats, headerNameById }) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [headerFilter, setHeaderFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("");
  const [addedByFilter, setAddedByFilter] = useState("all");

  const addedByOptions = useMemo(() => [...new Set(expenses.map((e) => e.addedBy))], [expenses]);

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      if (dateFrom && e.date < dateFrom) return false;
      if (dateTo && e.date > dateTo) return false;
      if (headerFilter !== "all" && e.headerId !== headerFilter) return false;
      if (vendorFilter.trim() && !(e.vendor || "").toLowerCase().includes(vendorFilter.trim().toLowerCase())) return false;
      if (addedByFilter !== "all" && e.addedBy !== addedByFilter) return false;
      return true;
    });
  }, [expenses, dateFrom, dateTo, headerFilter, vendorFilter, addedByFilter]);

  const filteredTotal = filtered.reduce((s, e) => s + Number(e.amount), 0);
  const scopedBudget = headerFilter === "all" ? headers.reduce((s, h) => s + Number(h.budget), 0) : (headers.find(h => h.id === headerFilter)?.budget || 0);

  const byHeader = useMemo(() => {
    const map = {};
    filtered.forEach((e) => { map[e.headerId] = (map[e.headerId] || 0) + Number(e.amount); });
    return Object.entries(map).map(([id, amt]) => ({ id, name: headerNameById[id] || "—", amount: amt })).sort((a, b) => b.amount - a.amount);
  }, [filtered, headerNameById]);

  const byMonth = useMemo(() => {
    const map = {};
    filtered.forEach((e) => {
      const d = new Date(e.date + "T00:00:00");
      const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
      map[key] = (map[key] || 0) + Number(e.amount);
    });
    return Object.entries(map).map(([month, amount]) => ({ month, amount }));
  }, [filtered]);

  const byDate = useMemo(() => {
    const map = {};
    filtered.forEach((e) => { map[e.date] = (map[e.date] || 0) + Number(e.amount); });
    return Object.entries(map).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  }, [filtered]);

  const overBudget = headerStats.filter((h) => h.over);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-5 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <Field label="Date From"><input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={inputStyle} /></Field>
        <Field label="Date To"><input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={inputStyle} /></Field>
        <Field label="Budget Header">
          <select value={headerFilter} onChange={(e) => setHeaderFilter(e.target.value)} style={inputStyle}>
            <option value="all">All Headers</option>
            {headers.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
        </Field>
        <Field label="Vendor"><input value={vendorFilter} onChange={(e) => setVendorFilter(e.target.value)} placeholder="Vendor name…" style={inputStyle} /></Field>
        <Field label="Added By">
          <select value={addedByFilter} onChange={(e) => setAddedByFilter(e.target.value)} style={inputStyle}>
            <option value="all">Everyone</option>
            {addedByOptions.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Scoped Budget" value={fmtPKR(scopedBudget)} icon={Wallet} tone="blue" />
        <KPICard label="Scoped Used" value={fmtPKR(filteredTotal)} sub={`${filtered.length} entries`} icon={ReceiptText} tone="purple" />
        <KPICard label="Scoped Remaining" value={fmtPKR(scopedBudget - filteredTotal)} icon={TrendingUp} tone={scopedBudget - filteredTotal < 0 ? "red" : "green"} />
        <KPICard label="Scoped Utilization" value={`${pct(filteredTotal, scopedBudget).toFixed(1)}%`} icon={FileBarChart2} tone="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="px-5 py-4 text-sm font-semibold" style={{ borderBottom: `1px solid ${C.border}`, color: C.text }}>Header-wise Spending</div>
          <div className="divide-y" style={{ borderColor: C.border }}>
            {byHeader.length === 0 && <div className="px-5 py-6 text-sm text-center" style={{ color: C.muted }}>No data for this filter.</div>}
            {byHeader.map((h) => (
              <div key={h.id} className="px-5 py-3 flex justify-between text-sm" style={{ borderBottom: `1px solid ${C.border}` }}>
                <span style={{ color: C.text }}>{h.name}</span>
                <span className="font-semibold" style={{ color: C.text }}>{fmtPKR(h.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="px-5 py-4 text-sm font-semibold" style={{ borderBottom: `1px solid ${C.border}`, color: C.text }}>Monthly Spending</div>
          <div className="divide-y" style={{ borderColor: C.border }}>
            {byMonth.length === 0 && <div className="px-5 py-6 text-sm text-center" style={{ color: C.muted }}>No data for this filter.</div>}
            {byMonth.map((m) => (
              <div key={m.month} className="px-5 py-3 flex justify-between text-sm" style={{ borderBottom: `1px solid ${C.border}` }}>
                <span style={{ color: C.text }}>{m.month}</span>
                <span className="font-semibold" style={{ color: C.text }}>{fmtPKR(m.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="px-5 py-4 text-sm font-semibold" style={{ borderBottom: `1px solid ${C.border}`, color: C.text }}>Highest Spending Headers</div>
          <div className="divide-y" style={{ borderColor: C.border }}>
            {byHeader.slice(0, 5).map((h, i) => (
              <div key={h.id} className="px-5 py-3 flex items-center gap-3 text-sm" style={{ borderBottom: `1px solid ${C.border}` }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: C.greenLight, color: C.green }}>{i + 1}</span>
                <span className="flex-1" style={{ color: C.text }}>{h.name}</span>
                <span className="font-semibold" style={{ color: C.text }}>{fmtPKR(h.amount)}</span>
              </div>
            ))}
            {byHeader.length === 0 && <div className="px-5 py-6 text-sm text-center" style={{ color: C.muted }}>No data for this filter.</div>}
          </div>
        </div>

        <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="px-5 py-4 text-sm font-semibold flex items-center gap-1.5" style={{ borderBottom: `1px solid ${C.border}`, color: C.text }}>
            <AlertTriangle size={14} color={C.red} /> Over-Budget Headers
          </div>
          <div className="divide-y" style={{ borderColor: C.border }}>
            {overBudget.length === 0 && <div className="px-5 py-6 text-sm text-center" style={{ color: C.muted }}>No headers are currently over budget.</div>}
            {overBudget.map((h) => (
              <div key={h.id} className="px-5 py-3 flex justify-between text-sm" style={{ borderBottom: `1px solid ${C.border}` }}>
                <span style={{ color: C.text }}>{h.name}</span>
                <span className="font-semibold" style={{ color: C.red }}>+{fmtPKR(Math.abs(h.remaining))}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="px-5 py-4 text-sm font-semibold" style={{ borderBottom: `1px solid ${C.border}`, color: C.text }}>Date-wise Spending</div>
        <div className="max-h-72 overflow-y-auto divide-y" style={{ borderColor: C.border }}>
          {byDate.length === 0 && <div className="px-5 py-6 text-sm text-center" style={{ color: C.muted }}>No data for this filter.</div>}
          {byDate.map(([date, amt]) => (
            <div key={date} className="px-5 py-2.5 flex justify-between text-sm" style={{ borderBottom: `1px solid ${C.border}` }}>
              <span style={{ color: C.text }}>{fmtDate(date)}</span>
              <span className="font-semibold" style={{ color: C.text }}>{fmtPKR(amt)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- EXPORT VIEW ---------------------------------- */
function toCSV(rows) {
  return rows.map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
}
function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function ExportView({ headers, expenses, headerNameById, notify }) {
  const exportExpenses = () => {
    const rows = [["Date", "Budget Header", "Segment", "Description", "Vendor/Purpose", "Amount (PKR)", "Mode of Payment", "BU", "Added By", "Remarks"]];
    expenses.forEach((e) => rows.push([fmtDate(e.date), headerNameById[e.headerId] || "—", e.segment || "", e.description, e.vendor || "", e.amount, e.mode || "", e.bu || "", e.addedBy, e.remarks || ""]));
    downloadCSV(toCSV(rows), "expense-entries.csv");
    notify("Expense entries exported.");
  };
  const exportHeaders = () => {
    const rows = [["Header Name", "Allocated Budget", "Used", "Remaining", "Utilization %", "Status", "Start Date", "End Date"]];
    headers.forEach((h) => {
      const used = expenses.filter((e) => e.headerId === h.id).reduce((s, e) => s + Number(e.amount), 0);
      rows.push([h.name, h.budget, used, h.budget - used, pct(used, h.budget).toFixed(2), h.status, fmtDate(h.startDate), h.endDate ? fmtDate(h.endDate) : "Till Date"]);
    });
    downloadCSV(toCSV(rows), "budget-headers.csv");
    notify("Budget headers exported.");
  };
  const exportSummary = () => {
    const totalBudget = headers.reduce((s, h) => s + Number(h.budget), 0);
    const totalUsed = expenses.reduce((s, e) => s + Number(e.amount), 0);
    const rows = [
      ["Metric", "Value"],
      ["Total Budget", totalBudget],
      ["Total Used", totalUsed],
      ["Total Remaining", totalBudget - totalUsed],
      ["Utilization %", pct(totalUsed, totalBudget).toFixed(2)],
      ["Period", "20 Jul 2026 to " + fmtDate(todayISO())],
    ];
    downloadCSV(toCSV(rows), "budget-summary.csv");
    notify("Summary report exported.");
  };

  const cards = [
    { title: "Expense Entries", desc: `Export all ${expenses.length} expense records with header, vendor, amount and remarks.`, action: exportExpenses },
    { title: "Budget Headers", desc: `Export all ${headers.length} budget headers with allocated, used, remaining and utilization.`, action: exportHeaders },
    { title: "Summary Report", desc: "Export overall totals and utilization for the current budget cycle.", action: exportSummary },
  ];

  return (
    <div className="space-y-5">
      <p className="text-sm" style={{ color: C.muted }}>Download workplace services budget data as CSV files, ready to open in Excel.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.title} className="rounded-2xl p-5 shadow-sm flex flex-col" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: C.greenLight }}>
              <Download size={17} color={C.green} />
            </div>
            <h4 className="text-sm font-semibold mb-1.5" style={{ color: C.text }}>{c.title}</h4>
            <p className="text-xs flex-1 mb-4" style={{ color: C.muted }}>{c.desc}</p>
            <button onClick={c.action} className="rounded-xl px-4 py-2.5 text-sm font-semibold" style={{ background: C.accent, color: C.text }}>
              Export CSV
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- SETTINGS VIEW ---------------------------------- */
function SettingsView({ onClear, headerCount, expenseCount, onPull, syncing, sheetConfigured }) {
  const [confirmClear, setConfirmClear] = useState(false);
  return (
    <div className="max-w-2xl space-y-5">
      <div className="rounded-2xl p-5 shadow-sm" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: C.text }}>Workspace Info</h3>
        <p className="text-xs mb-4" style={{ color: C.muted }}>General information about this budget dashboard.</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span style={{ color: C.muted }}>Organization</span><span style={{ color: C.text }}>Disrupt.com</span></div>
          <div className="flex justify-between"><span style={{ color: C.muted }}>Department</span><span style={{ color: C.text }}>Workplace Services</span></div>
          <div className="flex justify-between"><span style={{ color: C.muted }}>Budget Cycle</span><span style={{ color: C.text }}>20 Jul 2026 → Till Date</span></div>
          <div className="flex justify-between"><span style={{ color: C.muted }}>Budget Headers</span><span style={{ color: C.text }}>{headerCount}</span></div>
          <div className="flex justify-between"><span style={{ color: C.muted }}>Expense Entries</span><span style={{ color: C.text }}>{expenseCount}</span></div>
        </div>
      </div>

      <div className="rounded-2xl p-5 shadow-sm" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold" style={{ color: C.text }}>Google Sheet Sync</h3>
          <Badge tone={sheetConfigured ? "green" : "muted"}>{sheetConfigured ? "Connected" : "Not connected"}</Badge>
        </div>
        <p className="text-xs mb-4" style={{ color: C.muted }}>
          {sheetConfigured
            ? "New, edited and deleted expenses are pushed to the \"App Expense Log\" tab automatically."
            : "Add your Apps Script Web App URL in the code (GOOGLE_SHEETS_WEBHOOK_URL) to turn this on."}
        </p>
        <button
          onClick={onPull}
          disabled={!sheetConfigured || syncing}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold"
          style={{ background: C.greenLight, color: C.green, opacity: !sheetConfigured || syncing ? 0.5 : 1 }}
        >
          <RotateCcw size={15} className={syncing ? "animate-spin" : ""} /> {syncing ? "Pulling…" : "Pull Latest from Sheet"}
        </button>
      </div>

      <div className="rounded-2xl p-5 shadow-sm" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: C.text }}>Data Management</h3>
        <p className="text-xs mb-4" style={{ color: C.muted }}>Your data is saved automatically and stays available after refreshing.</p>
        <div className="flex flex-wrap gap-3">
          {!confirmClear ? (
            <button onClick={() => setConfirmClear(true)} className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold" style={{ background: C.redLight, color: C.red }}>
              <Trash2 size={15} /> Clear All Data
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: C.red }}>Are you sure? This can't be undone.</span>
              <button onClick={() => { onClear(); setConfirmClear(false); }} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white" style={{ background: C.red }}>Yes, clear</button>
              <button onClick={() => setConfirmClear(false)} className="rounded-lg px-3 py-1.5 text-xs font-semibold" style={{ background: "#EEEEEE", color: C.muted }}>Cancel</button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl px-5 py-4" style={{ background: "#F0F0F1" }}>
        <Info size={16} color={C.blue} className="shrink-0 mt-0.5" />
        <p className="text-xs" style={{ color: "#3F3F46" }}>
          {sheetConfigured
            ? "Expenses saved on this device also sync to the shared Google Sheet, so other devices can pull the same data."
            : "Data currently persists in secure app storage tied to this dashboard. Ask Workplace Services IT if you'd like this connected to a shared Google Sheet or database for team-wide access."}
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------- EXPENSE MODAL ---------------------------------- */
function ExpenseModal({ headers, initial, onClose, onSave, headerStats, expenses, buStats, notify }) {
  const editingId = initial?.id || null;
  const initialHeaderId = initial?.headerId || (headers[0]?.id || "");
  const initialHeaderName = headers.find((h) => h.id === initialHeaderId)?.name || "";
  const [form, setForm] = useState({
    date: initial?.date || todayISO(),
    headerId: initialHeaderId,
    segment: initial?.segment || segmentsForHeader(initialHeaderName)[0] || "",
    description: initial?.description || "",
    amount: initial?.amount ?? "",
    mode: initial?.mode || PAYMENT_MODES[0],
    vendor: initial?.vendor || "",
    bu: initial?.bu || BU_OPTIONS[0],
    addedBy: initial?.addedBy || ADDED_BY_OPTIONS[0],
    imageData: initial?.imageData || null,
    imageName: initial?.imageName || "",
    documentData: initial?.documentData || null,
    documentName: initial?.documentName || "",
    email: initial?.email || "",
    remarks: initial?.remarks || "",
  });

  const selectedHeader = headerStats.find((h) => h.id === form.headerId);
  const projected = selectedHeader ? selectedHeader.used + Number(form.amount || 0) : 0;
  const willExceed = selectedHeader && Number(form.amount) > 0 && projected > selectedHeader.budget;
  const segmentOptions = segmentsForHeader(selectedHeader?.name || "");
  const segmentStats = selectedHeader
    ? getSegmentBreakdown(selectedHeader.name, selectedHeader.id, expenses).find((s) => s.segment === form.segment)
    : null;
  const segmentProjected = segmentStats ? segmentStats.used + Number(form.amount || 0) : 0;
  const segmentWillExceed = segmentStats && segmentStats.budget > 0 && Number(form.amount) > 0 && segmentProjected > segmentStats.budget;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onHeaderChange = (e) => {
    const newHeaderId = e.target.value;
    const newHeaderName = headers.find((h) => h.id === newHeaderId)?.name || "";
    const newSegments = segmentsForHeader(newHeaderName);
    setForm((f) => ({ ...f, headerId: newHeaderId, segment: newSegments[0] || "" }));
  };

  const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024; // ~1.5MB, keeps localStorage usable
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const scanReceipt = async (dataUrl) => {
    setScanning(true);
    setScanProgress(0);
    try {
      // PREVIEW BUILD NOTE: tesseract.js isn't available in this chat preview
      // sandbox. This works fully in your deployed Vercel app (already wired
      // up there) — this stub just avoids crashing the in-chat preview.
      await new Promise((r) => setTimeout(r, 600));
      notify?.("OCR scanning works once deployed on Vercel — not available in this in-chat preview.", "error");
    } catch (err) {
      notify?.("Couldn't read the receipt automatically. Please fill the details manually.", "error");
    } finally {
      setScanning(false);
      setScanProgress(0);
    }
  };

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notify?.("Please attach an image file.", "error");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      notify?.("Image is too large — please attach a file under 1.5MB.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, imageData: reader.result, imageName: file.name }));
      // Scan automatically as soon as the receipt is attached — no extra click needed.
      scanReceipt(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const removeImage = () => setForm((f) => ({ ...f, imageData: null, imageName: "" }));


  const MAX_DOC_BYTES = 3 * 1024 * 1024; // ~3MB
  const onDocumentChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_DOC_BYTES) {
      notify?.("Document is too large — please attach a file under 3MB.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, documentData: reader.result, documentName: file.name }));
    reader.readAsDataURL(file);
  };
  const removeDocument = () => setForm((f) => ({ ...f, documentData: null, documentName: "" }));

  return (
    <Modal title={editingId ? "Edit Expense" : "Add Expense"} onClose={onClose} wide>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <div className="sm:col-span-2">
          {form.imageData ? (
            <div className="rounded-xl overflow-hidden mb-3" style={{ border: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-3 px-3 py-2">
                <img src={form.imageData} alt="Receipt preview" className="w-12 h-12 object-cover rounded-lg" />
                <span className="text-xs flex-1 truncate" style={{ color: C.muted }}>{form.imageName}</span>
                <button type="button" onClick={removeImage} className="p-1.5 rounded-lg hover:bg-gray-100">
                  <X size={14} color={C.muted} />
                </button>
              </div>
              {scanning && (
                <div
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold"
                  style={{ background: C.bg, color: C.muted, borderTop: `1px solid ${C.border}` }}
                >
                  <span
                    className="inline-block h-3.5 w-3.5 rounded-full border-2 animate-spin"
                    style={{ borderColor: `${C.muted} transparent ${C.muted} ${C.muted}` }}
                  />
                  Scanning receipt… {scanProgress}% — filling in details automatically
                </div>
              )}
              {!scanning && (
                <button
                  type="button"
                  onClick={() => scanReceipt(form.imageData)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold"
                  style={{ background: C.accent, color: C.text, borderTop: `1px solid ${C.border}` }}
                >
                  <Search size={13} />
                  Re-scan Receipt
                </button>
              )}
            </div>
          ) : (
            <label
              htmlFor="receipt-scan-input"
              className="mb-3 flex flex-col items-center justify-center gap-1.5 rounded-2xl px-4 py-6 cursor-pointer text-center"
              style={{ border: `1.5px dashed ${C.accent}`, background: C.bg }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: C.accent }}>
                <Search size={18} color={C.text} />
              </div>
              <div className="text-sm font-semibold" style={{ color: C.text }}>Scan a Receipt</div>
              <div className="text-[11px]" style={{ color: C.muted }}>
                Snap or upload a photo — vendor, amount and date fill in automatically
              </div>
              <input id="receipt-scan-input" type="file" accept="image/*" onChange={onImageChange} className="hidden" />
            </label>
          )}
        </div>
        <Field label="Expense Date"><input type="date" value={form.date} onChange={set("date")} style={inputStyle} /></Field>
        <Field label="Budget Header">
          <select value={form.headerId} onChange={onHeaderChange} style={inputStyle}>
            {headers.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
        </Field>
        <Field label="Segment">
          <select value={form.segment} onChange={set("segment")} style={inputStyle}>
            {segmentOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        {selectedHeader && (
          <div className="sm:col-span-2 -mt-1 mb-3 space-y-2">
            <div className="rounded-xl px-4 py-3 grid grid-cols-3 gap-2" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: C.muted }}>Header Budget</div>
                <div className="text-sm font-bold tabular-nums" style={{ color: C.text }}>{fmtPKR(selectedHeader.budget)}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: C.muted }}>Used So Far</div>
                <div className="text-sm font-bold tabular-nums" style={{ color: C.text }}>{fmtPKR(selectedHeader.used)}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: C.muted }}>Available</div>
                <div className="text-sm font-bold tabular-nums" style={{ color: selectedHeader.remaining < 0 ? C.red : C.green }}>{fmtPKR(selectedHeader.remaining)}</div>
              </div>
            </div>
            {segmentStats && segmentStats.budget > 0 && (
              <div className="rounded-xl px-4 py-3 grid grid-cols-3 gap-2" style={{ background: C.greenLight, border: `1px solid ${C.border}` }}>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wide truncate" style={{ color: C.muted }} title={segmentStats.segment}>{segmentStats.segment}</div>
                  <div className="text-sm font-bold tabular-nums" style={{ color: C.text }}>{fmtPKR(segmentStats.budget)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: C.muted }}>Used</div>
                  <div className="text-sm font-bold tabular-nums" style={{ color: C.text }}>{fmtPKR(segmentStats.used)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: C.muted }}>Available</div>
                  <div className="text-sm font-bold tabular-nums" style={{ color: segmentStats.remaining < 0 ? C.red : C.green }}>{fmtPKR(segmentStats.remaining)}</div>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="sm:col-span-2">
          <Field label="Description"><input value={form.description} onChange={set("description")} placeholder="e.g. Lunch for Auto OS Team" style={inputStyle} /></Field>
        </div>
        <Field label="Amount (PKR)"><input type="number" min="0" value={form.amount} onChange={set("amount")} placeholder="0" style={inputStyle} /></Field>
        <Field label="Mode of Payment">
          <select value={form.mode} onChange={set("mode")} style={inputStyle}>
            {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Vendor / Purpose"><input value={form.vendor} onChange={set("vendor")} placeholder="e.g. Prompt Cafe, 140-H" style={inputStyle} /></Field>
        <Field label="BU">
          <select value={form.bu} onChange={set("bu")} style={inputStyle}>
            {BU_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </Field>
        {(() => {
          const selectedBu = (buStats || []).find((b) => b.bu === form.bu);
          if (!selectedBu) return null;
          const isSoftFm = form.bu === "Soft FM";
          const willBeOver = isSoftFm && selectedBu.budget > 0 && (selectedBu.used + Number(form.amount || 0)) > selectedBu.budget;
          return (
            <div className="sm:col-span-2 -mt-1 mb-1 flex items-center justify-between rounded-xl px-4 py-2.5 text-xs" style={{ background: willBeOver ? C.redLight : C.bg, border: `1px solid ${C.border}` }}>
              <span style={{ color: C.muted }}>{form.bu} budget</span>
              <span className="font-semibold tabular-nums" style={{ color: willBeOver ? C.red : C.text }}>
                {fmtPKR(selectedBu.budget)} / {fmtPKR(selectedBu.used)}
                {willBeOver && " — over budget"}
              </span>
            </div>
          );
        })()}
        <Field label="Added By">
          <select value={form.addedBy} onChange={set("addedBy")} style={inputStyle}>
            {ADDED_BY_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </Field>
        <Field label="Email (optional)"><input type="email" value={form.email} onChange={set("email")} placeholder="name@disrupt.com" style={inputStyle} /></Field>
        <Field label="Attach Document (optional)">
          {form.documentData ? (
            <div className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ border: `1px solid ${C.border}` }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: C.greenLight }}>
                <FileText size={18} color={C.green} />
              </div>
              <span className="text-xs flex-1 truncate" style={{ color: C.muted }}>{form.documentName}</span>
              <button type="button" onClick={removeDocument} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X size={14} color={C.muted} />
              </button>
            </div>
          ) : (
            <input type="file" onChange={onDocumentChange} style={inputStyle} />
          )}
        </Field>
        <div className="sm:col-span-2">
          <Field label="Remarks (optional)"><input value={form.remarks} onChange={set("remarks")} style={inputStyle} /></Field>
        </div>
      </div>

      {segmentWillExceed && (
        <div className="flex items-start gap-2 rounded-xl px-4 py-3 mb-2" style={{ background: C.redLight }}>
          <AlertTriangle size={16} color={C.red} className="shrink-0 mt-0.5" />
          <div className="text-xs" style={{ color: "#7A241E" }}>
            <span className="font-semibold">This will exceed the {segmentStats.segment} segment budget</span> by {fmtPKR(segmentProjected - segmentStats.budget)}.
          </div>
        </div>
      )}
      {willExceed && (
        <div className="flex items-start gap-2 rounded-xl px-4 py-3 mb-2" style={{ background: C.redLight }}>
          <AlertTriangle size={16} color={C.red} className="shrink-0 mt-0.5" />
          <div className="text-xs" style={{ color: "#7A241E" }}>
            <span className="font-semibold">This will exceed the {selectedHeader.name} budget</span> by {fmtPKR(projected - selectedHeader.budget)}. The header will be marked Over Budget after saving.
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-2">
        <button onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold" style={{ background: "#EEEEEE", color: C.muted }}>Cancel</button>
        <button onClick={() => onSave(form, editingId)} className="rounded-xl px-5 py-2.5 text-sm font-semibold" style={{ background: C.accent, color: C.text }}>
          {editingId ? "Save Changes" : "Add Expense"}
        </button>
      </div>
    </Modal>
  );
}

/* ---------------------------------- HEADER MODAL ---------------------------------- */
function HeaderModal({ initial, onClose, onSave }) {
  const editingId = initial?.id || null;
  const [form, setForm] = useState({
    name: initial?.name || "",
    budget: initial?.budget ?? "",
    startDate: initial?.startDate || todayISO(),
    endDate: initial?.endDate || "",
    status: initial?.status || "Active",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Modal title={editingId ? "Edit Budget Header" : "Add Budget Header"} onClose={onClose}>
      <Field label="Header Name"><input value={form.name} onChange={set("name")} placeholder="e.g. Refreshments" style={inputStyle} /></Field>
      <Field label="Allocated Budget (PKR)"><input type="number" min="0" value={form.budget} onChange={set("budget")} style={inputStyle} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Start Date"><input type="date" value={form.startDate} onChange={set("startDate")} style={inputStyle} /></Field>
        <Field label="End Date (optional)"><input type="date" value={form.endDate} onChange={set("endDate")} style={inputStyle} /></Field>
      </div>
      <Field label="Status">
        <select value={form.status} onChange={set("status")} style={inputStyle}>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </Field>
      <div className="flex justify-end gap-3 mt-2">
        <button onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold" style={{ background: "#EEEEEE", color: C.muted }}>Cancel</button>
        <button onClick={() => onSave(form, editingId)} className="rounded-xl px-5 py-2.5 text-sm font-semibold" style={{ background: C.accent, color: C.text }}>
          {editingId ? "Save Changes" : "Add Header"}
        </button>
      </div>
    </Modal>
  );
}

/* ---------------------------------- CONFIRM MODAL ---------------------------------- */
function ConfirmModal({ title, body, onCancel, onConfirm }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm mb-6" style={{ color: C.muted }}>{body}</p>
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="rounded-xl px-4 py-2.5 text-sm font-semibold" style={{ background: "#EEEEEE", color: C.muted }}>Cancel</button>
        <button onClick={onConfirm} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white" style={{ background: C.red }}>Delete</button>
      </div>
    </Modal>
  );
}
