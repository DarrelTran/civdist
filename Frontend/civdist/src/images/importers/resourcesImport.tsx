import aluminum from '../resources/aluminum.png'
import iron from '../resources/iron.png'
import horses from '../resources/horses.png'
import uranium from '../resources/uranium.png'
import oil from '../resources/oil.png'
import niter from '../resources/niter.png'
import coal from '../resources/coal.png'

import bananas from '../resources/bananas.png'
import cattle from '../resources/cattle.png'
import copper from '../resources/copper.png'
import crab from '../resources/crab.png'
import deer from '../resources/deer.png'
import fish from '../resources/fish.png'
import rice from '../resources/rice.png'
import sheep from '../resources/sheep.png'
import stone from '../resources/stone.png'
import wheat from '../resources/wheat.png'

import citrus from '../resources/citrus.png'
import cocoa from '../resources/cocoa.png'
import coffee from '../resources/coffee.png'
import cotton from '../resources/cotton.png'
import diamond from '../resources/diamond.png'
import dyes from '../resources/dyes.png'
import furs from '../resources/furs.png'
import gypsum from '../resources/gypsum.png'
import incense from '../resources/incense.png'
import ivory from '../resources/ivory.png'
import jade from '../resources/jade.png'
import marble from '../resources/marble.png'
import mercury from '../resources/mercury.png'
import pearls from '../resources/pearls.png'
import salt from '../resources/salt.png'
import silk from '../resources/silk.png'
import silver from '../resources/silver.png'
import spices from '../resources/spices.png'
import sugar from '../resources/sugar.png'
import tea from '../resources/tea.png'
import truffles from '../resources/truffles.png'
import tobacco from '../resources/tobacco.png'
import whales from '../resources/whales.png'
import wine from '../resources/wine.png'
import jeans from '../resources/jeans.png'
import perfume from '../resources/perfume.png'
import cosmetics from '../resources/cosmetics.png'
import toys from '../resources/toys.png'
import cinnamon from '../resources/cinnamon.png'
import cloves from '../resources/cloves.png'

import antiquity_site from '../resources/antiquity_site.png'
import shipwreck from '../resources/shipwreck.png' 

import { TileArtifactResources, TileBonusResources, TileLuxuryResources, TileStrategicResources } from '../../types/types'

export const allResourceImages: Record<TileBonusResources | TileLuxuryResources | TileStrategicResources | TileArtifactResources, string> = 
{
  [TileStrategicResources.ALUMINUM]: aluminum,
  [TileStrategicResources.IRON]: iron,
  [TileStrategicResources.HORSES]: horses,
  [TileStrategicResources.URANIUM]: uranium,
  [TileStrategicResources.OIL]: oil,
  [TileStrategicResources.NITER]: niter,
  [TileStrategicResources.COAL]: coal,

  [TileBonusResources.BANANAS]: bananas,
  [TileBonusResources.CATTLE]: cattle,
  [TileBonusResources.COPPER]: copper,
  [TileBonusResources.CRABS]: crab,
  [TileBonusResources.DEER]: deer,
  [TileBonusResources.FISH]: fish,
  [TileBonusResources.RICE]: rice,
  [TileBonusResources.SHEEP]: sheep,
  [TileBonusResources.STONE]: stone,
  [TileBonusResources.WHEAT]: wheat,

  [TileLuxuryResources.CITRUS]: citrus,
  [TileLuxuryResources.COCOA]: cocoa,
  [TileLuxuryResources.COFFEE]: coffee,
  [TileLuxuryResources.COTTON]: cotton,
  [TileLuxuryResources.DIAMONDS]: diamond,
  [TileLuxuryResources.DYES]: dyes,
  [TileLuxuryResources.FURS]: furs,
  [TileLuxuryResources.GYPSUM]: gypsum,
  [TileLuxuryResources.INCENSE]: incense,
  [TileLuxuryResources.JADE]: jade,
  [TileLuxuryResources.MARBLE]: marble,
  [TileLuxuryResources.IVORY]: ivory,
  [TileLuxuryResources.MERCURY]: mercury,
  [TileLuxuryResources.PEARLS]: pearls,
  [TileLuxuryResources.SALT]: salt,
  [TileLuxuryResources.SILVER]: silver,
  [TileLuxuryResources.SILK]: silk,
  [TileLuxuryResources.SPICES]: spices,
  [TileLuxuryResources.SUGAR]: sugar,
  [TileLuxuryResources.TEA]: tea,
  [TileLuxuryResources.TRUFFLES]: truffles,
  [TileLuxuryResources.TOBACCO]: tobacco,
  [TileLuxuryResources.WHALES]: whales,
  [TileLuxuryResources.WINE]: wine,
  [TileLuxuryResources.JEANS]: jeans,
  [TileLuxuryResources.PERFUME]: perfume,
  [TileLuxuryResources.COSMETICS]: cosmetics,
  [TileLuxuryResources.TOYS]: toys,
  [TileLuxuryResources.CINNAMON]: cinnamon,
  [TileLuxuryResources.CLOVES]: cloves,

  [TileArtifactResources.ANTIQUITY_SITE]: antiquity_site,
  [TileArtifactResources.SHIPWRECK]: shipwreck
};