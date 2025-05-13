import type React from "react"
import { TankComparison } from "@/components/tank-comparison"
import { StrategyGuide } from "@/components/strategy-guide"

// Define regex patterns to detect special content
const TANK_COMPARISON_PATTERN = /\[TANK_COMPARISON\]([\s\S]*?)\[\/TANK_COMPARISON\]/g
const STRATEGY_GUIDE_PATTERN = /\[STRATEGY_GUIDE\]([\s\S]*?)\[\/STRATEGY_GUIDE\]/g

export function parseMessage(content: string): React.ReactNode {
  if (!content) return null

  // Check if the message contains special content
  const hasTankComparison = TANK_COMPARISON_PATTERN.test(content)
  const hasStrategyGuide = STRATEGY_GUIDE_PATTERN.test(content)

  // Reset regex lastIndex
  TANK_COMPARISON_PATTERN.lastIndex = 0
  STRATEGY_GUIDE_PATTERN.lastIndex = 0

  if (!hasTankComparison && !hasStrategyGuide) {
    // Return regular content if no special patterns
    return content
  }

  // Parse the content and replace special patterns with components
  const parts: React.ReactNode[] = []
  let lastIndex = 0

  // Handle tank comparisons
  let match
  while ((match = TANK_COMPARISON_PATTERN.exec(content)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index))
    }

    try {
      // Parse the tank data
      const tankData = JSON.parse(match[1])
      parts.push(<TankComparison key={`tank-${match.index}`} tanks={tankData} />)
    } catch (e) {
      // If parsing fails, just add the original text
      parts.push(match[0])
    }

    lastIndex = match.index + match[0].length
  }

  // Reset regex lastIndex
  TANK_COMPARISON_PATTERN.lastIndex = 0

  // Handle strategy guides
  while ((match = STRATEGY_GUIDE_PATTERN.exec(content)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index))
    }

    try {
      // Parse the strategy guide data
      const guideData = JSON.parse(match[1])
      parts.push(
        <StrategyGuide
          key={`guide-${match.index}`}
          title={guideData.title}
          description={guideData.description}
          difficulty={guideData.difficulty}
          steps={guideData.steps}
        />,
      )
    } catch (e) {
      // If parsing fails, just add the original text
      parts.push(match[0])
    }

    lastIndex = match.index + match[0].length
  }

  // Add any remaining text
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex))
  }

  return <>{parts}</>
}
