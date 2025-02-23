export const getStatusStyle = (status: string) => {
    switch (status) {
        case 'Reserved':
            return { backgroundColor: '#E1F5FE', color: '#0288D1' };
        case 'Ready':
            return { backgroundColor: '#E0F2F1', color: '#00796B' };
        case 'Ready':
            return { backgroundColor: '#FFF3E0', color: '#F57C00' };
        default:
            return {};
    }
};

