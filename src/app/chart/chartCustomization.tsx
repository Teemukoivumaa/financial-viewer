import { Text } from "recharts";

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#353535] p-3 shadow text-white">
        <span>{label}</span>
        <br />
        {payload.map(
          (
            ele: {
              name: any;
              value: any;
            },
            index: React.Key | null | undefined
          ) => (
            <>
              <small
                key={index}
                className="text-xs sm:text-sm font-medium text-white"
              >
                {ele.name}: {ele.value}
              </small>
              <br />
            </>
          )
        )}
      </div>
    );
  }
  return null;
};

export const formatAxis = (tickObject: any) => {
  const {
    payload: { value },
  } = tickObject;

  tickObject["fill"] = "#857F74";
  // localStorage.getItem("theme") === "light" ? "#000" : "#fff";

  return <Text {...tickObject}>{value}</Text>;
};
