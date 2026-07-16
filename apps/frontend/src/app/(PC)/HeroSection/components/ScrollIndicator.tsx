export default function ScrollIndicator() {
  return (
    <>
      <style>{`@keyframes drift{0%,100%{transform:translate(-50%,0)}50%{transform:translate(-50%,-0.5rem)}}`}</style>
      <svg
        className="absolute bottom-8 left-1/2 z-20 pointer-events-none"
        style={{ animation: 'drift 1.5s ease-in-out infinite' }}
        width="20"
        height="20"
        viewBox="0 0 20 20"
      >
        <polygon points="10,18 0,2 20,2" fill="white" />
      </svg>
    </>
  );
}
