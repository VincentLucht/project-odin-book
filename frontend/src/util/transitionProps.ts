const transitionPropsHeight = {
  unmount: true,
  enter: 'transition-all duration-200',
  enterFrom: 'opacity-0 max-h-0 overflow-hidden',
  enterTo: 'opacity-100 max-h-[300px]',
  leave: 'transition-all duration-200',
  leaveFrom: 'opacity-100 max-h-[300px]',
  leaveTo: 'opacity-0 max-h-0',
};

export const transitionPropsOpacity = {
  enter: 'transition-opacity duration-300',
  enterFrom: 'opacity-0',
  enterTo: 'opacity-100',
  leave: 'transition-opacity duration-300',
  leaveFrom: 'opacity-100',
  leaveTo: 'opacity-0',
};

export default transitionPropsHeight;
