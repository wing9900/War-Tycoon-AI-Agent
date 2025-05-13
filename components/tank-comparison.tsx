"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

interface TankStat {
  name: string
  value: number
  maxValue: number
}

interface TankData {
  name: string
  image: string
  tier: number
  stats: {
    firepower: TankStat
    armor: TankStat
    mobility: TankStat
    range: TankStat
  }
  description: string
}

interface TankComparisonProps {
  tanks: TankData[]
}

export function TankComparison({ tanks }: TankComparisonProps) {
  const [activeTab, setActiveTab] = useState<string>("stats")

  if (!tanks || tanks.length === 0) {
    return null
  }

  return (
    <Card className="w-full border-zinc-700 bg-zinc-800 text-white">
      <CardHeader>
        <CardTitle className="text-amber-400">Tank Comparison</CardTitle>
        <TabsList className="bg-zinc-900">
          <TabsTrigger value="stats" onClick={() => setActiveTab("stats")}>
            Stats
          </TabsTrigger>
          <TabsTrigger value="description" onClick={() => setActiveTab("description")}>
            Description
          </TabsTrigger>
        </TabsList>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="stats" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tanks.map((tank) => (
                <div key={tank.name} className="border border-zinc-700 rounded-lg p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-zinc-900 rounded-md flex items-center justify-center text-amber-400 font-bold">
                      T{tank.tier}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{tank.name}</h3>
                      <p className="text-sm text-zinc-400">Tier {tank.tier}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Firepower</span>
                        <span className="text-sm text-amber-400">
                          {tank.stats.firepower.value}/{tank.stats.firepower.maxValue}
                        </span>
                      </div>
                      <Progress
                        value={(tank.stats.firepower.value / tank.stats.firepower.maxValue) * 100}
                        className="h-2 bg-zinc-700"
                        indicatorClassName="bg-amber-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Armor</span>
                        <span className="text-sm text-amber-400">
                          {tank.stats.armor.value}/{tank.stats.armor.maxValue}
                        </span>
                      </div>
                      <Progress
                        value={(tank.stats.armor.value / tank.stats.armor.maxValue) * 100}
                        className="h-2 bg-zinc-700"
                        indicatorClassName="bg-amber-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Mobility</span>
                        <span className="text-sm text-amber-400">
                          {tank.stats.mobility.value}/{tank.stats.mobility.maxValue}
                        </span>
                      </div>
                      <Progress
                        value={(tank.stats.mobility.value / tank.stats.mobility.maxValue) * 100}
                        className="h-2 bg-zinc-700"
                        indicatorClassName="bg-amber-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Range</span>
                        <span className="text-sm text-amber-400">
                          {tank.stats.range.value}/{tank.stats.range.maxValue}
                        </span>
                      </div>
                      <Progress
                        value={(tank.stats.range.value / tank.stats.range.maxValue) * 100}
                        className="h-2 bg-zinc-700"
                        indicatorClassName="bg-amber-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="description" className="mt-0">
            <div className="space-y-4">
              {tanks.map((tank) => (
                <div key={tank.name} className="border border-zinc-700 rounded-lg p-4">
                  <h3 className="font-bold text-lg text-amber-400 mb-2">{tank.name}</h3>
                  <p className="text-zinc-300">{tank.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
