// Simple in-memory database for frontend
const items = [
  {
    id: 0,
    name: "Andrew Kuntz",
    email: "andkun@adp.com",
    password: "PassworD123!",
    companyName: "Orion Technologies",
    location: "Austin, TX",
    employeeCount: 870
  },
  {
    id: 1,
    name: "Michael Rajendran",
    email: "mrajendran@adp.com",
    password: "PassworD123!",
    companyName: "Summit Financial",
    location: "Charlotte, NC",
    employeeCount: 13500
  },
  {
    id: 2,
    name: "Jyothi Shah",
    email: "jshah@adp.com",
    password: "PassworD123!",
    companyName: "Novus Health Group",
    location: "Nashville, TN",
    employeeCount: 115000
  },
  {
    id: 3,
    name: "Daniel Reinke",
    email: "dreinke@adp.com",
    password: "PassworD123!",
    companyName: "Crescent Data Systems",
    location: "Denver, CO",
    employeeCount: 990
  },
  {
    id: 4,
    name: "Vadym Lipinskyy",
    email: "vlipinskyy@adp.com",
    password: "PassworD123!",
    companyName: "Evergreen Energy Solutions",
    location: "Pittsburgh, PA",
    employeeCount: 19800
  },
  {
    id: 5,
    name: "Stephen Miedema",
    email: "smiedema@adp.com",
    password: "PassworD123!",
    companyName: "Valiant Logistics",
    location: "Phoenix, AZ",
    employeeCount: 165000
  },
  {
    id: 6,
    name: "Andrew Rob",
    email: "arob@adp.com",
    password: "PassworD123!",
    companyName: "Terra Consulting Group",
    location: "Tampa, FL",
    employeeCount: 520
  },
  {
    id: 7,
    name: "Chandar Subbaian",
    email: "csubbaian@adp.com",
    password: "PassworD123!",
    companyName: "PrimeCore Solutions",
    location: "San Diego, CA",
    employeeCount: 12000
  },
  {
    id: 8,
    name: "Mark Angelillo",
    email: "mangelillo@adp.com",
    password: "PassworD123!",
    companyName: "Metrix Medical Systems",
    location: "Cincinnati, OH",
    employeeCount: 89000
  },
  {
    id: 9,
    name: "Navin Sidhaye",
    email: "nsidhaye@adp.com",
    password: "PassworD123!",
    companyName: "Helios AppWorks",
    location: "Salt Lake City, UT",
    employeeCount: 740
  },
  {
    id: 10,
    name: "Warren Campbell",
    email: "wcampbell@adp.com",
    password: "PassworD123!",
    companyName: "Atlas Manufacturing Corp",
    location: "Kansas City, MO",
    employeeCount: 17000
  },
  {
    id: 11,
    name: "Stella Jia",
    email: "sjia@adp.com",
    password: "PassworD123!",
    companyName: "Apollo Telecom Group",
    location: "Raleigh, NC",
    employeeCount: 192000
  },
  {
    id: 12,
    name: "Rajendhra Madhamanchi",
    email: "rmadhamanchi@adp.com",
    password: "PassworD123!",
    companyName: "CoreWave Analytics",
    location: "Indianapolis, IN",
    employeeCount: 350
  },
  {
    id: 13,
    name: "Shayyan Arshad",
    email: "sarshad@adp.com",
    password: "PassworD123!",
    companyName: "Trinity Financial Group",
    location: "Columbus, OH",
    employeeCount: 11000
  },
  {
    id: 14,
    name: "Meem Ahsan",
    email: "mahsan@adp.com",
    password: "PassworD123!",
    companyName: "VitaPharma Labs",
    location: "Orlando, FL",
    employeeCount: 87000
  },
  {
    id: 15,
    name: "Anju Sharma",
    email: "asharma@adp.com",
    password: "PassworD123!",
    companyName: "SkyForge Innovations",
    location: "Minneapolis, MN",
    employeeCount: 210
  },
  {
    id: 16,
    name: "Nadia Kennedy",
    email: "nkennedy@adp.com",
    password: "PassworD123!",
    companyName: "Zenith Software Inc",
    location: "San Antonio, TX",
    employeeCount: 14200
  },
  {
    id: 17,
    name: "Rap Payne",
    email: "rpayne@adp.com",
    password: "PassworD123!",
    companyName: "OmniPath Technologies",
    location: "Cleveland, OH",
    employeeCount: 157000
  },
  {
    id: 18,
    name: "Sreeni Kutam",
    email: "skutam@adp.com",
    password: "PassworD123!",
    companyName: "Aegis Cyber Defense",
    location: "Sacramento, CA",
    employeeCount: 980
  },
  {
    id: 19,
    name: "Jimmy Adams",
    email: "jadams@adp.com",
    password: "PassworD123!",
    companyName: "GlobalEdge Retail",
    location: "Las Vegas, NV",
    employeeCount: 18300
  }
];

export function getAll(){
    return [...items];
}

export function get(id){
    let result = null;
    for(let item of items){
        if(item.id === id){
            result = item;
        }
    }
    return result;
}

export function deleteById(id){
    let arrayIndex = getArrayIndexForId(id);
    if(arrayIndex >= 0 && arrayIndex < items.length){
        items.splice(arrayIndex, 1);
    }
}

export function post(item){
    let nextid = getNextId();
    item.id = nextid;
    items[items.length] = item;
    return item;
}

export function put(id, item){
    for(let i = 0; i < items.length; i++){
        if(items[i].id === id){
            items[i] = {...item, id: id};
            return items[i];
        }
    }
}

function getArrayIndexForId(id){
    for(let i = 0; i < items.length; i++){
        if(items[i].id === id){
            return i;
        }
    }
    return -1;
}

function getNextId(){
    let maxid = 0;
    for(let item of items){
        maxid = (item.id > maxid)?item.id:maxid;
    }
    return maxid + 1;
}
