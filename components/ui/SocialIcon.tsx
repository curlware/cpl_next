import React from 'react'
import * as FaIcons from 'react-icons/fa'
import * as FiIcons from 'react-icons/fi'
import * as SiIcons from 'react-icons/si'

interface SocialIconProps {
  network: string
  className?: string
  size?: number
}

const SocialIcon: React.FC<SocialIconProps> = ({ network, className = '', size = 24 }) => {
  // Convert network name to lowercase and trim spaces
  const normalizedNetwork = network.toLowerCase().trim()

  // Map of social media names to their corresponding icons
  const iconMap: Record<string, React.ReactElement> = {
    // Font Awesome brand icons
    facebook: <FaIcons.FaFacebook size={size} />,
    twitter: <FaIcons.FaTwitter size={size} />,
    x: <FaIcons.FaTwitter size={size} />, // Twitter rebranded to X
    instagram: <FaIcons.FaInstagram size={size} />,
    linkedin: <FaIcons.FaLinkedin size={size} />,
    youtube: <FaIcons.FaYoutube size={size} />,
    pinterest: <FaIcons.FaPinterest size={size} />,
    tiktok: <FaIcons.FaTiktok size={size} />,
    snapchat: <FaIcons.FaSnapchat size={size} />,
    behance: <FaIcons.FaBehance size={size} />,
    dribbble: <FaIcons.FaDribbble size={size} />,
    github: <FaIcons.FaGithub size={size} />,
    gitlab: <FaIcons.FaGitlab size={size} />,
    medium: <FaIcons.FaMedium size={size} />,
    reddit: <FaIcons.FaReddit size={size} />,
    slack: <FaIcons.FaSlack size={size} />,
    twitch: <FaIcons.FaTwitch size={size} />,
    whatsapp: <FaIcons.FaWhatsapp size={size} />,
    telegram: <FaIcons.FaTelegram size={size} />,
    discord: <FaIcons.FaDiscord size={size} />,
    vimeo: <FaIcons.FaVimeo size={size} />,

    // Additional Simple Icons for less common platforms
    threads: <SiIcons.SiThreads size={size} />,
    mastodon: <SiIcons.SiMastodon size={size} />,

    // Default icon for any unrecognized network
    default: <FiIcons.FiLink size={size} />
  }

  // Return the icon if it exists in our map, otherwise return the default icon
  return (
    <span className={`social-icon ${className}`} aria-label={`${network} icon`}>
      {iconMap[normalizedNetwork] || iconMap.default}
    </span>
  )
}

export default SocialIcon
