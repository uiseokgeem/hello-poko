import axios from "axios";

// const API_BASE_URL = ''

export const fetchAttendanceData = async (year) => {
    try {
        const response = await axios.get('Django API URL');
        return response.data;
    }   catch (error) {
        throw error;
    }

};

export const fetchStudents = async () => {
    try {
        const response = await axios.get('Django APT URL');
        return response.data        
    }   catch (error) {
        throw error;
    }
};

