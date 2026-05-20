import { setAllJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllJobs = () => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get`, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                void error;
            } finally {
                setLoading(false);
            }
        };

        fetchAllJobs();
    }, [dispatch]);
    return { loading };
};

export default useGetAllJobs;
