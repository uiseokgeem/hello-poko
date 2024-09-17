import axios from "axios";

// const API_BASE_URL = ''

export const fetchAttendanceData = async (year) => {
    try {
        const response = await axios.get('https://www.poko-dev.com/attendance/api/records', {
            params: { year }
        });
        return response.data;
    }   catch (error) {
        throw error;

    }

};

export const fetchStudents = async () => {
    try {
        const response = await axios.get('https://www.poko-dev.com/attendance/api/members');
        return response.data        
    }   catch (error) {
        throw error;
    }
};

