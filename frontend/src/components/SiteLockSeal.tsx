'use client';

export default function SiteLockSeal() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.open(
      'https://www.sitelock.com/verify.php?site=next24.xyz',
      'SiteLock',
      'width=600,height=600,left=160,top=170'
    );
  };

  return (
    <a
      href="https://www.sitelock.com/verify.php?site=next24.xyz"
      onClick={handleClick}
      aria-label="View SiteLock verification"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block"
    >
      <img
        src="https://shield.sitelock.com/shield/next24.xyz"
        alt="SiteLock security seal for next24.xyz"
        title="SiteLock"
        className="h-8 w-auto"
        loading="lazy"
      />
    </a>
  );
}
