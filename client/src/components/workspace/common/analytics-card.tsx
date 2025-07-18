import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";

const AnalyticsCard = (props: {
  title: string;
  value: number;
  isLoading: boolean;
}) => {
  const { title, value, isLoading } = props;
  const { t } = useTranslation();

  const getArrowIconAndColor = () => {
    if (title === t("dashboard-overdue-task")) {
      if (value > 0) {
        return {
          icon: <i className="mdi mdi-arrow-bottom-left icon-item" />,
          colorClass: "icon-box-danger",
        };
      } else {
        return {
          icon: <i className="mdi mdi-arrow-top-right icon-item" />,
          colorClass: "icon-box-success",
        };
      }
    }

    if (title === t("dashboard-completed-task") || title === t("dashboard-total-task")) {
      if (value > 0) {
        return {
          icon: <i className="mdi mdi-arrow-top-right icon-item" />,
          colorClass: "icon-box-success",
        };
      } else {
        return {
          icon: <i className="mdi mdi-arrow-bottom-left icon-item" />,
          colorClass: "icon-box-danger",
        };
      }
    }

    return {
      icon: null,
      colorClass: "",
    };
  };
  const { icon, colorClass } = getArrowIconAndColor();


  return (
    <div className="card bg-sidebar">
      <div className="card-body">
        <div className="row">
          <div className="col-9">
            <div className="d-flex align-items-center align-self-start">
              <h3 className="mb-0 text-font">{isLoading ? <Loader /> : value}</h3>
            </div>
          </div>
          <div className="col-3">
            <div className={`icon ${colorClass}`}>
              {icon}
            </div>
          </div>
        </div>
        <h6 className="text-muted font-weight-normal">{title}</h6>
      </div>
    </div>
  );
};

export default AnalyticsCard;
