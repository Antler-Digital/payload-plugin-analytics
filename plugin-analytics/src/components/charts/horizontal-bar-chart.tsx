"use client";

import React, { useState } from "react";
import Image from "next/image";

function HorizontalBar({
  item,
  maxViews,
}: {
  maxViews: number;
  item: {
    count: number;
    label: string;
    domain: string;
  };
}) {
  const [src, setSrc] = useState(`${item.domain}/favicon.ico`);

  let label = item.label?.replace("https://", "");
  if (label.endsWith("/")) {
    label = label.slice(0, -1);
  }
  if (label?.includes("?")) {
    label = label.split("?")[0];
  }

  const icon = (
    <Image
      src={src}
      alt={""}
      width={16}
      height={16}
      onError={(e) => {
        setSrc("https://img.icons8.com/material-rounded/24/globe--v1.png");
      }}
      className="tw-text-black dark:tw-text-white"
    />
  );

  const link = (
    <a
      href={item.domain}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:tw-underline tw-z-50"
    >
      {label}
    </a>
  );

  return (
    <div className="tw-flex tw-items-center tw-w-full tw-h-14 tw-relative">
      <div
        className="tw-absolute tw-bg-chart-referrers tw-left-0 tw-top-0 tw-h-full tw-rounded-lg"
        style={{
          width: `${(item.count / maxViews) * 100}%`,
        }}
      />
      <div className="tw-absolute tw-left-2 tw-w-full tw-flex tw-items-center tw-gap-x-2">
        {/* icon */}
        <div className="tw-w-4 tw-h-4">{icon}</div>
        {/* label */}
        <div className="tw-truncate tw-w-2/3 tw-z-40">{link}</div>
      </div>
      <div className="tw-absolute tw-right-2 tw-w-full tw-flex tw-justify-end">
        {/* value */}
        <div>{item.count}</div>
      </div>
    </div>
  );
}

const HorizontalBarChart = ({
  data,
}: {
  data: { count: number; label: string; domain: string }[];
}) => {
  const maxViews = Math.max(...data.map((item) => item.count));

  let content = null;

  if (data?.length > 0) {
    content = data.map((item, index) => {
      return <HorizontalBar key={index} item={item} maxViews={maxViews} />;
    });
  } else {
    content = (
      <div className="tw-text-center tw-text-xl tw-h-[489px] tw-flex tw-items-center tw-justify-center">
        No results
      </div>
    );
  }

  return (
    <div className="tw-rounded-lg tw-text-white">
      <div className="tw-space-y-4">{content}</div>
    </div>
  );
};

export default HorizontalBarChart;
