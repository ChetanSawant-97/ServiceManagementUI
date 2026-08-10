import { FormGroup } from '@angular/forms';

export const getFormErrorMessages = (
  form: FormGroup, 
  customLabels?: Record<string, string>
): string[] => {
  const errorMessages: string[] = [];

  Object.keys(form.controls).forEach((key) => {
    const control = form.get(key);
    
    // 1. Auto-format camelCase to Title Case (e.g., 'emailId' -> 'Email Id')
    // 2. If a custom label is provided in the optional dictionary, use that instead.
    const autoFormattedName = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    const fieldName = customLabels?.[key] || autoFormattedName;

    if (control?.errors) {
      if (control.errors['required']) {
        errorMessages.push(`${fieldName} is strictly required.`);
      }
      if (control.errors['minlength']) {
        const requiredLength = control.errors['minlength'].requiredLength;
        errorMessages.push(`${fieldName} needs at least ${requiredLength} characters.`);
      }
      if (control.errors['maxlength']) {
        const requiredLength = control.errors['maxlength'].requiredLength;
        errorMessages.push(`${fieldName} cannot exceed ${requiredLength} characters.`);
      }
      
      // NEW: Handle Email errors
      if (control.errors['email']) {
        errorMessages.push(`${fieldName} must be a valid email address.`);
      }
      
      // NEW: Handle Regex/Pattern errors
      if (control.errors['pattern']) {
        errorMessages.push(`${fieldName} format is invalid.`);
      }
      
      // NEW: Handle Min/Max number values
      if (control.errors['min']) {
        errorMessages.push(`${fieldName} must be at least ${control.errors['min'].min}.`);
      }
      if (control.errors['max']) {
        errorMessages.push(`${fieldName} cannot be more than ${control.errors['max'].max}.`);
      }
    }
  });

  return errorMessages;
};


export interface CityOrLocality {
  name: string;
}

export interface DistrictData {
  district: string;
  cities: string[];
}

export interface StateData {
  state: string;
  districts: DistrictData[];
}

