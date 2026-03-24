import { Fragment, type ReactNode } from "react";

interface IDecDeDataList {
  key: string;
  label: ReactNode;
  definition: ReactNode;
}

const DecDeDescriptionList = ({ entries }: { entries: IDecDeDataList[] }) => {
  return (
    <dl className="decde-datalist">
      {entries.map(({ key, label, definition }) => (
        <Fragment key={key}>
          <div className="decde-datalist--group">
            <dt className="decde-datalist--label">{label}</dt>
            <dd className="decde-datalist--definition">{definition}</dd>
          </div>
        </Fragment>
      ))}
    </dl>
  );
};

export { DecDeDescriptionList };
