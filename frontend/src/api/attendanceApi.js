import axios from "axios";

// const API_BASE_URL = ''

// export const fetchAttendanceData = async (year) => {
//     try {
//         const response = await axios.get('http://localhost/attendance/api/members');
//         return response.data;
//     }   catch (error) {
//         throw error;
//     }

// };

export const fetchStudents = async () => {
    try {
        const response = await axios.get('http://localhost:8000/attendance/api/members');
        return response.data        
    }   catch (error) {
        throw error;
    }
};

