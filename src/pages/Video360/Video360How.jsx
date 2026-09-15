import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faDownLong,
  faStairs,
  faBellSlash,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

/* FontAwesome icon wrappers (accept className via props) */
const makeIcon = (icon) => (props) => <FontAwesomeIcon icon={icon} {...props} />;

const IconSearch = makeIcon(faMagnifyingGlass);
const IconEnter = makeIcon(faDownLong);
const IconWalk = makeIcon(faStairs);
const IconKnow = makeIcon(faBellSlash);
const IconChevronRight = makeIcon(faChevronRight);

const steps = [
  {
    icon: IconSearch,
    title: "Find It",
    description:
      "Search the spaces that pull you in. Homes, hotels, rooms. The place is already there.",
  },
  {
    icon: IconEnter,
    title: "Enter It",
    description:
      "Click once and you are inside. No download. No waiting. The room surrounds you.",
  },
  {
    icon: IconWalk,
    title: "Walk It",
    description:
      "Move through the space at your own pace. The floor holds true under your feet.",
  },
  {
    icon: IconKnow,
    title: "Know It",
    description: "You have stood in the room. You have seen the light. You know the truth now.",
  },
];

function Video360How() {
  return (
    <section className="w-full bg-base-100 text-base-content px-2 lg:px-10 py-4 sm:py-6 lg:py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: label, heading, CTA */}
        <div className="flex flex-col justify-start">
          <span className="font-heading text-xs font-bold tracking-[0.2em] text-[var(--app-text-secondary)] uppercase">
            Process
          </span>
          <h2 className="mt-3 font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold leading-[1.05] tracking-tight max-w-md">
            The Door Opens Before You Arrive
          </h2>

          <div className="mt-8 flex items-center gap-6">
            {/* TODO: swap in your <Button /> component here, same as Featured.jsx / HowItWorks.jsx */}
            <button
              type="button"
              className="btn rounded-full bg-base-content text-base-100 border-none px-8 font-heading text-sm font-semibold hover:opacity-90"
            >
              Start
            </button>
            <a
              href="#"
              className="inline-flex items-center gap-1 font-heading text-sm font-semibold text-base-content hover:opacity-70 transition-opacity"
            >
              Explore
              <IconChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Right: vertical timeline */}
        <div>
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isLast = i === steps.length - 1;
            return (
              <div key={step.title} className="flex gap-5 sm:gap-6">
                {/* Icon + connecting line */}
                <div className="flex flex-col items-center">
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-base-content shrink-0" />
                  {!isLast && (
                    <div className="w-px flex-1 min-h-[2.5rem] bg-[var(--app-border)]/30 mt-2" />
                  )}
                </div>

                {/* Text content */}
                <div className={isLast ? "pb-0" : "pb-8 sm:pb-10"}>
                  <h3 className="font-heading text-base sm:text-lg font-bold tracking-tight mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--app-text-secondary)] leading-relaxed max-w-md">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Video360How;