export const INDIA_LOCATIONS_DATA: StateData[] = [
  {
    state: "Maharashtra",
    districts: [
      {
        district: "Nagpur",
        cities: ["Nagpur City", "Kamptee", "Hingna", "Katol", "Ramtek", "Umred", "Saoner"]
      },
      {
        district: "Mumbai City",
        cities: ["Colaba", "Dadar", "Byculla", "Matunga", "Parel", "Worli", "Malabar Hill"]
      },
      {
        district: "Mumbai Suburban",
        cities: ["Andheri", "Bandra", "Borivali", "Goregaon", "Kurla", "Malad", "Mulund", "Ghatkopar"]
      },
      {
        district: "Pune",
        cities: ["Pune City", "Pimpri-Chinchwad", "Haveli", "Baramati", "Khed", "Maval", "Daund"]
      },
      {
        district: "Thane",
        cities: ["Thane City", "Kalyan", "Dombivli", "Navi Mumbai", "Ulhasnagar", "Bhiwandi", "Mira-Bhayandar"]
      },
      {
        district: "Nashik",
        cities: ["Nashik City", "Malegaon", "Sinnar", "Niphad", "Yeola", "Igatpuri", "Trimbakeshwar"]
      },
      {
        district: "Aurangabad (Chhatrapati Sambhajinagar)",
        cities: ["Aurangabad City", "Kannad", "Khuldabad", "Paithan", "Sillod", "Vaijapur"]
      },
      {
        district: "Nagpur",
        cities: ["Nagpur City", "Kamptee", "Hingna", "Katol", "Ramtek", "Umred"]
      },
      {
        district: "Wardha",
        cities: ["Wardha City", "Arvi", "Hinganghat", "Deoli", "Seloo"]
      },
      {
        district: "Amravati",
        cities: ["Amravati City", "Achalpur", "Morshi", "Warud", "Daryapur"]
      },
      {
        district: "Kolhapur",
        cities: ["Kolhapur City", "Ichalkaranji", "Shirol", "Panhala", "Kagal"]
      }
    ]
  },
  {
    state: "Karnataka",
    districts: [
      {
        district: "Bengaluru Urban",
        cities: ["Bengaluru City", "Yelahanka", "Anekal", "Kengeri", "Mahadevapura"]
      },
      {
        district: "Bengaluru Rural",
        cities: ["Devanahalli", "Doddaballapura", "Hoskote", "Nelamangala"]
      },
      {
        district: "Mysuru",
        cities: ["Mysuru City", "Nanjangud", "Hunsur", "K.R. Nagar", "T. Narasipura"]
      },
      {
        district: "Dakshina Kannada (Mangaluru)",
        cities: ["Mangaluru City", "Bantwal", "Puttur", "Sullia", "Udupi Sub-urban"]
      },
      {
        district: "Hubballi-Dharwad",
        cities: ["Hubballi", "Dharwad City", "Kundgol", "Navalgund"]
      }
    ]
  },
  {
    state: "Delhi",
    districts: [
      {
        district: "New Delhi",
        cities: ["Connaught Place", "Chanakyapuri", "Parliament Street", "Mandir Marg"]
      },
      {
        district: "South Delhi",
        cities: ["Hauz Khas", "Greater Kailash", "Saket", "Mehrauli", "Vasant Kunj", "Malviya Nagar"]
      },
      {
        district: "West Delhi",
        cities: ["Rajouri Garden", "Punjabi Bagh", "Janakpuri", "Tilak Nagar", "Paschim Vihar"]
      },
      {
        district: "East Delhi",
        cities: ["Preet Vihar", "Mayur Vihar", "Laxmi Nagar", "IP Extension"]
      },
      {
        district: "North Delhi",
        cities: ["Civil Lines", "Model Town", "Shalimar Bagh", "Pitampura"]
      }
    ]
  },
  {
    state: "Uttar Pradesh",
    districts: [
      {
        district: "Lucknow",
        cities: ["Lucknow City", "Aliganj", "Gomti Nagar", "Indira Nagar", "Alambagh", "Amina Bagh"]
      },
      {
        district: "Kanpur Nagar",
        cities: ["Kanpur City", "Swaroop Nagar", "Kidwai Nagar", "Civil Lines", "Govind Nagar"]
      },
      {
        district: "Gautam Buddh Nagar (Noida)",
        cities: ["Noida Sector 18", "Greater Noida", "Noida Extension", "Dadri", "Jewar"]
      },
      {
        district: "Ghaziabad",
        cities: ["Ghaziabad City", "Indirapuram", "Vaishali", "Vasundhara", "Modinagar"]
      },
      {
        district: "Agra",
        cities: ["Agra City", "Tajganj", "Sanjay Place", "Fatehabad", "Kheragarh"]
      },
      {
        district: "Varanasi",
        cities: ["Varanasi City", "Cantonment", "Sigra", "Lanka", "Sarnath"]
      }
    ]
  },
  {
    state: "Tamil Nadu",
    districts: [
      {
        district: "Chennai",
        cities: ["T. Nagar", "Adyar", "Mylapore", "Anna Nagar", "Velachery", "Guindy", "Nungambakkam"]
      },
      {
        district: "Coimbatore",
        cities: ["Coimbatore North", "Coimbatore South", "Pollachi", "Mettupalayam", "Sulur"]
      },
      {
        district: "Madurai",
        cities: ["Madurai North", "Madurai South", "Thirumangalam", "Melur", "Usilampatti"]
      }
    ]
  },
  {
    state: "Gujarat",
    districts: [
      {
        district: "Ahmedabad",
        cities: ["Ahmedabad City", "Navrangpura", "Satellite", "Bopal", "Maninagar", "Sanand"]
      },
      {
        district: "Surat",
        cities: ["Surat City", "Varachha", "Adajan", "Vesu", "Katargam", "Bardoli"]
      },
      {
        district: "Vadodara",
        cities: ["Vadodara City", "Alkapuri", "Sayajigunj", "Manjalpur", "Makarpura"]
      },
      {
        district: "Rajkot",
        cities: ["Rajkot City", "Kalawad", "Gondal", "Jetpur", "Dhoraji"]
      }
    ]
  },
  {
    state: "Telangana",
    districts: [
      {
        district: "Hyderabad",
        cities: ["Banjara Hills", "Jubilee Hills", "Secunderabad", "Ameerpet", "Kachiguda", "Gachibowli", "Hitec City"]
      },
      {
        district: "Rangareddy",
        cities: ["LB Nagar", "Kukatpally", "Shamshabad", "Rajendranagar", "Serilingampally"]
      },
      {
        district: "Medchal-Malkajgiri",
        cities: ["Malkajgiri", "Kukatpally", "Quthbullapur", "Medchal", "Alwal"]
      }
    ]
  },
  {
    state: "West Bengal",
    districts: [
      {
        district: "Kolkata",
        cities: ["Park Street", "Salt Lake City", "New Town", "Ballygunge", "Jadavpur", "Behala", "Tollygunge"]
      },
      {
        district: "Howrah",
        cities: ["Howrah City", "Shibpur", "Bally", "Uluberia", "Sankrail"]
      },
      {
        district: "North 24 Parganas",
        cities: ["Barasat", "Barrackpore", "Dum Dum", "Bangaon", "Basirhat"]
      }
    ]
  }
];


export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

