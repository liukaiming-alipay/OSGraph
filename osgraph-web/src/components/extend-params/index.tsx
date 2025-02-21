import { CloseOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, InputNumber, Popover } from "antd";
import style from "./index.module.less";
import { useEffect, useState } from "react";
import { GRAPH_EXTEND_PARAMS_FORM } from "../../constants";
import { useTranslation } from "react-i18next";
import { getLast10YearsTimestampsInSeconds } from "../../utils/date";
import dayjs from "dayjs";
import { TooltipPlacement } from "antd/es/tooltip";
import { IOptions } from "../../interfaces";

const { Item } = Form;

interface Props {
  templateId: string;
  onChangeParams: (params: any) => void;
  placement?: TooltipPlacement;
  popupContainer?: HTMLElement;
  isCall?: boolean;
}
const ExtendParams: React.FC<Props> = ({
  templateId,
  onChangeParams,
  placement = "bottom",
  popupContainer = document.body,
  isCall = true,
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const { startTimestamp } = getLast10YearsTimestampsInSeconds();
  const renderItem = (option: IOptions) => {
    switch (option.type) {
      case "inputNumber":
        return (
          <Item
            key={option.key}
            name={option.key}
            label={t(option.label)}
            initialValue={option?.defaultValue}
            required={false}
            rules={[{ required: true, message: "请输入" }]}
          >
            <InputNumber style={{ width: "auto" }} min={3} max={50} />
          </Item>
        );
      case "date":
        return (
          <Item
            key={option.key}
            name={option.key}
            label={t(option.label)}
            required={false}
            rules={[{ required: true, message: "请选择" }]}
            initialValue={
              option.key === "start" ? dayjs(startTimestamp * 1000) : dayjs()
            }
          >
            <DatePicker />
          </Item>
        );
      default:
        return null;
    }
  };

  const onSubmit = () => {
    form.validateFields().then((values) => {
      if (isCall) {
        window?.Tracert?.call?.("click", 'a4378.b118751.c400429.d533730');
      }
      setOpen(false);
      if (+templateId === 1) {
        onChangeParams({
          ...values,
          start: values?.start ? dayjs(values.start).valueOf() : undefined,
          end: values?.end ? dayjs(values.end).valueOf() : undefined,
        });
        return;
      }
      onChangeParams(values);
    });
  };

  useEffect(() => {
    form.resetFields();
  }, [templateId]);

  const onReset = () => {
    form.resetFields();
  };

  const stopPropagation = (event: React.MouseEvent) => {
    // Prevent events from bubbling up
    event.stopPropagation();
  };

  return (
    <div onClick={stopPropagation}>
      <Popover
        trigger={"click"}
        placement={placement}
        open={open}
        content={
          <div className={style.paramsForm}>
            <div className={style.headerBtn}>
              <CloseOutlined onClick={() => setOpen(false)} />
            </div>
            <Form form={form}>
              {GRAPH_EXTEND_PARAMS_FORM[
                templateId as unknown as keyof typeof GRAPH_EXTEND_PARAMS_FORM
              ]?.map((item: IOptions) => renderItem(item))}
            </Form>
            <div className={style.footerBtn}>
              <Button onClick={onReset}>{t("reset")}</Button>
              <Button type="primary" onClick={onSubmit}>
                {t("sure")}
              </Button>
            </div>
          </div>
        }
        onOpenChange={(val) => setOpen(val)}
        getPopupContainer={() => popupContainer}
      >
        <Button onClick={() => setOpen(true)} type="text">
          <SettingOutlined />
        </Button>
      </Popover>
    </div>
  );
};

export default ExtendParams;
