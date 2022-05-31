import React, { Profiler } from 'react';

interface withProfilerProps {
  id?: string;
}

const withProfiler =
  <P extends object>(
    Component: React.ComponentType<P>
  ): React.FC<P & withProfilerProps> =>
  // eslint-disable-next-line react/display-name
  (props: withProfilerProps) => {
    const handleOnRender = (
      id: string,
      phase: string,
      actualDuration: number,
      baseDuration: number,
      startTime: number,
      commitTime: number,
      interactions: unknown
    ) => {
      console.log('Profiler', {
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
      });
    };

    return (
      <Profiler
        id={
          Component.displayName ||
          Component.name ||
          'component-with-profiler-unknown'
        }
        onRender={handleOnRender}
      >
        <Component {...(props as P)} />
      </Profiler>
    );
  };

export default withProfiler;
