import { Box } from "@mui/system";
import { TabsList as BaseTabsList, Tab as BaseTab, tabClasses } from "@mui/base";
import { styled } from "@mui/system";

export const TabsList = styled(BaseTabsList)(
  () => `
    width: 98%;
    background-color: #fff; /* لون الخلفية */
    border-radius: 8px; /* تدوير الحواف */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin-bottom: 1rem;
    overflow: hidden;
  `
);

export const Tab = styled(BaseTab)(
  () => `
    color: #757575; /* لون النص */
    cursor: pointer;
    background-color: transparent;
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 8px; /* تدوير الحواف */
    display: flex;
    justify-content: center;

    &.${tabClasses.selected} {
      background-color: #f4f4f4; /* لون الخلفية عند التحديد */
      box-shadow: 0px 4px 20px -5px rgba(200, 200, 200, 0.5); /* ظل */
      font-weight: bold;
      color: #1976d2; /* لون النص عند التحديد */
    }
  `
);

export const ScrollableBox = styled(Box)(
  () => `
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: #bdbdbd #fff; /* ألوان شريط التمرير */

    /* متصفح Webkit (Chrome, Safari) */
    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #bdbdbd; /* لون شريط التمرير */
        border-radius: 4px;
    }

    &::-webkit-scrollbar-track {
        background-color: #fff; /* لون خلفية شريط التمرير */
    }
  `
);
