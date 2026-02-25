// AUTO-GENERATED
/// <reference no-default-lib="true"/>
declare module "godot" {
    namespace BaseMaterial3D {
        enum TextureParam {
            /** Texture specifying per-pixel color. */
            TEXTURE_ALBEDO = 0,
            
            /** Texture specifying per-pixel metallic value. */
            TEXTURE_METALLIC = 1,
            
            /** Texture specifying per-pixel roughness value. */
            TEXTURE_ROUGHNESS = 2,
            
            /** Texture specifying per-pixel emission color. */
            TEXTURE_EMISSION = 3,
            
            /** Texture specifying per-pixel normal vector. */
            TEXTURE_NORMAL = 4,
            
            /** Texture specifying per-pixel rim value. */
            TEXTURE_RIM = 5,
            
            /** Texture specifying per-pixel clearcoat value. */
            TEXTURE_CLEARCOAT = 6,
            
            /** Texture specifying per-pixel flowmap direction for use with [member anisotropy]. */
            TEXTURE_FLOWMAP = 7,
            
            /** Texture specifying per-pixel ambient occlusion value. */
            TEXTURE_AMBIENT_OCCLUSION = 8,
            
            /** Texture specifying per-pixel height. */
            TEXTURE_HEIGHTMAP = 9,
            
            /** Texture specifying per-pixel subsurface scattering. */
            TEXTURE_SUBSURFACE_SCATTERING = 10,
            
            /** Texture specifying per-pixel transmittance for subsurface scattering. */
            TEXTURE_SUBSURFACE_TRANSMITTANCE = 11,
            
            /** Texture specifying per-pixel backlight color. */
            TEXTURE_BACKLIGHT = 12,
            
            /** Texture specifying per-pixel refraction strength. */
            TEXTURE_REFRACTION = 13,
            
            /** Texture specifying per-pixel detail mask blending value. */
            TEXTURE_DETAIL_MASK = 14,
            
            /** Texture specifying per-pixel detail color. */
            TEXTURE_DETAIL_ALBEDO = 15,
            
            /** Texture specifying per-pixel detail normal. */
            TEXTURE_DETAIL_NORMAL = 16,
            
            /** Texture holding ambient occlusion, roughness, and metallic. */
            TEXTURE_ORM = 17,
            
            /** Represents the size of the [enum TextureParam] enum. */
            TEXTURE_MAX = 18,
        }
        enum TextureFilter {
            /** The texture filter reads from the nearest pixel only. This makes the texture look pixelated from up close, and grainy from a distance (due to mipmaps not being sampled). */
            TEXTURE_FILTER_NEAREST = 0,
            
            /** The texture filter blends between the nearest 4 pixels. This makes the texture look smooth from up close, and grainy from a distance (due to mipmaps not being sampled). */
            TEXTURE_FILTER_LINEAR = 1,
            
            /** The texture filter reads from the nearest pixel and blends between the nearest 2 mipmaps (or uses the nearest mipmap if [member ProjectSettings.rendering/textures/default_filters/use_nearest_mipmap_filter] is `true`). This makes the texture look pixelated from up close, and smooth from a distance. */
            TEXTURE_FILTER_NEAREST_WITH_MIPMAPS = 2,
            
            /** The texture filter blends between the nearest 4 pixels and between the nearest 2 mipmaps (or uses the nearest mipmap if [member ProjectSettings.rendering/textures/default_filters/use_nearest_mipmap_filter] is `true`). This makes the texture look smooth from up close, and smooth from a distance. */
            TEXTURE_FILTER_LINEAR_WITH_MIPMAPS = 3,
            
            /** The texture filter reads from the nearest pixel and blends between 2 mipmaps (or uses the nearest mipmap if [member ProjectSettings.rendering/textures/default_filters/use_nearest_mipmap_filter] is `true`) based on the angle between the surface and the camera view. This makes the texture look pixelated from up close, and smooth from a distance. Anisotropic filtering improves texture quality on surfaces that are almost in line with the camera, but is slightly slower. The anisotropic filtering level can be changed by adjusting [member ProjectSettings.rendering/textures/default_filters/anisotropic_filtering_level]. */
            TEXTURE_FILTER_NEAREST_WITH_MIPMAPS_ANISOTROPIC = 4,
            
            /** The texture filter blends between the nearest 4 pixels and blends between 2 mipmaps (or uses the nearest mipmap if [member ProjectSettings.rendering/textures/default_filters/use_nearest_mipmap_filter] is `true`) based on the angle between the surface and the camera view. This makes the texture look smooth from up close, and smooth from a distance. Anisotropic filtering improves texture quality on surfaces that are almost in line with the camera, but is slightly slower. The anisotropic filtering level can be changed by adjusting [member ProjectSettings.rendering/textures/default_filters/anisotropic_filtering_level]. */
            TEXTURE_FILTER_LINEAR_WITH_MIPMAPS_ANISOTROPIC = 5,
            
            /** Represents the size of the [enum TextureFilter] enum. */
            TEXTURE_FILTER_MAX = 6,
        }
        enum DetailUV {
            /** Use `UV` with the detail texture. */
            DETAIL_UV_1 = 0,
            
            /** Use `UV2` with the detail texture. */
            DETAIL_UV_2 = 1,
        }
        enum Transparency {
            /** The material will not use transparency. This is the fastest to render. */
            TRANSPARENCY_DISABLED = 0,
            
            /** The material will use the texture's alpha values for transparency. This is the slowest to render, and disables shadow casting. */
            TRANSPARENCY_ALPHA = 1,
            
            /** The material will cut off all values below a threshold, the rest will remain opaque. The opaque portions will be rendered in the depth prepass. This is faster to render than alpha blending, but slower than opaque rendering. This also supports casting shadows. */
            TRANSPARENCY_ALPHA_SCISSOR = 2,
            
            /** The material will cut off all values below a spatially-deterministic threshold, the rest will remain opaque. This is faster to render than alpha blending, but slower than opaque rendering. This also supports casting shadows. Alpha hashing is suited for hair rendering. */
            TRANSPARENCY_ALPHA_HASH = 3,
            
            /** The material will use the texture's alpha value for transparency, but will discard fragments with an alpha of less than 0.99 during the depth prepass and fragments with an alpha less than 0.1 during the shadow pass. This also supports casting shadows. */
            TRANSPARENCY_ALPHA_DEPTH_PRE_PASS = 4,
            
            /** Represents the size of the [enum Transparency] enum. */
            TRANSPARENCY_MAX = 5,
        }
        enum ShadingMode {
            /** The object will not receive shadows. This is the fastest to render, but it disables all interactions with lights. */
            SHADING_MODE_UNSHADED = 0,
            
            /** The object will be shaded per pixel. Useful for realistic shading effects. */
            SHADING_MODE_PER_PIXEL = 1,
            
            /** The object will be shaded per vertex. Useful when you want cheaper shaders and do not care about visual quality. */
            SHADING_MODE_PER_VERTEX = 2,
            
            /** Represents the size of the [enum ShadingMode] enum. */
            SHADING_MODE_MAX = 3,
        }
        enum Feature {
            /** Constant for setting [member emission_enabled]. */
            FEATURE_EMISSION = 0,
            
            /** Constant for setting [member normal_enabled]. */
            FEATURE_NORMAL_MAPPING = 1,
            
            /** Constant for setting [member rim_enabled]. */
            FEATURE_RIM = 2,
            
            /** Constant for setting [member clearcoat_enabled]. */
            FEATURE_CLEARCOAT = 3,
            
            /** Constant for setting [member anisotropy_enabled]. */
            FEATURE_ANISOTROPY = 4,
            
            /** Constant for setting [member ao_enabled]. */
            FEATURE_AMBIENT_OCCLUSION = 5,
            
            /** Constant for setting [member heightmap_enabled]. */
            FEATURE_HEIGHT_MAPPING = 6,
            
            /** Constant for setting [member subsurf_scatter_enabled]. */
            FEATURE_SUBSURFACE_SCATTERING = 7,
            
            /** Constant for setting [member subsurf_scatter_transmittance_enabled]. */
            FEATURE_SUBSURFACE_TRANSMITTANCE = 8,
            
            /** Constant for setting [member backlight_enabled]. */
            FEATURE_BACKLIGHT = 9,
            
            /** Constant for setting [member refraction_enabled]. */
            FEATURE_REFRACTION = 10,
            
            /** Constant for setting [member detail_enabled]. */
            FEATURE_DETAIL = 11,
            
            /** Represents the size of the [enum Feature] enum. */
            FEATURE_MAX = 12,
        }
        enum BlendMode {
            /** Default blend mode. The color of the object is blended over the background based on the object's alpha value. */
            BLEND_MODE_MIX = 0,
            
            /** The color of the object is added to the background. */
            BLEND_MODE_ADD = 1,
            
            /** The color of the object is subtracted from the background. */
            BLEND_MODE_SUB = 2,
            
            /** The color of the object is multiplied by the background. */
            BLEND_MODE_MUL = 3,
            
            /** The color of the object is added to the background and the alpha channel is used to mask out the background. This is effectively a hybrid of the blend mix and add modes, useful for effects like fire where you want the flame to add but the smoke to mix. By default, this works with unshaded materials using premultiplied textures. For shaded materials, use the `PREMUL_ALPHA_FACTOR` built-in so that lighting can be modulated as well. */
            BLEND_MODE_PREMULT_ALPHA = 4,
        }
        enum AlphaAntiAliasing {
            /** Disables Alpha AntiAliasing for the material. */
            ALPHA_ANTIALIASING_OFF = 0,
            
            /** Enables AlphaToCoverage. Alpha values in the material are passed to the AntiAliasing sample mask. */
            ALPHA_ANTIALIASING_ALPHA_TO_COVERAGE = 1,
            
            /** Enables AlphaToCoverage and forces all non-zero alpha values to `1`. Alpha values in the material are passed to the AntiAliasing sample mask. */
            ALPHA_ANTIALIASING_ALPHA_TO_COVERAGE_AND_TO_ONE = 2,
        }
        enum DepthDrawMode {
            /** Default depth draw mode. Depth is drawn only for opaque objects during the opaque prepass (if any) and during the opaque pass. */
            DEPTH_DRAW_OPAQUE_ONLY = 0,
            
            /** Objects will write to depth during the opaque and the transparent passes. Transparent objects that are close to the camera may obscure other transparent objects behind them.  
             *      
             *  **Note:** This does not influence whether transparent objects are included in the depth prepass or not. For that, see [enum Transparency].  
             */
            DEPTH_DRAW_ALWAYS = 1,
            
            /** Objects will not write their depth to the depth buffer, even during the depth prepass (if enabled). */
            DEPTH_DRAW_DISABLED = 2,
        }
        enum CullMode {
            /** Default cull mode. The back of the object is culled when not visible. Back face triangles will be culled when facing the camera. This results in only the front side of triangles being drawn. For closed-surface meshes, this means that only the exterior of the mesh will be visible. */
            CULL_BACK = 0,
            
            /** Front face triangles will be culled when facing the camera. This results in only the back side of triangles being drawn. For closed-surface meshes, this means that the interior of the mesh will be drawn instead of the exterior. */
            CULL_FRONT = 1,
            
            /** No face culling is performed; both the front face and back face will be visible. */
            CULL_DISABLED = 2,
        }
        enum Flags {
            /** Disables the depth test, so this object is drawn on top of all others drawn before it. This puts the object in the transparent draw pass where it is sorted based on distance to camera. Objects drawn after it in the draw order may cover it. This also disables writing to depth. */
            FLAG_DISABLE_DEPTH_TEST = 0,
            
            /** Set `ALBEDO` to the per-vertex color specified in the mesh. */
            FLAG_ALBEDO_FROM_VERTEX_COLOR = 1,
            
            /** Vertex colors are considered to be stored in sRGB color space and are converted to linear color space during rendering. See also [member vertex_color_is_srgb].  
             *      
             *  **Note:** Only effective when using the Forward+ and Mobile rendering methods.  
             */
            FLAG_SRGB_VERTEX_COLOR = 2,
            
            /** Uses point size to alter the size of primitive points. Also changes the albedo texture lookup to use `POINT_COORD` instead of `UV`. */
            FLAG_USE_POINT_SIZE = 3,
            
            /** Object is scaled by depth so that it always appears the same size on screen. */
            FLAG_FIXED_SIZE = 4,
            
            /** Shader will keep the scale set for the mesh. Otherwise the scale is lost when billboarding. Only applies when [member billboard_mode] is [constant BILLBOARD_ENABLED]. */
            FLAG_BILLBOARD_KEEP_SCALE = 5,
            
            /** Use triplanar texture lookup for all texture lookups that would normally use `UV`. */
            FLAG_UV1_USE_TRIPLANAR = 6,
            
            /** Use triplanar texture lookup for all texture lookups that would normally use `UV2`. */
            FLAG_UV2_USE_TRIPLANAR = 7,
            
            /** Use triplanar texture lookup for all texture lookups that would normally use `UV`. */
            FLAG_UV1_USE_WORLD_TRIPLANAR = 8,
            
            /** Use triplanar texture lookup for all texture lookups that would normally use `UV2`. */
            FLAG_UV2_USE_WORLD_TRIPLANAR = 9,
            
            /** Use `UV2` coordinates to look up from the [member ao_texture]. */
            FLAG_AO_ON_UV2 = 10,
            
            /** Use `UV2` coordinates to look up from the [member emission_texture]. */
            FLAG_EMISSION_ON_UV2 = 11,
            
            /** Forces the shader to convert albedo from sRGB space to linear space. See also [member albedo_texture_force_srgb]. */
            FLAG_ALBEDO_TEXTURE_FORCE_SRGB = 12,
            
            /** Disables receiving shadows from other objects. */
            FLAG_DONT_RECEIVE_SHADOWS = 13,
            
            /** Disables receiving ambient light. */
            FLAG_DISABLE_AMBIENT_LIGHT = 14,
            
            /** Enables the shadow to opacity feature. */
            FLAG_USE_SHADOW_TO_OPACITY = 15,
            
            /** Enables the texture to repeat when UV coordinates are outside the 0-1 range. If using one of the linear filtering modes, this can result in artifacts at the edges of a texture when the sampler filters across the edges of the texture. */
            FLAG_USE_TEXTURE_REPEAT = 16,
            
            /** Invert values read from a depth texture to convert them to height values (heightmap). */
            FLAG_INVERT_HEIGHTMAP = 17,
            
            /** Enables the skin mode for subsurface scattering which is used to improve the look of subsurface scattering when used for human skin. */
            FLAG_SUBSURFACE_MODE_SKIN = 18,
            
            /** Enables parts of the shader required for [GPUParticles3D] trails to function. This also requires using a mesh with appropriate skinning, such as [RibbonTrailMesh] or [TubeTrailMesh]. Enabling this feature outside of materials used in [GPUParticles3D] meshes will break material rendering. */
            FLAG_PARTICLE_TRAILS_MODE = 19,
            
            /** Enables multichannel signed distance field rendering shader. */
            FLAG_ALBEDO_TEXTURE_MSDF = 20,
            
            /** Disables receiving depth-based or volumetric fog. */
            FLAG_DISABLE_FOG = 21,
            
            /** Represents the size of the [enum Flags] enum. */
            FLAG_MAX = 22,
        }
        enum DiffuseMode {
            /** Default diffuse scattering algorithm. */
            DIFFUSE_BURLEY = 0,
            
            /** Diffuse scattering ignores roughness. */
            DIFFUSE_LAMBERT = 1,
            
            /** Extends Lambert to cover more than 90 degrees when roughness increases. */
            DIFFUSE_LAMBERT_WRAP = 2,
            
            /** Uses a hard cut for lighting, with smoothing affected by roughness. */
            DIFFUSE_TOON = 3,
        }
        enum SpecularMode {
            /** Default specular blob. */
            SPECULAR_SCHLICK_GGX = 0,
            
            /** Toon blob which changes size based on roughness. */
            SPECULAR_TOON = 1,
            
            /** No specular blob. This is slightly faster to render than other specular modes. */
            SPECULAR_DISABLED = 2,
        }
        enum BillboardMode {
            /** Billboard mode is disabled. */
            BILLBOARD_DISABLED = 0,
            
            /** The object's Z axis will always face the camera. */
            BILLBOARD_ENABLED = 1,
            
            /** The object's X axis will always face the camera. */
            BILLBOARD_FIXED_Y = 2,
            
            /** Used for particle systems when assigned to [GPUParticles3D] and [CPUParticles3D] nodes (flipbook animation). Enables `particles_anim_*` properties.  
             *  The [member ParticleProcessMaterial.anim_speed_min] or [member CPUParticles3D.anim_speed_min] should also be set to a value bigger than zero for the animation to play.  
             */
            BILLBOARD_PARTICLES = 3,
        }
        enum TextureChannel {
            /** Used to read from the red channel of a texture. */
            TEXTURE_CHANNEL_RED = 0,
            
            /** Used to read from the green channel of a texture. */
            TEXTURE_CHANNEL_GREEN = 1,
            
            /** Used to read from the blue channel of a texture. */
            TEXTURE_CHANNEL_BLUE = 2,
            
            /** Used to read from the alpha channel of a texture. */
            TEXTURE_CHANNEL_ALPHA = 3,
            
            /** Used to read from the linear (non-perceptual) average of the red, green and blue channels of a texture. */
            TEXTURE_CHANNEL_GRAYSCALE = 4,
        }
        enum EmissionOperator {
            /** Adds the emission color to the color from the emission texture. */
            EMISSION_OP_ADD = 0,
            
            /** Multiplies the emission color by the color from the emission texture. */
            EMISSION_OP_MULTIPLY = 1,
        }
        enum DistanceFadeMode {
            /** Do not use distance fade. */
            DISTANCE_FADE_DISABLED = 0,
            
            /** Smoothly fades the object out based on each pixel's distance from the camera using the alpha channel. */
            DISTANCE_FADE_PIXEL_ALPHA = 1,
            
            /** Smoothly fades the object out based on each pixel's distance from the camera using a dithering approach. Dithering discards pixels based on a set pattern to smoothly fade without enabling transparency. On certain hardware, this can be faster than [constant DISTANCE_FADE_PIXEL_ALPHA]. */
            DISTANCE_FADE_PIXEL_DITHER = 2,
            
            /** Smoothly fades the object out based on the object's distance from the camera using a dithering approach. Dithering discards pixels based on a set pattern to smoothly fade without enabling transparency. On certain hardware, this can be faster than [constant DISTANCE_FADE_PIXEL_ALPHA] and [constant DISTANCE_FADE_PIXEL_DITHER]. */
            DISTANCE_FADE_OBJECT_DITHER = 3,
        }
    }
    /** Abstract base class for defining the 3D rendering properties of meshes.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_basematerial3d.html  
     */
    class BaseMaterial3D extends Material {
        constructor(identifier?: any)
        /** If `true`, enables the specified flag. Flags are optional behavior that can be turned on and off. Only one flag can be enabled at a time with this function, the flag enumerators cannot be bit-masked together to enable or disable multiple flags at once. Flags can also be enabled by setting the corresponding member to `true`. See [enum Flags] enumerator for options. */
        set_flag(flag: BaseMaterial3D.Flags, enable: boolean): void
        
        /** Returns `true`, if the specified flag is enabled. See [enum Flags] enumerator for options. */
        get_flag(flag: BaseMaterial3D.Flags): boolean
        
        /** If `true`, enables the specified [enum Feature]. Many features that are available in [BaseMaterial3D]s need to be enabled before use. This way the cost for using the feature is only incurred when specified. Features can also be enabled by setting the corresponding member to `true`. */
        set_feature(feature: BaseMaterial3D.Feature, enable: boolean): void
        
        /** Returns `true`, if the specified [enum Feature] is enabled. */
        get_feature(feature: BaseMaterial3D.Feature): boolean
        
        /** Sets the texture for the slot specified by [param param]. See [enum TextureParam] for available slots. */
        set_texture(param: BaseMaterial3D.TextureParam, texture: Texture2D): void
        
        /** Returns the [Texture2D] associated with the specified [enum TextureParam]. */
        get_texture(param: BaseMaterial3D.TextureParam): Texture2D
        
        /** The material's transparency mode. Some transparency modes will disable shadow casting. Any transparency mode other than [constant TRANSPARENCY_DISABLED] has a greater performance impact compared to opaque rendering. See also [member blend_mode]. */
        get transparency(): int64
        set transparency(value: int64)
        
        /** Threshold at which the alpha scissor will discard values. Higher values will result in more pixels being discarded. If the material becomes too opaque at a distance, try increasing [member alpha_scissor_threshold]. If the material disappears at a distance, try decreasing [member alpha_scissor_threshold]. */
        get alpha_scissor_threshold(): float64
        set alpha_scissor_threshold(value: float64)
        
        /** The hashing scale for Alpha Hash. Recommended values between `0` and `2`. */
        get alpha_hash_scale(): float64
        set alpha_hash_scale(value: float64)
        
        /** The type of alpha antialiasing to apply. See [enum AlphaAntiAliasing]. */
        get alpha_antialiasing_mode(): int64
        set alpha_antialiasing_mode(value: int64)
        
        /** Threshold at which antialiasing will be applied on the alpha channel. */
        get alpha_antialiasing_edge(): float64
        set alpha_antialiasing_edge(value: float64)
        
        /** The material's blend mode.  
         *      
         *  **Note:** Values other than `Mix` force the object into the transparent pipeline. See [enum BlendMode].  
         */
        get blend_mode(): int64
        set blend_mode(value: int64)
        
        /** Determines which side of the triangle to cull depending on whether the triangle faces towards or away from the camera. See [enum CullMode]. */
        get cull_mode(): int64
        set cull_mode(value: int64)
        
        /** Determines when depth rendering takes place. See [enum DepthDrawMode]. See also [member transparency]. */
        get depth_draw_mode(): int64
        set depth_draw_mode(value: int64)
        
        /** If `true`, depth testing is disabled and the object will be drawn in render order. */
        get no_depth_test(): boolean
        set no_depth_test(value: boolean)
        
        /** Sets whether the shading takes place, per-pixel, per-vertex or unshaded. Per-vertex lighting is faster, making it the best choice for mobile applications, however it looks considerably worse than per-pixel. Unshaded rendering is the fastest, but disables all interactions with lights. */
        get shading_mode(): int64
        set shading_mode(value: int64)
        
        /** The algorithm used for diffuse light scattering. See [enum DiffuseMode]. */
        get diffuse_mode(): int64
        set diffuse_mode(value: int64)
        
        /** The method for rendering the specular blob. See [enum SpecularMode].  
         *      
         *  **Note:** [member specular_mode] only applies to the specular blob. It does not affect specular reflections from the sky, screen-space reflections, [VoxelGI], SDFGI or [ReflectionProbe]s. To disable reflections from these sources as well, set [member metallic_specular] to `0.0` instead.  
         */
        get specular_mode(): int64
        set specular_mode(value: int64)
        
        /** If `true`, the object receives no ambient light. */
        get disable_ambient_light(): boolean
        set disable_ambient_light(value: boolean)
        
        /** If `true`, the object will not be affected by fog (neither volumetric nor depth fog). This is useful for unshaded or transparent materials (e.g. particles), which without this setting will be affected even if fully transparent. */
        get disable_fog(): boolean
        set disable_fog(value: boolean)
        
        /** If `true`, the vertex color is used as albedo color. */
        get vertex_color_use_as_albedo(): boolean
        set vertex_color_use_as_albedo(value: boolean)
        
        /** If `true`, vertex colors are considered to be stored in sRGB color space and are converted to linear color space during rendering. If `false`, vertex colors are considered to be stored in linear color space and are rendered as-is. See also [member albedo_texture_force_srgb].  
         *      
         *  **Note:** Only effective when using the Forward+ and Mobile rendering methods, not Compatibility.  
         */
        get vertex_color_is_srgb(): boolean
        set vertex_color_is_srgb(value: boolean)
        
        /** The material's base color.  
         *      
         *  **Note:** If [member detail_enabled] is `true` and a [member detail_albedo] texture is specified, [member albedo_color] will  *not*  modulate the detail texture. This can be used to color partial areas of a material by not specifying an albedo texture and using a transparent [member detail_albedo] texture instead.  
         */
        get albedo_color(): Color
        set albedo_color(value: Color)
        
        /** Texture to multiply by [member albedo_color]. Used for basic texturing of objects.  
         *  If the texture appears unexpectedly too dark or too bright, check [member albedo_texture_force_srgb].  
         */
        get albedo_texture(): Texture2D
        set albedo_texture(value: Texture2D)
        
        /** If `true`, forces a conversion of the [member albedo_texture] from sRGB color space to linear color space. See also [member vertex_color_is_srgb].  
         *  This should only be enabled when needed (typically when using a [ViewportTexture] as [member albedo_texture]). If [member albedo_texture_force_srgb] is `true` when it shouldn't be, the texture will appear to be too dark. If [member albedo_texture_force_srgb] is `false` when it shouldn't be, the texture will appear to be too bright.  
         */
        get albedo_texture_force_srgb(): boolean
        set albedo_texture_force_srgb(value: boolean)
        
        /** Enables multichannel signed distance field rendering shader. Use [member msdf_pixel_range] and [member msdf_outline_size] to configure MSDF parameters. */
        get albedo_texture_msdf(): boolean
        set albedo_texture_msdf(value: boolean)
        
        /** The Occlusion/Roughness/Metallic texture to use. This is a more efficient replacement of [member ao_texture], [member roughness_texture] and [member metallic_texture] in [ORMMaterial3D]. Ambient occlusion is stored in the red channel. Roughness map is stored in the green channel. Metallic map is stored in the blue channel. The alpha channel is ignored. */
        get orm_texture(): Texture2D
        set orm_texture(value: Texture2D)
        
        /** A high value makes the material appear more like a metal. Non-metals use their albedo as the diffuse color and add diffuse to the specular reflection. With non-metals, the reflection appears on top of the albedo color. Metals use their albedo as a multiplier to the specular reflection and set the diffuse color to black resulting in a tinted reflection. Materials work better when fully metal or fully non-metal, values between `0` and `1` should only be used for blending between metal and non-metal sections. To alter the amount of reflection use [member roughness]. */
        get metallic(): float64
        set metallic(value: float64)
        
        /** Adjusts the strength of specular reflections. Specular reflections are composed of scene reflections and the specular lobe which is the bright spot that is reflected from light sources. When set to `0.0`, no specular reflections will be visible. This differs from the [constant SPECULAR_DISABLED] [enum SpecularMode] as [constant SPECULAR_DISABLED] only applies to the specular lobe from the light source.  
         *      
         *  **Note:** Unlike [member metallic], this is not energy-conserving, so it should be left at `0.5` in most cases. See also [member roughness].  
         */
        get metallic_specular(): float64
        set metallic_specular(value: float64)
        
        /** Texture used to specify metallic for an object. This is multiplied by [member metallic]. */
        get metallic_texture(): Texture2D
        set metallic_texture(value: Texture2D)
        
        /** Specifies the channel of the [member metallic_texture] in which the metallic information is stored. This is useful when you store the information for multiple effects in a single texture. For example if you stored metallic in the red channel, roughness in the blue, and ambient occlusion in the green you could reduce the number of textures you use. */
        get metallic_texture_channel(): int64
        set metallic_texture_channel(value: int64)
        
        /** Surface reflection. A value of `0` represents a perfect mirror while a value of `1` completely blurs the reflection. See also [member metallic]. */
        get roughness(): float64
        set roughness(value: float64)
        
        /** Texture used to control the roughness per-pixel. Multiplied by [member roughness]. */
        get roughness_texture(): Texture2D
        set roughness_texture(value: Texture2D)
        
        /** Specifies the channel of the [member roughness_texture] in which the roughness information is stored. This is useful when you store the information for multiple effects in a single texture. For example if you stored metallic in the red channel, roughness in the blue, and ambient occlusion in the green you could reduce the number of textures you use. */
        get roughness_texture_channel(): int64
        set roughness_texture_channel(value: int64)
        
        /** If `true`, the body emits light. Emitting light makes the object appear brighter. The object can also cast light on other objects if a [VoxelGI], SDFGI, or [LightmapGI] is used and this object is used in baked lighting. */
        get emission_enabled(): boolean
        set emission_enabled(value: boolean)
        
        /** The emitted light's color. See [member emission_enabled]. */
        get emission(): Color
        set emission(value: Color)
        
        /** Multiplier for emitted light. See [member emission_enabled]. */
        get emission_energy_multiplier(): float64
        set emission_energy_multiplier(value: float64)
        
        /** Luminance of emitted light, measured in nits (candela per square meter). Only available when [member ProjectSettings.rendering/lights_and_shadows/use_physical_light_units] is enabled. The default is roughly equivalent to an indoor lightbulb. */
        get emission_intensity(): float64
        set emission_intensity(value: float64)
        
        /** Sets how [member emission] interacts with [member emission_texture]. Can either add or multiply. See [enum EmissionOperator] for options. */
        get emission_operator(): int64
        set emission_operator(value: int64)
        
        /** Use `UV2` to read from the [member emission_texture]. */
        get emission_on_uv2(): boolean
        set emission_on_uv2(value: boolean)
        
        /** Texture that specifies how much surface emits light at a given point. */
        get emission_texture(): Texture2D
        set emission_texture(value: Texture2D)
        
        /** If `true`, normal mapping is enabled. This has a slight performance cost, especially on mobile GPUs. */
        get normal_enabled(): boolean
        set normal_enabled(value: boolean)
        
        /** The strength of the normal map's effect. */
        get normal_scale(): float64
        set normal_scale(value: float64)
        
        /** Texture used to specify the normal at a given pixel. The [member normal_texture] only uses the red and green channels; the blue and alpha channels are ignored. The normal read from [member normal_texture] is oriented around the surface normal provided by the [Mesh].  
         *      
         *  **Note:** The mesh must have both normals and tangents defined in its vertex data. Otherwise, the normal map won't render correctly and will only appear to darken the whole surface. If creating geometry with [SurfaceTool], you can use [method SurfaceTool.generate_normals] and [method SurfaceTool.generate_tangents] to automatically generate normals and tangents respectively.  
         *      
         *  **Note:** Godot expects the normal map to use X+, Y+, and Z+ coordinates. See [url=http://wiki.polycount.com/wiki/Normal_Map_Technical_Details#Common_Swizzle_Coordinates]this page[/url] for a comparison of normal map coordinates expected by popular engines.  
         *      
         *  **Note:** If [member detail_enabled] is `true`, the [member detail_albedo] texture is drawn  *below*  the [member normal_texture]. To display a normal map  *above*  the [member detail_albedo] texture, use [member detail_normal] instead.  
         */
        get normal_texture(): Texture2D
        set normal_texture(value: Texture2D)
        
        /** If `true`, rim effect is enabled. Rim lighting increases the brightness at glancing angles on an object.  
         *      
         *  **Note:** Rim lighting is not visible if the material's [member shading_mode] is [constant SHADING_MODE_UNSHADED].  
         */
        get rim_enabled(): boolean
        set rim_enabled(value: boolean)
        
        /** Sets the strength of the rim lighting effect. */
        get rim(): float64
        set rim(value: float64)
        
        /** The amount of to blend light and albedo color when rendering rim effect. If `0` the light color is used, while `1` means albedo color is used. An intermediate value generally works best. */
        get rim_tint(): float64
        set rim_tint(value: float64)
        
        /** Texture used to set the strength of the rim lighting effect per-pixel. Multiplied by [member rim]. */
        get rim_texture(): Texture2D
        set rim_texture(value: Texture2D)
        
        /** If `true`, clearcoat rendering is enabled. Adds a secondary transparent pass to the lighting calculation resulting in an added specular blob. This makes materials appear as if they have a clear layer on them that can be either glossy or rough.  
         *      
         *  **Note:** Clearcoat rendering is not visible if the material's [member shading_mode] is [constant SHADING_MODE_UNSHADED].  
         */
        get clearcoat_enabled(): boolean
        set clearcoat_enabled(value: boolean)
        
        /** Sets the strength of the clearcoat effect. Setting to `0` looks the same as disabling the clearcoat effect. */
        get clearcoat(): float64
        set clearcoat(value: float64)
        
        /** Sets the roughness of the clearcoat pass. A higher value results in a rougher clearcoat while a lower value results in a smoother clearcoat. */
        get clearcoat_roughness(): float64
        set clearcoat_roughness(value: float64)
        
        /** Texture that defines the strength of the clearcoat effect and the glossiness of the clearcoat. Strength is specified in the red channel while glossiness is specified in the green channel. */
        get clearcoat_texture(): Texture2D
        set clearcoat_texture(value: Texture2D)
        
        /** If `true`, anisotropy is enabled. Anisotropy changes the shape of the specular blob and aligns it to tangent space. This is useful for brushed aluminum and hair reflections.  
         *      
         *  **Note:** Mesh tangents are needed for anisotropy to work. If the mesh does not contain tangents, the anisotropy effect will appear broken.  
         *      
         *  **Note:** Material anisotropy should not to be confused with anisotropic texture filtering, which can be enabled by setting [member texture_filter] to [constant TEXTURE_FILTER_LINEAR_WITH_MIPMAPS_ANISOTROPIC].  
         */
        get anisotropy_enabled(): boolean
        set anisotropy_enabled(value: boolean)
        
        /** The strength of the anisotropy effect. This is multiplied by [member anisotropy_flowmap]'s alpha channel if a texture is defined there and the texture contains an alpha channel. */
        get anisotropy(): float64
        set anisotropy(value: float64)
        
        /** Texture that offsets the tangent map for anisotropy calculations and optionally controls the anisotropy effect (if an alpha channel is present). The flowmap texture is expected to be a derivative map, with the red channel representing distortion on the X axis and green channel representing distortion on the Y axis. Values below 0.5 will result in negative distortion, whereas values above 0.5 will result in positive distortion.  
         *  If present, the texture's alpha channel will be used to multiply the strength of the [member anisotropy] effect. Fully opaque pixels will keep the anisotropy effect's original strength while fully transparent pixels will disable the anisotropy effect entirely. The flowmap texture's blue channel is ignored.  
         */
        get anisotropy_flowmap(): Texture2D
        set anisotropy_flowmap(value: Texture2D)
        
        /** If `true`, ambient occlusion is enabled. Ambient occlusion darkens areas based on the [member ao_texture]. */
        get ao_enabled(): boolean
        set ao_enabled(value: boolean)
        
        /** Amount that ambient occlusion affects lighting from lights. If `0`, ambient occlusion only affects ambient light. If `1`, ambient occlusion affects lights just as much as it affects ambient light. This can be used to impact the strength of the ambient occlusion effect, but typically looks unrealistic. */
        get ao_light_affect(): float64
        set ao_light_affect(value: float64)
        
        /** Texture that defines the amount of ambient occlusion for a given point on the object. */
        get ao_texture(): Texture2D
        set ao_texture(value: Texture2D)
        
        /** If `true`, use `UV2` coordinates to look up from the [member ao_texture]. */
        get ao_on_uv2(): boolean
        set ao_on_uv2(value: boolean)
        
        /** Specifies the channel of the [member ao_texture] in which the ambient occlusion information is stored. This is useful when you store the information for multiple effects in a single texture. For example if you stored metallic in the red channel, roughness in the blue, and ambient occlusion in the green you could reduce the number of textures you use. */
        get ao_texture_channel(): int64
        set ao_texture_channel(value: int64)
        
        /** If `true`, height mapping is enabled (also called "parallax mapping" or "depth mapping"). See also [member normal_enabled]. Height mapping is a demanding feature on the GPU, so it should only be used on materials where it makes a significant visual difference.  
         *      
         *  **Note:** Height mapping is not supported if triplanar mapping is used on the same material. The value of [member heightmap_enabled] will be ignored if [member uv1_triplanar] is enabled.  
         */
        get heightmap_enabled(): boolean
        set heightmap_enabled(value: boolean)
        
        /** The heightmap scale to use for the parallax effect (see [member heightmap_enabled]). The default value is tuned so that the highest point (value = 255) appears to be 5 cm higher than the lowest point (value = 0). Higher values result in a deeper appearance, but may result in artifacts appearing when looking at the material from oblique angles, especially when the camera moves. Negative values can be used to invert the parallax effect, but this is different from inverting the texture using [member heightmap_flip_texture] as the material will also appear to be "closer" to the camera. In most cases, [member heightmap_scale] should be kept to a positive value.  
         *      
         *  **Note:** If the height map effect looks strange regardless of this value, try adjusting [member heightmap_flip_binormal] and [member heightmap_flip_tangent]. See also [member heightmap_texture] for recommendations on authoring heightmap textures, as the way the heightmap texture is authored affects how [member heightmap_scale] behaves.  
         */
        get heightmap_scale(): float64
        set heightmap_scale(value: float64)
        
        /** If `true`, uses parallax occlusion mapping to represent depth in the material instead of simple offset mapping (see [member heightmap_enabled]). This results in a more convincing depth effect, but is much more expensive on the GPU. Only enable this on materials where it makes a significant visual difference. */
        get heightmap_deep_parallax(): boolean
        set heightmap_deep_parallax(value: boolean)
        
        /** The number of layers to use for parallax occlusion mapping when the camera is far away from the material. Higher values result in a more convincing depth effect, especially in materials that have steep height changes. Higher values have a significant cost on the GPU, so it should only be increased on materials where it makes a significant visual difference.  
         *      
         *  **Note:** Only effective if [member heightmap_deep_parallax] is `true`.  
         */
        get heightmap_min_layers(): int64
        set heightmap_min_layers(value: int64)
        
        /** The number of layers to use for parallax occlusion mapping when the camera is up close to the material. Higher values result in a more convincing depth effect, especially in materials that have steep height changes. Higher values have a significant cost on the GPU, so it should only be increased on materials where it makes a significant visual difference.  
         *      
         *  **Note:** Only effective if [member heightmap_deep_parallax] is `true`.  
         */
        get heightmap_max_layers(): int64
        set heightmap_max_layers(value: int64)
        
        /** If `true`, flips the mesh's tangent vectors when interpreting the height map. If the heightmap effect looks strange when the camera moves (even with a reasonable [member heightmap_scale]), try setting this to `true`. */
        get heightmap_flip_tangent(): boolean
        set heightmap_flip_tangent(value: boolean)
        
        /** If `true`, flips the mesh's binormal vectors when interpreting the height map. If the heightmap effect looks strange when the camera moves (even with a reasonable [member heightmap_scale]), try setting this to `true`. */
        get heightmap_flip_binormal(): boolean
        set heightmap_flip_binormal(value: boolean)
        
        /** The texture to use as a height map. See also [member heightmap_enabled].  
         *  For best results, the texture should be normalized (with [member heightmap_scale] reduced to compensate). In [url=https://gimp.org]GIMP[/url], this can be done using **Colors > Auto > Equalize**. If the texture only uses a small part of its available range, the parallax effect may look strange, especially when the camera moves.  
         *      
         *  **Note:** To reduce memory usage and improve loading times, you may be able to use a lower-resolution heightmap texture as most heightmaps are only comprised of low-frequency data.  
         */
        get heightmap_texture(): Texture2D
        set heightmap_texture(value: Texture2D)
        
        /** If `true`, interprets the height map texture as a depth map, with brighter values appearing to be "lower" in altitude compared to darker values.  
         *  This can be enabled for compatibility with some materials authored for Godot 3.x. This is not necessary if the Invert import option was used to invert the depth map in Godot 3.x, in which case [member heightmap_flip_texture] should remain `false`.  
         */
        get heightmap_flip_texture(): boolean
        set heightmap_flip_texture(value: boolean)
        
        /** If `true`, subsurface scattering is enabled. Emulates light that penetrates an object's surface, is scattered, and then emerges. Subsurface scattering quality is controlled by [member ProjectSettings.rendering/environment/subsurface_scattering/subsurface_scattering_quality]. */
        get subsurf_scatter_enabled(): boolean
        set subsurf_scatter_enabled(value: boolean)
        
        /** The strength of the subsurface scattering effect. The depth of the effect is also controlled by [member ProjectSettings.rendering/environment/subsurface_scattering/subsurface_scattering_scale], which is set globally. */
        get subsurf_scatter_strength(): float64
        set subsurf_scatter_strength(value: float64)
        
        /** If `true`, subsurface scattering will use a special mode optimized for the color and density of human skin, such as boosting the intensity of the red channel in subsurface scattering. */
        get subsurf_scatter_skin_mode(): boolean
        set subsurf_scatter_skin_mode(value: boolean)
        
        /** Texture used to control the subsurface scattering strength. Stored in the red texture channel. Multiplied by [member subsurf_scatter_strength]. */
        get subsurf_scatter_texture(): Texture2D
        set subsurf_scatter_texture(value: Texture2D)
        
        /** If `true`, enables subsurface scattering transmittance. Only effective if [member subsurf_scatter_enabled] is `true`. See also [member backlight_enabled]. */
        get subsurf_scatter_transmittance_enabled(): boolean
        set subsurf_scatter_transmittance_enabled(value: boolean)
        
        /** The color to multiply the subsurface scattering transmittance effect with. Ignored if [member subsurf_scatter_skin_mode] is `true`. */
        get subsurf_scatter_transmittance_color(): Color
        set subsurf_scatter_transmittance_color(value: Color)
        
        /** The texture to use for multiplying the intensity of the subsurface scattering transmittance intensity. See also [member subsurf_scatter_texture]. Ignored if [member subsurf_scatter_skin_mode] is `true`. */
        get subsurf_scatter_transmittance_texture(): Texture2D
        set subsurf_scatter_transmittance_texture(value: Texture2D)
        
        /** The depth of the subsurface scattering transmittance effect. */
        get subsurf_scatter_transmittance_depth(): float64
        set subsurf_scatter_transmittance_depth(value: float64)
        
        /** The intensity of the subsurface scattering transmittance effect. */
        get subsurf_scatter_transmittance_boost(): float64
        set subsurf_scatter_transmittance_boost(value: float64)
        
        /** If `true`, the backlight effect is enabled. See also [member subsurf_scatter_transmittance_enabled]. */
        get backlight_enabled(): boolean
        set backlight_enabled(value: boolean)
        
        /** The color used by the backlight effect. Represents the light passing through an object. */
        get backlight(): Color
        set backlight(value: Color)
        
        /** Texture used to control the backlight effect per-pixel. Added to [member backlight]. */
        get backlight_texture(): Texture2D
        set backlight_texture(value: Texture2D)
        
        /** If `true`, the refraction effect is enabled. Distorts transparency based on light from behind the object.  
         *      
         *  **Note:** Refraction is implemented using the screen texture. Only opaque materials will appear in the refraction, since transparent materials do not appear in the screen texture.  
         */
        get refraction_enabled(): boolean
        set refraction_enabled(value: boolean)
        
        /** The strength of the refraction effect. */
        get refraction_scale(): float64
        set refraction_scale(value: float64)
        
        /** Texture that controls the strength of the refraction per-pixel. Multiplied by [member refraction_scale]. */
        get refraction_texture(): Texture2D
        set refraction_texture(value: Texture2D)
        
        /** Specifies the channel of the [member refraction_texture] in which the refraction information is stored. This is useful when you store the information for multiple effects in a single texture. For example if you stored refraction in the red channel, roughness in the blue, and ambient occlusion in the green you could reduce the number of textures you use. */
        get refraction_texture_channel(): int64
        set refraction_texture_channel(value: int64)
        
        /** If `true`, enables the detail overlay. Detail is a second texture that gets mixed over the surface of the object based on [member detail_mask] and [member detail_albedo]'s alpha channel. This can be used to add variation to objects, or to blend between two different albedo/normal textures. */
        get detail_enabled(): boolean
        set detail_enabled(value: boolean)
        
        /** Texture used to specify how the detail textures get blended with the base textures. [member detail_mask] can be used together with [member detail_albedo]'s alpha channel (if any). */
        get detail_mask(): Texture2D
        set detail_mask(value: Texture2D)
        
        /** Specifies how the [member detail_albedo] should blend with the current `ALBEDO`. See [enum BlendMode] for options. */
        get detail_blend_mode(): int64
        set detail_blend_mode(value: int64)
        
        /** Specifies whether to use `UV` or `UV2` for the detail layer. See [enum DetailUV] for options. */
        get detail_uv_layer(): int64
        set detail_uv_layer(value: int64)
        
        /** Texture that specifies the color of the detail overlay. [member detail_albedo]'s alpha channel is used as a mask, even when the material is opaque. To use a dedicated texture as a mask, see [member detail_mask].  
         *      
         *  **Note:** [member detail_albedo] is  *not*  modulated by [member albedo_color].  
         */
        get detail_albedo(): Texture2D
        set detail_albedo(value: Texture2D)
        
        /** Texture that specifies the per-pixel normal of the detail overlay. The [member detail_normal] texture only uses the red and green channels; the blue and alpha channels are ignored. The normal read from [member detail_normal] is oriented around the surface normal provided by the [Mesh].  
         *      
         *  **Note:** Godot expects the normal map to use X+, Y+, and Z+ coordinates. See [url=http://wiki.polycount.com/wiki/Normal_Map_Technical_Details#Common_Swizzle_Coordinates]this page[/url] for a comparison of normal map coordinates expected by popular engines.  
         */
        get detail_normal(): Texture2D
        set detail_normal(value: Texture2D)
        
        /** How much to scale the `UV` coordinates. This is multiplied by `UV` in the vertex function. The Z component is used when [member uv1_triplanar] is enabled, but it is not used anywhere else. */
        get uv1_scale(): Vector3
        set uv1_scale(value: Vector3)
        
        /** How much to offset the `UV` coordinates. This amount will be added to `UV` in the vertex function. This can be used to offset a texture. The Z component is used when [member uv1_triplanar] is enabled, but it is not used anywhere else. */
        get uv1_offset(): Vector3
        set uv1_offset(value: Vector3)
        
        /** If `true`, instead of using `UV` textures will use a triplanar texture lookup to determine how to apply textures. Triplanar uses the orientation of the object's surface to blend between texture coordinates. It reads from the source texture 3 times, once for each axis and then blends between the results based on how closely the pixel aligns with each axis. This is often used for natural features to get a realistic blend of materials. Because triplanar texturing requires many more texture reads per-pixel it is much slower than normal UV texturing. Additionally, because it is blending the texture between the three axes, it is unsuitable when you are trying to achieve crisp texturing. */
        get uv1_triplanar(): boolean
        set uv1_triplanar(value: boolean)
        
        /** A lower number blends the texture more softly while a higher number blends the texture more sharply.  
         *      
         *  **Note:** [member uv1_triplanar_sharpness] is clamped between `0.0` and `150.0` (inclusive) as values outside that range can look broken depending on the mesh.  
         */
        get uv1_triplanar_sharpness(): float64
        set uv1_triplanar_sharpness(value: float64)
        
        /** If `true`, triplanar mapping for `UV` is calculated in world space rather than object local space. See also [member uv1_triplanar]. */
        get uv1_world_triplanar(): boolean
        set uv1_world_triplanar(value: boolean)
        
        /** How much to scale the `UV2` coordinates. This is multiplied by `UV2` in the vertex function. The Z component is used when [member uv2_triplanar] is enabled, but it is not used anywhere else. */
        get uv2_scale(): Vector3
        set uv2_scale(value: Vector3)
        
        /** How much to offset the `UV2` coordinates. This amount will be added to `UV2` in the vertex function. This can be used to offset a texture. The Z component is used when [member uv2_triplanar] is enabled, but it is not used anywhere else. */
        get uv2_offset(): Vector3
        set uv2_offset(value: Vector3)
        
        /** If `true`, instead of using `UV2` textures will use a triplanar texture lookup to determine how to apply textures. Triplanar uses the orientation of the object's surface to blend between texture coordinates. It reads from the source texture 3 times, once for each axis and then blends between the results based on how closely the pixel aligns with each axis. This is often used for natural features to get a realistic blend of materials. Because triplanar texturing requires many more texture reads per-pixel it is much slower than normal UV texturing. Additionally, because it is blending the texture between the three axes, it is unsuitable when you are trying to achieve crisp texturing. */
        get uv2_triplanar(): boolean
        set uv2_triplanar(value: boolean)
        
        /** A lower number blends the texture more softly while a higher number blends the texture more sharply.  
         *      
         *  **Note:** [member uv2_triplanar_sharpness] is clamped between `0.0` and `150.0` (inclusive) as values outside that range can look broken depending on the mesh.  
         */
        get uv2_triplanar_sharpness(): float64
        set uv2_triplanar_sharpness(value: float64)
        
        /** If `true`, triplanar mapping for `UV2` is calculated in world space rather than object local space. See also [member uv2_triplanar]. */
        get uv2_world_triplanar(): boolean
        set uv2_world_triplanar(value: boolean)
        
        /** Filter flags for the texture. See [enum TextureFilter] for options.  
         *      
         *  **Note:** [member heightmap_texture] is always sampled with linear filtering, even if nearest-neighbor filtering is selected here. This is to ensure the heightmap effect looks as intended. If you need sharper height transitions between pixels, resize the heightmap texture in an image editor with nearest-neighbor filtering.  
         */
        get texture_filter(): int64
        set texture_filter(value: int64)
        
        /** Repeat flags for the texture. See [enum TextureFilter] for options. */
        get texture_repeat(): boolean
        set texture_repeat(value: boolean)
        
        /** If `true`, the object receives no shadow that would otherwise be cast onto it. */
        get disable_receive_shadows(): boolean
        set disable_receive_shadows(value: boolean)
        
        /** If `true`, enables the "shadow to opacity" render mode where lighting modifies the alpha so shadowed areas are opaque and non-shadowed areas are transparent. Useful for overlaying shadows onto a camera feed in AR. */
        get shadow_to_opacity(): boolean
        set shadow_to_opacity(value: boolean)
        
        /** Controls how the object faces the camera. See [enum BillboardMode].  
         *      
         *  **Note:** Billboard mode is not suitable for VR because the left-right vector of the camera is not horizontal when the screen is attached to your head instead of on the table. See [url=https://github.com/godotengine/godot/issues/41567]GitHub issue #41567[/url] for details.  
         */
        get billboard_mode(): int64
        set billboard_mode(value: int64)
        
        /** If `true`, the shader will keep the scale set for the mesh. Otherwise, the scale is lost when billboarding. Only applies when [member billboard_mode] is not [constant BILLBOARD_DISABLED]. */
        get billboard_keep_scale(): boolean
        set billboard_keep_scale(value: boolean)
        
        /** The number of horizontal frames in the particle sprite sheet. Only enabled when using [constant BILLBOARD_PARTICLES]. See [member billboard_mode]. */
        get particles_anim_h_frames(): int64
        set particles_anim_h_frames(value: int64)
        
        /** The number of vertical frames in the particle sprite sheet. Only enabled when using [constant BILLBOARD_PARTICLES]. See [member billboard_mode]. */
        get particles_anim_v_frames(): int64
        set particles_anim_v_frames(value: int64)
        
        /** If `true`, particle animations are looped. Only enabled when using [constant BILLBOARD_PARTICLES]. See [member billboard_mode]. */
        get particles_anim_loop(): boolean
        set particles_anim_loop(value: boolean)
        
        /** If `true`, enables the vertex grow setting. This can be used to create mesh-based outlines using a second material pass and its [member cull_mode] set to [constant CULL_FRONT]. See also [member grow_amount].  
         *      
         *  **Note:** Vertex growth cannot create new vertices, which means that visible gaps may occur in sharp corners. This can be alleviated by designing the mesh to use smooth normals exclusively using [url=http://wiki.polycount.com/wiki/Face_weighted_normals]face weighted normals[/url] in the 3D authoring software. In this case, grow will be able to join every outline together, just like in the original mesh.  
         */
        get grow(): boolean
        set grow(value: boolean)
        
        /** Grows object vertices in the direction of their normals. Only effective if [member grow] is `true`. */
        get grow_amount(): float64
        set grow_amount(value: float64)
        
        /** If `true`, the object is rendered at the same size regardless of distance. */
        get fixed_size(): boolean
        set fixed_size(value: boolean)
        
        /** If `true`, render point size can be changed.  
         *      
         *  **Note:** This is only effective for objects whose geometry is point-based rather than triangle-based. See also [member point_size].  
         */
        get use_point_size(): boolean
        set use_point_size(value: boolean)
        
        /** The point size in pixels. See [member use_point_size]. */
        get point_size(): float64
        set point_size(value: float64)
        
        /** If `true`, enables parts of the shader required for [GPUParticles3D] trails to function. This also requires using a mesh with appropriate skinning, such as [RibbonTrailMesh] or [TubeTrailMesh]. Enabling this feature outside of materials used in [GPUParticles3D] meshes will break material rendering. */
        get use_particle_trails(): boolean
        set use_particle_trails(value: boolean)
        
        /** If `true`, the proximity fade effect is enabled. The proximity fade effect fades out each pixel based on its distance to another object. */
        get proximity_fade_enabled(): boolean
        set proximity_fade_enabled(value: boolean)
        
        /** Distance over which the fade effect takes place. The larger the distance the longer it takes for an object to fade. */
        get proximity_fade_distance(): float64
        set proximity_fade_distance(value: float64)
        
        /** The width of the range around the shape between the minimum and maximum representable signed distance. */
        get msdf_pixel_range(): float64
        set msdf_pixel_range(value: float64)
        
        /** The width of the shape outline. */
        get msdf_outline_size(): float64
        set msdf_outline_size(value: float64)
        
        /** Specifies which type of fade to use. Can be any of the [enum DistanceFadeMode]s. */
        get distance_fade_mode(): int64
        set distance_fade_mode(value: int64)
        
        /** Distance at which the object starts to become visible. If the object is less than this distance away, it will be invisible.  
         *      
         *  **Note:** If [member distance_fade_min_distance] is greater than [member distance_fade_max_distance], the behavior will be reversed. The object will start to fade away at [member distance_fade_max_distance] and will fully disappear once it reaches [member distance_fade_min_distance].  
         */
        get distance_fade_min_distance(): float64
        set distance_fade_min_distance(value: float64)
        
        /** Distance at which the object appears fully opaque.  
         *      
         *  **Note:** If [member distance_fade_max_distance] is less than [member distance_fade_min_distance], the behavior will be reversed. The object will start to fade away at [member distance_fade_max_distance] and will fully disappear once it reaches [member distance_fade_min_distance].  
         */
        get distance_fade_max_distance(): float64
        set distance_fade_max_distance(value: float64)
    }
    /** Boolean matrix.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_bitmap.html  
     */
    class BitMap extends Resource {
        constructor(identifier?: any)
        /** Creates a bitmap with the specified size, filled with `false`. */
        create(size: Vector2i): void
        
        /** Creates a bitmap that matches the given image dimensions, every element of the bitmap is set to `false` if the alpha value of the image at that position is equal to [param threshold] or less, and `true` in other case. */
        create_from_image_alpha(image: Image, threshold: float64 = 0.1): void
        
        /** Sets the bitmap's element at the specified position, to the specified value. */
        set_bitv(position: Vector2i, bit: boolean): void
        
        /** Sets the bitmap's element at the specified position, to the specified value. */
        set_bit(x: int64, y: int64, bit: boolean): void
        
        /** Returns bitmap's value at the specified position. */
        get_bitv(position: Vector2i): boolean
        
        /** Returns bitmap's value at the specified position. */
        get_bit(x: int64, y: int64): boolean
        
        /** Sets a rectangular portion of the bitmap to the specified value. */
        set_bit_rect(rect: Rect2i, bit: boolean): void
        
        /** Returns the number of bitmap elements that are set to `true`. */
        get_true_bit_count(): int64
        
        /** Returns bitmap's dimensions. */
        get_size(): Vector2i
        
        /** Resizes the image to [param new_size]. */
        resize(new_size: Vector2i): void
        
        /** Applies morphological dilation or erosion to the bitmap. If [param pixels] is positive, dilation is applied to the bitmap. If [param pixels] is negative, erosion is applied to the bitmap. [param rect] defines the area where the morphological operation is applied. Pixels located outside the [param rect] are unaffected by [method grow_mask]. */
        grow_mask(pixels: int64, rect: Rect2i): void
        
        /** Returns an image of the same size as the bitmap and with a [enum Image.Format] of type [constant Image.FORMAT_L8]. `true` bits of the bitmap are being converted into white pixels, and `false` bits into black. */
        convert_to_image(): Image
        
        /** Creates an [Array] of polygons covering a rectangular portion of the bitmap. It uses a marching squares algorithm, followed by Ramer-Douglas-Peucker (RDP) reduction of the number of vertices. Each polygon is described as a [PackedVector2Array] of its vertices.  
         *  To get polygons covering the whole bitmap, pass:  
         *    
         *  [param epsilon] is passed to RDP to control how accurately the polygons cover the bitmap: a lower [param epsilon] corresponds to more points in the polygons.  
         */
        opaque_to_polygons(rect: Rect2i, epsilon: float64 = 2): GArray
        get data(): GDictionary
        set data(value: GDictionary)
    }
    class BitMapEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    /** A joint used with [Skeleton2D] to control and animate other nodes.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_bone2d.html  
     */
    class Bone2D<Map extends Record<string, Node> = Record<string, Node>> extends Node2D<Map> {
        constructor(identifier?: any)
        /** Resets the bone to the rest pose. This is equivalent to setting [member Node2D.transform] to [member rest]. */
        apply_rest(): void
        
        /** Returns the node's [member rest] [Transform2D] if it doesn't have a parent, or its rest pose relative to its parent. */
        get_skeleton_rest(): Transform2D
        
        /** Returns the node's index as part of the entire skeleton. See [Skeleton2D]. */
        get_index_in_skeleton(): int64
        
        /** When set to `true`, the [Bone2D] node will attempt to automatically calculate the bone angle and length using the first child [Bone2D] node, if one exists. If none exist, the [Bone2D] cannot automatically calculate these values and will print a warning. */
        set_autocalculate_length_and_angle(auto_calculate: boolean): void
        
        /** Returns whether this [Bone2D] is going to autocalculate its length and bone angle using its first [Bone2D] child node, if one exists. If there are no [Bone2D] children, then it cannot autocalculate these values and will print a warning. */
        get_autocalculate_length_and_angle(): boolean
        
        /** Sets the length of the bone in the [Bone2D]. */
        set_length(length: float64): void
        
        /** Returns the length of the bone in the [Bone2D] node. */
        get_length(): float64
        
        /** Sets the bone angle for the [Bone2D]. This is typically set to the rotation from the [Bone2D] to a child [Bone2D] node.  
         *      
         *  **Note:** This is different from the [Bone2D]'s rotation. The bone's angle is the rotation of the bone shown by the gizmo, which is unaffected by the [Bone2D]'s [member Node2D.transform].  
         */
        set_bone_angle(angle: float64): void
        
        /** Returns the angle of the bone in the [Bone2D].  
         *      
         *  **Note:** This is different from the [Bone2D]'s rotation. The bone's angle is the rotation of the bone shown by the gizmo, which is unaffected by the [Bone2D]'s [member Node2D.transform].  
         */
        get_bone_angle(): float64
        
        /** Rest transform of the bone. You can reset the node's transforms to this value using [method apply_rest]. */
        get rest(): Transform2D
        set rest(value: Transform2D)
    }
    /** А node that dynamically copies or overrides the 3D transform of a bone in its parent [Skeleton3D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_boneattachment3d.html  
     */
    class BoneAttachment3D<Map extends Record<string, Node> = Record<string, Node>> extends Node3D<Map> {
        constructor(identifier?: any)
        /** Get parent or external [Skeleton3D] node if found. */
        get_skeleton(): Skeleton3D
        
        /** A function that is called automatically when the [Skeleton3D] is updated. This function is where the [BoneAttachment3D] node updates its position so it is correctly bound when it is  *not*  set to override the bone pose. */
        on_skeleton_update(): void
        
        /** Sets whether the BoneAttachment3D node will use an external [Skeleton3D] node rather than attempting to use its parent node as the [Skeleton3D]. When set to `true`, the BoneAttachment3D node will use the external [Skeleton3D] node set in [method set_external_skeleton]. */
        set_use_external_skeleton(use_external_skeleton: boolean): void
        
        /** Returns whether the BoneAttachment3D node is using an external [Skeleton3D] rather than attempting to use its parent node as the [Skeleton3D]. */
        get_use_external_skeleton(): boolean
        
        /** Sets the [NodePath] to the external skeleton that the BoneAttachment3D node should use. See [method set_use_external_skeleton] to enable the external [Skeleton3D] node. */
        set_external_skeleton(external_skeleton: NodePath | string): void
        
        /** Returns the [NodePath] to the external [Skeleton3D] node, if one has been set. */
        get_external_skeleton(): NodePath
        
        /** The name of the attached bone. */
        get bone_name(): StringName
        set bone_name(value: StringName)
        
        /** The index of the attached bone. */
        get bone_idx(): int64
        set bone_idx(value: int64)
        
        /** Whether the BoneAttachment3D node will override the bone pose of the bone it is attached to. When set to `true`, the BoneAttachment3D node can change the pose of the bone. When set to `false`, the BoneAttachment3D will always be set to the bone's transform.  
         *      
         *  **Note:** This override performs interruptively in the skeleton update process using signals due to the old design. It may cause unintended behavior when used at the same time with [SkeletonModifier3D].  
         */
        get override_pose(): boolean
        set override_pose(value: boolean)
    }
    /** Describes a mapping of bone names for retargeting [Skeleton3D] into common names defined by a [SkeletonProfile].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_bonemap.html  
     */
    class BoneMap extends Resource {
        constructor(identifier?: any)
        /** Returns a skeleton bone name is mapped to [param profile_bone_name].  
         *  In the retargeting process, the returned bone name is the bone name of the source skeleton.  
         */
        get_skeleton_bone_name(profile_bone_name: StringName): StringName
        
        /** Maps a skeleton bone name to [param profile_bone_name].  
         *  In the retargeting process, the setting bone name is the bone name of the source skeleton.  
         */
        set_skeleton_bone_name(profile_bone_name: StringName, skeleton_bone_name: StringName): void
        
        /** Returns a profile bone name having [param skeleton_bone_name]. If not found, an empty [StringName] will be returned.  
         *  In the retargeting process, the returned bone name is the bone name of the target skeleton.  
         */
        find_profile_bone_name(skeleton_bone_name: StringName): StringName
        
        /** A [SkeletonProfile] of the mapping target. Key names in the [BoneMap] are synchronized with it. */
        get profile(): SkeletonProfile
        set profile(value: SkeletonProfile)
        
        /** This signal is emitted when change the key value in the [BoneMap]. This is used to validate mapping and to update [BoneMap] editor. */
        readonly bone_map_updated: Signal0
        
        /** This signal is emitted when change the value in profile or change the reference of profile. This is used to update key names in the [BoneMap] and to redraw the [BoneMap] editor. */
        readonly profile_updated: Signal0
    }
    class BoneMapEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    namespace BoxContainer {
        enum AlignmentMode {
            /** The child controls will be arranged at the beginning of the container, i.e. top if orientation is vertical, left if orientation is horizontal (right for RTL layout). */
            ALIGNMENT_BEGIN = 0,
            
            /** The child controls will be centered in the container. */
            ALIGNMENT_CENTER = 1,
            
            /** The child controls will be arranged at the end of the container, i.e. bottom if orientation is vertical, right if orientation is horizontal (left for RTL layout). */
            ALIGNMENT_END = 2,
        }
    }
    /** A container that arranges its child controls horizontally or vertically.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_boxcontainer.html  
     */
    class BoxContainer<Map extends Record<string, Node> = Record<string, Node>> extends Container<Map> {
        constructor(identifier?: any)
        /** Adds a [Control] node to the box as a spacer. If [param begin] is `true`, it will insert the [Control] node in front of all other children. */
        add_spacer(begin: boolean): Control
        
        /** The alignment of the container's children (must be one of [constant ALIGNMENT_BEGIN], [constant ALIGNMENT_CENTER], or [constant ALIGNMENT_END]). */
        get alignment(): int64
        set alignment(value: int64)
        
        /** If `true`, the [BoxContainer] will arrange its children vertically, rather than horizontally.  
         *  Can't be changed when using [HBoxContainer] and [VBoxContainer].  
         */
        get vertical(): boolean
        set vertical(value: boolean)
    }
    /** Generate an axis-aligned box [PrimitiveMesh].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_boxmesh.html  
     */
    class BoxMesh extends PrimitiveMesh {
        constructor(identifier?: any)
        /** The box's width, height and depth. */
        get size(): Vector3
        set size(value: Vector3)
        
        /** Number of extra edge loops inserted along the X axis. */
        get subdivide_width(): int64
        set subdivide_width(value: int64)
        
        /** Number of extra edge loops inserted along the Y axis. */
        get subdivide_height(): int64
        set subdivide_height(value: int64)
        
        /** Number of extra edge loops inserted along the Z axis. */
        get subdivide_depth(): int64
        set subdivide_depth(value: int64)
    }
    /** Cuboid shape for use with occlusion culling in [OccluderInstance3D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_boxoccluder3d.html  
     */
    class BoxOccluder3D extends Occluder3D {
        constructor(identifier?: any)
        /** The box's size in 3D units. */
        get size(): Vector3
        set size(value: Vector3)
    }
    /** A 3D box shape used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_boxshape3d.html  
     */
    class BoxShape3D extends Shape3D {
        constructor(identifier?: any)
        /** The box's width, height and depth. */
        get size(): Vector3
        set size(value: Vector3)
    }
    /** A themed button that can contain text and an icon.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_button.html  
     */
    class Button<Map extends Record<string, Node> = Record<string, Node>> extends BaseButton<Map> {
        constructor(identifier?: any)
        /** The button's text that will be displayed inside the button's area. */
        get text(): string
        set text(value: string)
        
        /** Button's icon, if text is present the icon will be placed before the text.  
         *  To edit margin and spacing of the icon, use [theme_item h_separation] theme property and `content_margin_*` properties of the used [StyleBox]es.  
         */
        get icon(): Texture2D
        set icon(value: Texture2D)
        
        /** Flat buttons don't display decoration. */
        get flat(): boolean
        set flat(value: boolean)
        
        /** Text alignment policy for the button's text, use one of the [enum HorizontalAlignment] constants. */
        get alignment(): int64
        set alignment(value: int64)
        
        /** Sets the clipping behavior when the text exceeds the node's bounding rectangle. See [enum TextServer.OverrunBehavior] for a description of all modes. */
        get text_overrun_behavior(): int64
        set text_overrun_behavior(value: int64)
        
        /** If set to something other than [constant TextServer.AUTOWRAP_OFF], the text gets wrapped inside the node's bounding rectangle. */
        get autowrap_mode(): int64
        set autowrap_mode(value: int64)
        
        /** If `true`, text that is too large to fit the button is clipped horizontally. If `false`, the button will always be wide enough to hold the text. The text is not vertically clipped, and the button's height is not affected by this property. */
        get clip_text(): boolean
        set clip_text(value: boolean)
        
        /** Specifies if the icon should be aligned horizontally to the left, right, or center of a button. Uses the same [enum HorizontalAlignment] constants as the text alignment. If centered horizontally and vertically, text will draw on top of the icon. */
        get icon_alignment(): int64
        set icon_alignment(value: int64)
        
        /** Specifies if the icon should be aligned vertically to the top, bottom, or center of a button. Uses the same [enum VerticalAlignment] constants as the text alignment. If centered horizontally and vertically, text will draw on top of the icon. */
        get vertical_icon_alignment(): int64
        set vertical_icon_alignment(value: int64)
        
        /** When enabled, the button's icon will expand/shrink to fit the button's size while keeping its aspect. See also [theme_item icon_max_width]. */
        get expand_icon(): boolean
        set expand_icon(value: boolean)
        
        /** Base text writing direction. */
        get text_direction(): int64
        set text_direction(value: int64)
        
        /** Language code used for line-breaking and text shaping algorithms, if left empty current locale is used instead. */
        get language(): string
        set language(value: string)
    }
    /** A group of buttons that doesn't allow more than one button to be pressed at a time.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_buttongroup.html  
     */
    class ButtonGroup extends Resource {
        constructor(identifier?: any)
        /** Returns the current pressed button. */
        get_pressed_button(): BaseButton
        
        /** Returns an [Array] of [Button]s who have this as their [ButtonGroup] (see [member BaseButton.button_group]). */
        get_buttons(): GArray
        
        /** If `true`, it is possible to unpress all buttons in this [ButtonGroup]. */
        get allow_unpress(): boolean
        set allow_unpress(value: boolean)
        
        /** Emitted when one of the buttons of the group is pressed. */
        readonly pressed: Signal1<BaseButton>
    }
    namespace CPUParticles2D {
        enum DrawOrder {
            /** Particles are drawn in the order emitted. */
            DRAW_ORDER_INDEX = 0,
            
            /** Particles are drawn in order of remaining lifetime. In other words, the particle with the highest lifetime is drawn at the front. */
            DRAW_ORDER_LIFETIME = 1,
        }
        enum Parameter {
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set initial velocity properties. */
            PARAM_INITIAL_LINEAR_VELOCITY = 0,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set angular velocity properties. */
            PARAM_ANGULAR_VELOCITY = 1,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set orbital velocity properties. */
            PARAM_ORBIT_VELOCITY = 2,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set linear acceleration properties. */
            PARAM_LINEAR_ACCEL = 3,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set radial acceleration properties. */
            PARAM_RADIAL_ACCEL = 4,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set tangential acceleration properties. */
            PARAM_TANGENTIAL_ACCEL = 5,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set damping properties. */
            PARAM_DAMPING = 6,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set angle properties. */
            PARAM_ANGLE = 7,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set scale properties. */
            PARAM_SCALE = 8,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set hue variation properties. */
            PARAM_HUE_VARIATION = 9,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set animation speed properties. */
            PARAM_ANIM_SPEED = 10,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set animation offset properties. */
            PARAM_ANIM_OFFSET = 11,
            
            /** Represents the size of the [enum Parameter] enum. */
            PARAM_MAX = 12,
        }
        enum ParticleFlags {
            /** Use with [method set_particle_flag] to set [member particle_flag_align_y]. */
            PARTICLE_FLAG_ALIGN_Y_TO_VELOCITY = 0,
            
            /** Present for consistency with 3D particle nodes, not used in 2D. */
            PARTICLE_FLAG_ROTATE_Y = 1,
            
            /** Present for consistency with 3D particle nodes, not used in 2D. */
            PARTICLE_FLAG_DISABLE_Z = 2,
            
            /** Represents the size of the [enum ParticleFlags] enum. */
            PARTICLE_FLAG_MAX = 3,
        }
        enum EmissionShape {
            /** All particles will be emitted from a single point. */
            EMISSION_SHAPE_POINT = 0,
            
            /** Particles will be emitted in the volume of a sphere flattened to two dimensions. */
            EMISSION_SHAPE_SPHERE = 1,
            
            /** Particles will be emitted on the surface of a sphere flattened to two dimensions. */
            EMISSION_SHAPE_SPHERE_SURFACE = 2,
            
            /** Particles will be emitted in the area of a rectangle. */
            EMISSION_SHAPE_RECTANGLE = 3,
            
            /** Particles will be emitted at a position chosen randomly among [member emission_points]. Particle color will be modulated by [member emission_colors]. */
            EMISSION_SHAPE_POINTS = 4,
            
            /** Particles will be emitted at a position chosen randomly among [member emission_points]. Particle velocity and rotation will be set based on [member emission_normals]. Particle color will be modulated by [member emission_colors]. */
            EMISSION_SHAPE_DIRECTED_POINTS = 5,
            
            /** Represents the size of the [enum EmissionShape] enum. */
            EMISSION_SHAPE_MAX = 6,
        }
    }
    /** A CPU-based 2D particle emitter.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_cpuparticles2d.html  
     */
    class CPUParticles2D<Map extends Record<string, Node> = Record<string, Node>> extends Node2D<Map> {
        constructor(identifier?: any)
        /** Requests the particles to process for extra process time during a single frame.  
         *  Useful for particle playback, if used in combination with [member use_fixed_seed] or by calling [method restart] with parameter `keep_seed` set to `true`.  
         */
        request_particles_process(process_time: float64): void
        
        /** Restarts the particle emitter.  
         *  If [param keep_seed] is `true`, the current random seed will be preserved. Useful for seeking and playback.  
         */
        restart(keep_seed: boolean = false): void
        
        /** Sets the minimum value for the given parameter. */
        set_param_min(param: CPUParticles2D.Parameter, value: float64): void
        
        /** Returns the minimum value range for the given parameter. */
        get_param_min(param: CPUParticles2D.Parameter): float64
        
        /** Sets the maximum value for the given parameter. */
        set_param_max(param: CPUParticles2D.Parameter, value: float64): void
        
        /** Returns the maximum value range for the given parameter. */
        get_param_max(param: CPUParticles2D.Parameter): float64
        
        /** Sets the [Curve] of the parameter specified by [enum Parameter]. Should be a unit [Curve]. */
        set_param_curve(param: CPUParticles2D.Parameter, curve: Curve): void
        
        /** Returns the [Curve] of the parameter specified by [enum Parameter]. */
        get_param_curve(param: CPUParticles2D.Parameter): Curve
        
        /** Enables or disables the given flag (see [enum ParticleFlags] for options). */
        set_particle_flag(particle_flag: CPUParticles2D.ParticleFlags, enable: boolean): void
        
        /** Returns the enabled state of the given particle flag (see [enum ParticleFlags] for options). */
        get_particle_flag(particle_flag: CPUParticles2D.ParticleFlags): boolean
        
        /** Sets this node's properties to match a given [GPUParticles2D] node with an assigned [ParticleProcessMaterial]. */
        convert_from_particles(particles: Node): void
        
        /** If `true`, particles are being emitted. [member emitting] can be used to start and stop particles from emitting. However, if [member one_shot] is `true` setting [member emitting] to `true` will not restart the emission cycle until after all active particles finish processing. You can use the [signal finished] signal to be notified once all active particles finish processing. */
        get emitting(): boolean
        set emitting(value: boolean)
        
        /** Number of particles emitted in one emission cycle. */
        get amount(): int64
        set amount(value: int64)
        
        /** Particle texture. If `null`, particles will be squares. */
        get texture(): Texture2D
        set texture(value: Texture2D)
        
        /** Amount of time each particle will exist. */
        get lifetime(): float64
        set lifetime(value: float64)
        
        /** If `true`, only one emission cycle occurs. If set `true` during a cycle, emission will stop at the cycle's end. */
        get one_shot(): boolean
        set one_shot(value: boolean)
        
        /** Particle system starts as if it had already run for this many seconds. */
        get preprocess(): float64
        set preprocess(value: float64)
        
        /** Particle system's running speed scaling ratio. A value of `0` can be used to pause the particles. */
        get speed_scale(): float64
        set speed_scale(value: float64)
        
        /** How rapidly particles in an emission cycle are emitted. If greater than `0`, there will be a gap in emissions before the next cycle begins. */
        get explosiveness(): float64
        set explosiveness(value: float64)
        
        /** Emission lifetime randomness ratio. */
        get randomness(): float64
        set randomness(value: float64)
        
        /** If `true`, particles will use the same seed for every simulation using the seed defined in [member seed]. This is useful for situations where the visual outcome should be consistent across replays, for example when using Movie Maker mode. */
        get use_fixed_seed(): boolean
        set use_fixed_seed(value: boolean)
        
        /** Sets the random seed used by the particle system. Only effective if [member use_fixed_seed] is `true`. */
        get seed(): int64
        set seed(value: int64)
        
        /** Particle lifetime randomness ratio. */
        get lifetime_randomness(): float64
        set lifetime_randomness(value: float64)
        
        /** The particle system's frame rate is fixed to a value. For example, changing the value to 2 will make the particles render at 2 frames per second. Note this does not slow down the simulation of the particle system itself. */
        get fixed_fps(): int64
        set fixed_fps(value: int64)
        
        /** If `true`, results in fractional delta calculation which has a smoother particles display effect. */
        get fract_delta(): boolean
        set fract_delta(value: boolean)
        
        /** If `true`, particles use the parent node's coordinate space (known as local coordinates). This will cause particles to move and rotate along the [CPUParticles2D] node (and its parents) when it is moved or rotated. If `false`, particles use global coordinates; they will not move or rotate along the [CPUParticles2D] node (and its parents) when it is moved or rotated. */
        get local_coords(): boolean
        set local_coords(value: boolean)
        
        /** Particle draw order. Uses [enum DrawOrder] values. */
        get draw_order(): int64
        set draw_order(value: int64)
        
        /** Particles will be emitted inside this region. See [enum EmissionShape] for possible values. */
        get emission_shape(): int64
        set emission_shape(value: int64)
        
        /** The sphere's radius if [member emission_shape] is set to [constant EMISSION_SHAPE_SPHERE]. */
        get emission_sphere_radius(): float64
        set emission_sphere_radius(value: float64)
        
        /** The rectangle's extents if [member emission_shape] is set to [constant EMISSION_SHAPE_RECTANGLE]. */
        get emission_rect_extents(): Vector2
        set emission_rect_extents(value: Vector2)
        
        /** Sets the initial positions to spawn particles when using [constant EMISSION_SHAPE_POINTS] or [constant EMISSION_SHAPE_DIRECTED_POINTS]. */
        get emission_points(): PackedVector2Array
        set emission_points(value: PackedVector2Array | Vector2[])
        
        /** Sets the direction the particles will be emitted in when using [constant EMISSION_SHAPE_DIRECTED_POINTS]. */
        get emission_normals(): PackedVector2Array
        set emission_normals(value: PackedVector2Array | Vector2[])
        
        /** Sets the [Color]s to modulate particles by when using [constant EMISSION_SHAPE_POINTS] or [constant EMISSION_SHAPE_DIRECTED_POINTS]. */
        get emission_colors(): PackedColorArray
        set emission_colors(value: PackedColorArray | Color[])
        
        /** Align Y axis of particle with the direction of its velocity. */
        get particle_flag_align_y(): boolean
        set particle_flag_align_y(value: boolean)
        
        /** Unit vector specifying the particles' emission direction. */
        get direction(): Vector2
        set direction(value: Vector2)
        
        /** Each particle's initial direction range from `+spread` to `-spread` degrees. */
        get spread(): float64
        set spread(value: float64)
        
        /** Gravity applied to every particle. */
        get gravity(): Vector2
        set gravity(value: Vector2)
        
        /** Minimum equivalent of [member initial_velocity_max]. */
        get initial_velocity_min(): float64
        set initial_velocity_min(value: float64)
        
        /** Maximum initial velocity magnitude for each particle. Direction comes from [member direction] and [member spread]. */
        get initial_velocity_max(): float64
        set initial_velocity_max(value: float64)
        
        /** Minimum equivalent of [member angular_velocity_max]. */
        get angular_velocity_min(): float64
        set angular_velocity_min(value: float64)
        
        /** Maximum initial angular velocity (rotation speed) applied to each particle in  *degrees*  per second. */
        get angular_velocity_max(): float64
        set angular_velocity_max(value: float64)
        
        /** Each particle's angular velocity will vary along this [Curve]. Should be a unit [Curve]. */
        get angular_velocity_curve(): Curve
        set angular_velocity_curve(value: Curve)
        
        /** Minimum equivalent of [member orbit_velocity_max]. */
        get orbit_velocity_min(): float64
        set orbit_velocity_min(value: float64)
        
        /** Maximum orbital velocity applied to each particle. Makes the particles circle around origin. Specified in number of full rotations around origin per second. */
        get orbit_velocity_max(): float64
        set orbit_velocity_max(value: float64)
        
        /** Each particle's orbital velocity will vary along this [Curve]. Should be a unit [Curve]. */
        get orbit_velocity_curve(): Curve
        set orbit_velocity_curve(value: Curve)
        
        /** Minimum equivalent of [member linear_accel_max]. */
        get linear_accel_min(): float64
        set linear_accel_min(value: float64)
        
        /** Maximum linear acceleration applied to each particle in the direction of motion. */
        get linear_accel_max(): float64
        set linear_accel_max(value: float64)
        
        /** Each particle's linear acceleration will vary along this [Curve]. Should be a unit [Curve]. */
        get linear_accel_curve(): Curve
        set linear_accel_curve(value: Curve)
        
        /** Minimum equivalent of [member radial_accel_max]. */
        get radial_accel_min(): float64
        set radial_accel_min(value: float64)
        
        /** Maximum radial acceleration applied to each particle. Makes particle accelerate away from the origin or towards it if negative. */
        get radial_accel_max(): float64
        set radial_accel_max(value: float64)
        
        /** Each particle's radial acceleration will vary along this [Curve]. Should be a unit [Curve]. */
        get radial_accel_curve(): Curve
        set radial_accel_curve(value: Curve)
        
        /** Minimum equivalent of [member tangential_accel_max]. */
        get tangential_accel_min(): float64
        set tangential_accel_min(value: float64)
        
        /** Maximum tangential acceleration applied to each particle. Tangential acceleration is perpendicular to the particle's velocity giving the particles a swirling motion. */
        get tangential_accel_max(): float64
        set tangential_accel_max(value: float64)
        
        /** Each particle's tangential acceleration will vary along this [Curve]. Should be a unit [Curve]. */
        get tangential_accel_curve(): Curve
        set tangential_accel_curve(value: Curve)
        
        /** Minimum equivalent of [member damping_max]. */
        get damping_min(): float64
        set damping_min(value: float64)
        
        /** The maximum rate at which particles lose velocity. For example value of `100` means that the particle will go from `100` velocity to `0` in `1` second. */
        get damping_max(): float64
        set damping_max(value: float64)
        
        /** Damping will vary along this [Curve]. Should be a unit [Curve]. */
        get damping_curve(): Curve
        set damping_curve(value: Curve)
        
        /** Minimum equivalent of [member angle_max]. */
        get angle_min(): float64
        set angle_min(value: float64)
        
        /** Maximum initial rotation applied to each particle, in degrees. */
        get angle_max(): float64
        set angle_max(value: float64)
        
        /** Each particle's rotation will be animated along this [Curve]. Should be a unit [Curve]. */
        get angle_curve(): Curve
        set angle_curve(value: Curve)
        
        /** Minimum equivalent of [member scale_amount_max]. */
        get scale_amount_min(): float64
        set scale_amount_min(value: float64)
        
        /** Maximum initial scale applied to each particle. */
        get scale_amount_max(): float64
        set scale_amount_max(value: float64)
        
        /** Each particle's scale will vary along this [Curve]. Should be a unit [Curve]. */
        get scale_amount_curve(): Curve
        set scale_amount_curve(value: Curve)
        
        /** If `true`, the scale curve will be split into x and y components. See [member scale_curve_x] and [member scale_curve_y]. */
        get split_scale(): boolean
        set split_scale(value: boolean)
        
        /** Each particle's horizontal scale will vary along this [Curve]. Should be a unit [Curve].  
         *  [member split_scale] must be enabled.  
         */
        get scale_curve_x(): Curve
        set scale_curve_x(value: Curve)
        
        /** Each particle's vertical scale will vary along this [Curve]. Should be a unit [Curve].  
         *  [member split_scale] must be enabled.  
         */
        get scale_curve_y(): Curve
        set scale_curve_y(value: Curve)
        
        /** Each particle's initial color. If [member texture] is defined, it will be multiplied by this color. */
        get color(): Color
        set color(value: Color)
        
        /** Each particle's color will vary along this [Gradient] over its lifetime (multiplied with [member color]). */
        get color_ramp(): Gradient
        set color_ramp(value: Gradient)
        
        /** Each particle's initial color will vary along this [Gradient] (multiplied with [member color]). */
        get color_initial_ramp(): Gradient
        set color_initial_ramp(value: Gradient)
        
        /** Minimum equivalent of [member hue_variation_max]. */
        get hue_variation_min(): float64
        set hue_variation_min(value: float64)
        
        /** Maximum initial hue variation applied to each particle. It will shift the particle color's hue. */
        get hue_variation_max(): float64
        set hue_variation_max(value: float64)
        
        /** Each particle's hue will vary along this [Curve]. Should be a unit [Curve]. */
        get hue_variation_curve(): Curve
        set hue_variation_curve(value: Curve)
        
        /** Minimum equivalent of [member anim_speed_max]. */
        get anim_speed_min(): float64
        set anim_speed_min(value: float64)
        
        /** Maximum particle animation speed. Animation speed of `1` means that the particles will make full `0` to `1` offset cycle during lifetime, `2` means `2` cycles etc.  
         *  With animation speed greater than `1`, remember to enable [member CanvasItemMaterial.particles_anim_loop] property if you want the animation to repeat.  
         */
        get anim_speed_max(): float64
        set anim_speed_max(value: float64)
        
        /** Each particle's animation speed will vary along this [Curve]. Should be a unit [Curve]. */
        get anim_speed_curve(): Curve
        set anim_speed_curve(value: Curve)
        
        /** Minimum equivalent of [member anim_offset_max]. */
        get anim_offset_min(): float64
        set anim_offset_min(value: float64)
        
        /** Maximum animation offset that corresponds to frame index in the texture. `0` is the first frame, `1` is the last one. See [member CanvasItemMaterial.particles_animation]. */
        get anim_offset_max(): float64
        set anim_offset_max(value: float64)
        
        /** Each particle's animation offset will vary along this [Curve]. Should be a unit [Curve]. */
        get anim_offset_curve(): Curve
        set anim_offset_curve(value: Curve)
        
        /** Emitted when all active particles have finished processing. When [member one_shot] is disabled, particles will process continuously, so this is never emitted. */
        readonly finished: Signal0
    }
    class CPUParticles2DEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends Particles2DEditorPlugin<Map> {
        constructor(identifier?: any)
    }
    namespace CPUParticles3D {
        enum DrawOrder {
            /** Particles are drawn in the order emitted. */
            DRAW_ORDER_INDEX = 0,
            
            /** Particles are drawn in order of remaining lifetime. In other words, the particle with the highest lifetime is drawn at the front. */
            DRAW_ORDER_LIFETIME = 1,
            
            /** Particles are drawn in order of depth. */
            DRAW_ORDER_VIEW_DEPTH = 2,
        }
        enum Parameter {
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set initial velocity properties. */
            PARAM_INITIAL_LINEAR_VELOCITY = 0,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set angular velocity properties. */
            PARAM_ANGULAR_VELOCITY = 1,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set orbital velocity properties. */
            PARAM_ORBIT_VELOCITY = 2,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set linear acceleration properties. */
            PARAM_LINEAR_ACCEL = 3,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set radial acceleration properties. */
            PARAM_RADIAL_ACCEL = 4,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set tangential acceleration properties. */
            PARAM_TANGENTIAL_ACCEL = 5,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set damping properties. */
            PARAM_DAMPING = 6,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set angle properties. */
            PARAM_ANGLE = 7,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set scale properties. */
            PARAM_SCALE = 8,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set hue variation properties. */
            PARAM_HUE_VARIATION = 9,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set animation speed properties. */
            PARAM_ANIM_SPEED = 10,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set animation offset properties. */
            PARAM_ANIM_OFFSET = 11,
            
            /** Represents the size of the [enum Parameter] enum. */
            PARAM_MAX = 12,
        }
        enum ParticleFlags {
            /** Use with [method set_particle_flag] to set [member particle_flag_align_y]. */
            PARTICLE_FLAG_ALIGN_Y_TO_VELOCITY = 0,
            
            /** Use with [method set_particle_flag] to set [member particle_flag_rotate_y]. */
            PARTICLE_FLAG_ROTATE_Y = 1,
            
            /** Use with [method set_particle_flag] to set [member particle_flag_disable_z]. */
            PARTICLE_FLAG_DISABLE_Z = 2,
            
            /** Represents the size of the [enum ParticleFlags] enum. */
            PARTICLE_FLAG_MAX = 3,
        }
        enum EmissionShape {
            /** All particles will be emitted from a single point. */
            EMISSION_SHAPE_POINT = 0,
            
            /** Particles will be emitted in the volume of a sphere. */
            EMISSION_SHAPE_SPHERE = 1,
            
            /** Particles will be emitted on the surface of a sphere. */
            EMISSION_SHAPE_SPHERE_SURFACE = 2,
            
            /** Particles will be emitted in the volume of a box. */
            EMISSION_SHAPE_BOX = 3,
            
            /** Particles will be emitted at a position chosen randomly among [member emission_points]. Particle color will be modulated by [member emission_colors]. */
            EMISSION_SHAPE_POINTS = 4,
            
            /** Particles will be emitted at a position chosen randomly among [member emission_points]. Particle velocity and rotation will be set based on [member emission_normals]. Particle color will be modulated by [member emission_colors]. */
            EMISSION_SHAPE_DIRECTED_POINTS = 5,
            
            /** Particles will be emitted in a ring or cylinder. */
            EMISSION_SHAPE_RING = 6,
            
            /** Represents the size of the [enum EmissionShape] enum. */
            EMISSION_SHAPE_MAX = 7,
        }
    }
    /** A CPU-based 3D particle emitter.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_cpuparticles3d.html  
     */
    class CPUParticles3D<Map extends Record<string, Node> = Record<string, Node>> extends GeometryInstance3D<Map> {
        constructor(identifier?: any)
        /** Restarts the particle emitter.  
         *  If [param keep_seed] is `true`, the current random seed will be preserved. Useful for seeking and playback.  
         */
        restart(keep_seed: boolean = false): void
        
        /** Requests the particles to process for extra process time during a single frame.  
         *  Useful for particle playback, if used in combination with [member use_fixed_seed] or by calling [method restart] with parameter `keep_seed` set to `true`.  
         */
        request_particles_process(process_time: float64): void
        
        /** Returns the axis-aligned bounding box that contains all the particles that are active in the current frame. */
        capture_aabb(): AABB
        
        /** Sets the minimum value for the given parameter. */
        set_param_min(param: CPUParticles3D.Parameter, value: float64): void
        
        /** Returns the minimum value range for the given parameter. */
        get_param_min(param: CPUParticles3D.Parameter): float64
        
        /** Sets the maximum value for the given parameter. */
        set_param_max(param: CPUParticles3D.Parameter, value: float64): void
        
        /** Returns the maximum value range for the given parameter. */
        get_param_max(param: CPUParticles3D.Parameter): float64
        
        /** Sets the [Curve] of the parameter specified by [enum Parameter]. Should be a unit [Curve]. */
        set_param_curve(param: CPUParticles3D.Parameter, curve: Curve): void
        
        /** Returns the [Curve] of the parameter specified by [enum Parameter]. */
        get_param_curve(param: CPUParticles3D.Parameter): Curve
        
        /** Enables or disables the given particle flag (see [enum ParticleFlags] for options). */
        set_particle_flag(particle_flag: CPUParticles3D.ParticleFlags, enable: boolean): void
        
        /** Returns the enabled state of the given particle flag (see [enum ParticleFlags] for options). */
        get_particle_flag(particle_flag: CPUParticles3D.ParticleFlags): boolean
        
        /** Sets this node's properties to match a given [GPUParticles3D] node with an assigned [ParticleProcessMaterial]. */
        convert_from_particles(particles: Node): void
        
        /** If `true`, particles are being emitted. [member emitting] can be used to start and stop particles from emitting. However, if [member one_shot] is `true` setting [member emitting] to `true` will not restart the emission cycle until after all active particles finish processing. You can use the [signal finished] signal to be notified once all active particles finish processing. */
        get emitting(): boolean
        set emitting(value: boolean)
        
        /** Number of particles emitted in one emission cycle. */
        get amount(): int64
        set amount(value: int64)
        
        /** Amount of time each particle will exist. */
        get lifetime(): float64
        set lifetime(value: float64)
        
        /** If `true`, only one emission cycle occurs. If set `true` during a cycle, emission will stop at the cycle's end. */
        get one_shot(): boolean
        set one_shot(value: boolean)
        
        /** Particle system starts as if it had already run for this many seconds. */
        get preprocess(): float64
        set preprocess(value: float64)
        
        /** Particle system's running speed scaling ratio. A value of `0` can be used to pause the particles. */
        get speed_scale(): float64
        set speed_scale(value: float64)
        
        /** How rapidly particles in an emission cycle are emitted. If greater than `0`, there will be a gap in emissions before the next cycle begins. */
        get explosiveness(): float64
        set explosiveness(value: float64)
        
        /** Emission lifetime randomness ratio. */
        get randomness(): float64
        set randomness(value: float64)
        
        /** If `true`, particles will use the same seed for every simulation using the seed defined in [member seed]. This is useful for situations where the visual outcome should be consistent across replays, for example when using Movie Maker mode. */
        get use_fixed_seed(): boolean
        set use_fixed_seed(value: boolean)
        
        /** Sets the random seed used by the particle system. Only effective if [member use_fixed_seed] is `true`. */
        get seed(): int64
        set seed(value: int64)
        
        /** Particle lifetime randomness ratio. */
        get lifetime_randomness(): float64
        set lifetime_randomness(value: float64)
        
        /** The particle system's frame rate is fixed to a value. For example, changing the value to 2 will make the particles render at 2 frames per second. Note this does not slow down the particle system itself. */
        get fixed_fps(): int64
        set fixed_fps(value: int64)
        
        /** If `true`, results in fractional delta calculation which has a smoother particles display effect. */
        get fract_delta(): boolean
        set fract_delta(value: boolean)
        
        /** The [AABB] that determines the node's region which needs to be visible on screen for the particle system to be active.  
         *  Grow the box if particles suddenly appear/disappear when the node enters/exits the screen. The [AABB] can be grown via code or with the **Particles → Generate AABB** editor tool.  
         */
        get visibility_aabb(): AABB
        set visibility_aabb(value: AABB)
        
        /** If `true`, particles use the parent node's coordinate space (known as local coordinates). This will cause particles to move and rotate along the [CPUParticles3D] node (and its parents) when it is moved or rotated. If `false`, particles use global coordinates; they will not move or rotate along the [CPUParticles3D] node (and its parents) when it is moved or rotated. */
        get local_coords(): boolean
        set local_coords(value: boolean)
        
        /** Particle draw order. Uses [enum DrawOrder] values. */
        get draw_order(): int64
        set draw_order(value: int64)
        
        /** The [Mesh] used for each particle. If `null`, particles will be spheres. */
        get mesh(): Mesh
        set mesh(value: Mesh)
        
        /** Particles will be emitted inside this region. See [enum EmissionShape] for possible values. */
        get emission_shape(): int64
        set emission_shape(value: int64)
        
        /** The sphere's radius if [enum EmissionShape] is set to [constant EMISSION_SHAPE_SPHERE]. */
        get emission_sphere_radius(): float64
        set emission_sphere_radius(value: float64)
        
        /** The rectangle's extents if [member emission_shape] is set to [constant EMISSION_SHAPE_BOX]. */
        get emission_box_extents(): Vector3
        set emission_box_extents(value: Vector3)
        
        /** Sets the initial positions to spawn particles when using [constant EMISSION_SHAPE_POINTS] or [constant EMISSION_SHAPE_DIRECTED_POINTS]. */
        get emission_points(): PackedVector3Array
        set emission_points(value: PackedVector3Array | Vector3[])
        
        /** Sets the direction the particles will be emitted in when using [constant EMISSION_SHAPE_DIRECTED_POINTS]. */
        get emission_normals(): PackedVector3Array
        set emission_normals(value: PackedVector3Array | Vector3[])
        
        /** Sets the [Color]s to modulate particles by when using [constant EMISSION_SHAPE_POINTS] or [constant EMISSION_SHAPE_DIRECTED_POINTS].  
         *      
         *  **Note:** [member emission_colors] multiplies the particle mesh's vertex colors. To have a visible effect on a [BaseMaterial3D], [member BaseMaterial3D.vertex_color_use_as_albedo]  *must*  be `true`. For a [ShaderMaterial], `ALBEDO *= COLOR.rgb;` must be inserted in the shader's `fragment()` function. Otherwise, [member emission_colors] will have no visible effect.  
         */
        get emission_colors(): PackedColorArray
        set emission_colors(value: PackedColorArray | Color[])
        
        /** The axis of the ring when using the emitter [constant EMISSION_SHAPE_RING]. */
        get emission_ring_axis(): Vector3
        set emission_ring_axis(value: Vector3)
        
        /** The height of the ring when using the emitter [constant EMISSION_SHAPE_RING]. */
        get emission_ring_height(): float64
        set emission_ring_height(value: float64)
        
        /** The radius of the ring when using the emitter [constant EMISSION_SHAPE_RING]. */
        get emission_ring_radius(): float64
        set emission_ring_radius(value: float64)
        
        /** The inner radius of the ring when using the emitter [constant EMISSION_SHAPE_RING]. */
        get emission_ring_inner_radius(): float64
        set emission_ring_inner_radius(value: float64)
        
        /** The angle of the cone when using the emitter [constant EMISSION_SHAPE_RING]. The default angle of 90 degrees results in a ring, while an angle of 0 degrees results in a cone. Intermediate values will result in a ring where one end is larger than the other.  
         *      
         *  **Note:** Depending on [member emission_ring_height], the angle may be clamped if the ring's end is reached to form a perfect cone.  
         */
        get emission_ring_cone_angle(): float64
        set emission_ring_cone_angle(value: float64)
        
        /** Align Y axis of particle with the direction of its velocity. */
        get particle_flag_align_y(): boolean
        set particle_flag_align_y(value: boolean)
        
        /** If `true`, particles rotate around Y axis by [member angle_min]. */
        get particle_flag_rotate_y(): boolean
        set particle_flag_rotate_y(value: boolean)
        
        /** If `true`, particles will not move on the Z axis. */
        get particle_flag_disable_z(): boolean
        set particle_flag_disable_z(value: boolean)
        
        /** Unit vector specifying the particles' emission direction. */
        get direction(): Vector3
        set direction(value: Vector3)
        
        /** Each particle's initial direction range from `+spread` to `-spread` degrees. Applied to X/Z plane and Y/Z planes. */
        get spread(): float64
        set spread(value: float64)
        
        /** Amount of [member spread] in Y/Z plane. A value of `1` restricts particles to X/Z plane. */
        get flatness(): float64
        set flatness(value: float64)
        
        /** Gravity applied to every particle. */
        get gravity(): Vector3
        set gravity(value: Vector3)
        
        /** Minimum value of the initial velocity. */
        get initial_velocity_min(): float64
        set initial_velocity_min(value: float64)
        
        /** Maximum value of the initial velocity. */
        get initial_velocity_max(): float64
        set initial_velocity_max(value: float64)
        
        /** Minimum initial angular velocity (rotation speed) applied to each particle in  *degrees*  per second. */
        get angular_velocity_min(): float64
        set angular_velocity_min(value: float64)
        
        /** Maximum initial angular velocity (rotation speed) applied to each particle in  *degrees*  per second. */
        get angular_velocity_max(): float64
        set angular_velocity_max(value: float64)
        
        /** Each particle's angular velocity (rotation speed) will vary along this [Curve] over its lifetime. Should be a unit [Curve]. */
        get angular_velocity_curve(): Curve
        set angular_velocity_curve(value: Curve)
        
        /** Minimum orbit velocity. */
        get orbit_velocity_min(): float64
        set orbit_velocity_min(value: float64)
        
        /** Maximum orbit velocity. */
        get orbit_velocity_max(): float64
        set orbit_velocity_max(value: float64)
        
        /** Each particle's orbital velocity will vary along this [Curve]. Should be a unit [Curve]. */
        get orbit_velocity_curve(): Curve
        set orbit_velocity_curve(value: Curve)
        
        /** Minimum linear acceleration. */
        get linear_accel_min(): float64
        set linear_accel_min(value: float64)
        
        /** Maximum linear acceleration. */
        get linear_accel_max(): float64
        set linear_accel_max(value: float64)
        
        /** Each particle's linear acceleration will vary along this [Curve]. Should be a unit [Curve]. */
        get linear_accel_curve(): Curve
        set linear_accel_curve(value: Curve)
        
        /** Minimum radial acceleration. */
        get radial_accel_min(): float64
        set radial_accel_min(value: float64)
        
        /** Maximum radial acceleration. */
        get radial_accel_max(): float64
        set radial_accel_max(value: float64)
        
        /** Each particle's radial acceleration will vary along this [Curve]. Should be a unit [Curve]. */
        get radial_accel_curve(): Curve
        set radial_accel_curve(value: Curve)
        
        /** Minimum tangent acceleration. */
        get tangential_accel_min(): float64
        set tangential_accel_min(value: float64)
        
        /** Maximum tangent acceleration. */
        get tangential_accel_max(): float64
        set tangential_accel_max(value: float64)
        
        /** Each particle's tangential acceleration will vary along this [Curve]. Should be a unit [Curve]. */
        get tangential_accel_curve(): Curve
        set tangential_accel_curve(value: Curve)
        
        /** Minimum damping. */
        get damping_min(): float64
        set damping_min(value: float64)
        
        /** Maximum damping. */
        get damping_max(): float64
        set damping_max(value: float64)
        
        /** Damping will vary along this [Curve]. Should be a unit [Curve]. */
        get damping_curve(): Curve
        set damping_curve(value: Curve)
        
        /** Minimum angle. */
        get angle_min(): float64
        set angle_min(value: float64)
        
        /** Maximum angle. */
        get angle_max(): float64
        set angle_max(value: float64)
        
        /** Each particle's rotation will be animated along this [Curve]. Should be a unit [Curve]. */
        get angle_curve(): Curve
        set angle_curve(value: Curve)
        
        /** Minimum scale. */
        get scale_amount_min(): float64
        set scale_amount_min(value: float64)
        
        /** Maximum scale. */
        get scale_amount_max(): float64
        set scale_amount_max(value: float64)
        
        /** Each particle's scale will vary along this [Curve]. Should be a unit [Curve]. */
        get scale_amount_curve(): Curve
        set scale_amount_curve(value: Curve)
        
        /** If set to `true`, three different scale curves can be specified, one per scale axis. */
        get split_scale(): boolean
        set split_scale(value: boolean)
        
        /** Curve for the scale over life, along the x axis. */
        get scale_curve_x(): Curve
        set scale_curve_x(value: Curve)
        
        /** Curve for the scale over life, along the y axis. */
        get scale_curve_y(): Curve
        set scale_curve_y(value: Curve)
        
        /** Curve for the scale over life, along the z axis. */
        get scale_curve_z(): Curve
        set scale_curve_z(value: Curve)
        
        /** Each particle's initial color.  
         *      
         *  **Note:** [member color] multiplies the particle mesh's vertex colors. To have a visible effect on a [BaseMaterial3D], [member BaseMaterial3D.vertex_color_use_as_albedo]  *must*  be `true`. For a [ShaderMaterial], `ALBEDO *= COLOR.rgb;` must be inserted in the shader's `fragment()` function. Otherwise, [member color] will have no visible effect.  
         */
        get color(): Color
        set color(value: Color)
        
        /** Each particle's color will vary along this [Gradient] over its lifetime (multiplied with [member color]).  
         *      
         *  **Note:** [member color_ramp] multiplies the particle mesh's vertex colors. To have a visible effect on a [BaseMaterial3D], [member BaseMaterial3D.vertex_color_use_as_albedo]  *must*  be `true`. For a [ShaderMaterial], `ALBEDO *= COLOR.rgb;` must be inserted in the shader's `fragment()` function. Otherwise, [member color_ramp] will have no visible effect.  
         */
        get color_ramp(): Gradient
        set color_ramp(value: Gradient)
        
        /** Each particle's initial color will vary along this [Gradient] (multiplied with [member color]).  
         *      
         *  **Note:** [member color_initial_ramp] multiplies the particle mesh's vertex colors. To have a visible effect on a [BaseMaterial3D], [member BaseMaterial3D.vertex_color_use_as_albedo]  *must*  be `true`. For a [ShaderMaterial], `ALBEDO *= COLOR.rgb;` must be inserted in the shader's `fragment()` function. Otherwise, [member color_initial_ramp] will have no visible effect.  
         */
        get color_initial_ramp(): Gradient
        set color_initial_ramp(value: Gradient)
        
        /** Minimum hue variation. */
        get hue_variation_min(): float64
        set hue_variation_min(value: float64)
        
        /** Maximum hue variation. */
        get hue_variation_max(): float64
        set hue_variation_max(value: float64)
        
        /** Each particle's hue will vary along this [Curve]. Should be a unit [Curve]. */
        get hue_variation_curve(): Curve
        set hue_variation_curve(value: Curve)
        
        /** Minimum particle animation speed. */
        get anim_speed_min(): float64
        set anim_speed_min(value: float64)
        
        /** Maximum particle animation speed. */
        get anim_speed_max(): float64
        set anim_speed_max(value: float64)
        
        /** Each particle's animation speed will vary along this [Curve]. Should be a unit [Curve]. */
        get anim_speed_curve(): Curve
        set anim_speed_curve(value: Curve)
        
        /** Minimum animation offset. */
        get anim_offset_min(): float64
        set anim_offset_min(value: float64)
        
        /** Maximum animation offset. */
        get anim_offset_max(): float64
        set anim_offset_max(value: float64)
        
        /** Each particle's animation offset will vary along this [Curve]. Should be a unit [Curve]. */
        get anim_offset_curve(): Curve
        set anim_offset_curve(value: Curve)
        
        /** Emitted when all active particles have finished processing. When [member one_shot] is disabled, particles will process continuously, so this is never emitted. */
        readonly finished: Signal0
    }
    class CPUParticles3DEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends Particles3DEditorPlugin<Map> {
        constructor(identifier?: any)
    }
    class CPUParticles3DGizmoPlugin extends EditorNode3DGizmoPlugin {
        constructor(identifier?: any)
    }
    /** A CSG Box shape.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_csgbox3d.html  
     */
    class CSGBox3D<Map extends Record<string, Node> = Record<string, Node>> extends CSGPrimitive3D<Map> {
        constructor(identifier?: any)
        /** The box's width, height and depth. */
        get size(): Vector3
        set size(value: Vector3)
        
        /** The material used to render the box. */
        get material(): BaseMaterial3D | ShaderMaterial
        set material(value: BaseMaterial3D | ShaderMaterial)
    }
    /** A CSG node that allows you to combine other CSG modifiers.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_csgcombiner3d.html  
     */
    class CSGCombiner3D<Map extends Record<string, Node> = Record<string, Node>> extends CSGShape3D<Map> {
        constructor(identifier?: any)
    }
    /** A CSG Cylinder shape.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_csgcylinder3d.html  
     */
    class CSGCylinder3D<Map extends Record<string, Node> = Record<string, Node>> extends CSGPrimitive3D<Map> {
        constructor(identifier?: any)
        /** The radius of the cylinder. */
        get radius(): float64
        set radius(value: float64)
        
        /** The height of the cylinder. */
        get height(): float64
        set height(value: float64)
        
        /** The number of sides of the cylinder, the higher this number the more detail there will be in the cylinder. */
        get sides(): int64
        set sides(value: int64)
        
        /** If `true` a cone is created, the [member radius] will only apply to one side. */
        get cone(): boolean
        set cone(value: boolean)
        
        /** If `true` the normals of the cylinder are set to give a smooth effect making the cylinder seem rounded. If `false` the cylinder will have a flat shaded look. */
        get smooth_faces(): boolean
        set smooth_faces(value: boolean)
        
        /** The material used to render the cylinder. */
        get material(): BaseMaterial3D | ShaderMaterial
        set material(value: BaseMaterial3D | ShaderMaterial)
    }
    /** A CSG Mesh shape that uses a mesh resource.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_csgmesh3d.html  
     */
    class CSGMesh3D<Map extends Record<string, Node> = Record<string, Node>> extends CSGPrimitive3D<Map> {
        constructor(identifier?: any)
        /** The [Mesh] resource to use as a CSG shape.  
         *      
         *  **Note:** Some [Mesh] types such as [PlaneMesh], [PointMesh], [QuadMesh], and [RibbonTrailMesh] are excluded from the type hint for this property, as these primitives are non- *manifold*  and thus not compatible with the CSG algorithm.  
         *      
         *  **Note:** When using an [ArrayMesh], all vertex attributes except [constant Mesh.ARRAY_VERTEX], [constant Mesh.ARRAY_NORMAL] and [constant Mesh.ARRAY_TEX_UV] are left unused. Only [constant Mesh.ARRAY_VERTEX] and [constant Mesh.ARRAY_TEX_UV] will be passed to the GPU.  
         *  [constant Mesh.ARRAY_NORMAL] is only used to determine which faces require the use of flat shading. By default, CSGMesh will ignore the mesh's vertex normals, recalculate them for each vertex and use a smooth shader. If a flat shader is required for a face, ensure that all vertex normals of the face are approximately equal.  
         */
        get mesh(): Mesh | any /*-PlaneMesh*/ | any /*-PointMesh*/ | any /*-QuadMesh*/ | any /*-RibbonTrailMesh*/
        set mesh(value: Mesh | any /*-PlaneMesh*/ | any /*-PointMesh*/ | any /*-QuadMesh*/ | any /*-RibbonTrailMesh*/)
        
        /** The [Material] used in drawing the CSG shape. */
        get material(): BaseMaterial3D | ShaderMaterial
        set material(value: BaseMaterial3D | ShaderMaterial)
    }
    namespace CSGPolygon3D {
        enum Mode {
            /** The [member polygon] shape is extruded along the negative Z axis. */
            MODE_DEPTH = 0,
            
            /** The [member polygon] shape is extruded by rotating it around the Y axis. */
            MODE_SPIN = 1,
            
            /** The [member polygon] shape is extruded along the [Path3D] specified in [member path_node]. */
            MODE_PATH = 2,
        }
        enum PathRotation {
            /** The [member polygon] shape is not rotated.  
             *      
             *  **Note:** Requires the path Z coordinates to continually decrease to ensure viable shapes.  
             */
            PATH_ROTATION_POLYGON = 0,
            
            /** The [member polygon] shape is rotated along the path, but it is not rotated around the path axis.  
             *      
             *  **Note:** Requires the path Z coordinates to continually decrease to ensure viable shapes.  
             */
            PATH_ROTATION_PATH = 1,
            
            /** The [member polygon] shape follows the path and its rotations around the path axis. */
            PATH_ROTATION_PATH_FOLLOW = 2,
        }
        enum PathIntervalType {
            /** When [member mode] is set to [constant MODE_PATH], [member path_interval] will determine the distance, in meters, each interval of the path will extrude. */
            PATH_INTERVAL_DISTANCE = 0,
            
            /** When [member mode] is set to [constant MODE_PATH], [member path_interval] will subdivide the polygons along the path. */
            PATH_INTERVAL_SUBDIVIDE = 1,
        }
    }
    /** Extrudes a 2D polygon shape to create a 3D mesh.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_csgpolygon3d.html  
     */
    class CSGPolygon3D<Map extends Record<string, Node> = Record<string, Node>> extends CSGPrimitive3D<Map> {
        constructor(identifier?: any)
        _is_editable_3d_polygon(): boolean
        _has_editable_3d_polygon_no_depth(): boolean
        
        /** The point array that defines the 2D polygon that is extruded. This can be a convex or concave polygon with 3 or more points. The polygon must  *not*  have any intersecting edges. Otherwise, triangulation will fail and no mesh will be generated.  
         *      
         *  **Note:** If only 1 or 2 points are defined in [member polygon], no mesh will be generated.  
         */
        get polygon(): PackedVector2Array
        set polygon(value: PackedVector2Array | Vector2[])
        
        /** The [member mode] used to extrude the [member polygon]. */
        get mode(): int64
        set mode(value: int64)
        
        /** When [member mode] is [constant MODE_DEPTH], the depth of the extrusion. */
        get depth(): float64
        set depth(value: float64)
        
        /** When [member mode] is [constant MODE_SPIN], the total number of degrees the [member polygon] is rotated when extruding. */
        get spin_degrees(): float64
        set spin_degrees(value: float64)
        
        /** When [member mode] is [constant MODE_SPIN], the number of extrusions made. */
        get spin_sides(): int64
        set spin_sides(value: int64)
        
        /** When [member mode] is [constant MODE_PATH], the location of the [Path3D] object used to extrude the [member polygon]. */
        get path_node(): NodePath
        set path_node(value: NodePath | string)
        
        /** When [member mode] is [constant MODE_PATH], this will determine if the interval should be by distance ([constant PATH_INTERVAL_DISTANCE]) or subdivision fractions ([constant PATH_INTERVAL_SUBDIVIDE]). */
        get path_interval_type(): int64
        set path_interval_type(value: int64)
        
        /** When [member mode] is [constant MODE_PATH], the path interval or ratio of path points to extrusions. */
        get path_interval(): float64
        set path_interval(value: float64)
        
        /** When [member mode] is [constant MODE_PATH], extrusions that are less than this angle, will be merged together to reduce polygon count. */
        get path_simplify_angle(): float64
        set path_simplify_angle(value: float64)
        
        /** When [member mode] is [constant MODE_PATH], the path rotation method used to rotate the [member polygon] as it is extruded. */
        get path_rotation(): int64
        set path_rotation(value: int64)
        
        /** When [member mode] is [constant MODE_PATH], if `true` the polygon will be rotated according to the proper tangent of the path at the sampled points. If `false` an approximation is used, which decreases in accuracy as the number of subdivisions decreases. */
        get path_rotation_accurate(): boolean
        set path_rotation_accurate(value: boolean)
        
        /** When [member mode] is [constant MODE_PATH], if `true` the [Transform3D] of the [CSGPolygon3D] is used as the starting point for the extrusions, not the [Transform3D] of the [member path_node]. */
        get path_local(): boolean
        set path_local(value: boolean)
        
        /** When [member mode] is [constant MODE_PATH], by default, the top half of the [member material] is stretched along the entire length of the extruded shape. If `false` the top half of the material is repeated every step of the extrusion. */
        get path_continuous_u(): boolean
        set path_continuous_u(value: boolean)
        
        /** When [member mode] is [constant MODE_PATH], this is the distance along the path, in meters, the texture coordinates will tile. When set to 0, texture coordinates will match geometry exactly with no tiling. */
        get path_u_distance(): float64
        set path_u_distance(value: float64)
        
        /** When [member mode] is [constant MODE_PATH], if `true` the ends of the path are joined, by adding an extrusion between the last and first points of the path. */
        get path_joined(): boolean
        set path_joined(value: boolean)
        
        /** If `true`, applies smooth shading to the extrusions. */
        get smooth_faces(): boolean
        set smooth_faces(value: boolean)
        
        /** Material to use for the resulting mesh. The UV maps the top half of the material to the extruded shape (U along the length of the extrusions and V around the outline of the [member polygon]), the bottom-left quarter to the front end face, and the bottom-right quarter to the back end face. */
        get material(): BaseMaterial3D | ShaderMaterial
        set material(value: BaseMaterial3D | ShaderMaterial)
    }
    /** Base class for CSG primitives.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_csgprimitive3d.html  
     */
    class CSGPrimitive3D<Map extends Record<string, Node> = Record<string, Node>> extends CSGShape3D<Map> {
        constructor(identifier?: any)
        /** If set, the order of the vertices in each triangle are reversed resulting in the backside of the mesh being drawn. */
        get flip_faces(): boolean
        set flip_faces(value: boolean)
    }
    namespace CSGShape3D {
        enum Operation {
            /** Geometry of both primitives is merged, intersecting geometry is removed. */
            OPERATION_UNION = 0,
            
            /** Only intersecting geometry remains, the rest is removed. */
            OPERATION_INTERSECTION = 1,
            
            /** The second shape is subtracted from the first, leaving a dent with its shape. */
            OPERATION_SUBTRACTION = 2,
        }
    }
    /** The CSG base class.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_csgshape3d.html  
     */
    class CSGShape3D<Map extends Record<string, Node> = Record<string, Node>> extends GeometryInstance3D<Map> {
        constructor(identifier?: any)
        _update_shape(): void
        
        /** Returns `true` if this is a root shape and is thus the object that is rendered. */
        is_root_shape(): boolean
        
        /** Based on [param value], enables or disables the specified layer in the [member collision_mask], given a [param layer_number] between 1 and 32. */
        set_collision_mask_value(layer_number: int64, value: boolean): void
        
        /** Returns whether or not the specified layer of the [member collision_mask] is enabled, given a [param layer_number] between 1 and 32. */
        get_collision_mask_value(layer_number: int64): boolean
        _get_root_collision_instance(): RID
        
        /** Based on [param value], enables or disables the specified layer in the [member collision_layer], given a [param layer_number] between 1 and 32. */
        set_collision_layer_value(layer_number: int64, value: boolean): void
        
        /** Returns whether or not the specified layer of the [member collision_layer] is enabled, given a [param layer_number] between 1 and 32. */
        get_collision_layer_value(layer_number: int64): boolean
        
        /** Returns an [Array] with two elements, the first is the [Transform3D] of this node and the second is the root [Mesh] of this node. Only works when this node is the root shape. */
        get_meshes(): GArray
        
        /** Returns a baked static [ArrayMesh] of this node's CSG operation result. Materials from involved CSG nodes are added as extra mesh surfaces. Returns an empty mesh if the node is not a CSG root node or has no valid geometry. */
        bake_static_mesh(): ArrayMesh
        
        /** Returns a baked physics [ConcavePolygonShape3D] of this node's CSG operation result. Returns an empty shape if the node is not a CSG root node or has no valid geometry.  
         *  **Performance:** If the CSG operation results in a very detailed geometry with many faces physics performance will be very slow. Concave shapes should in general only be used for static level geometry and not with dynamic objects that are moving.  
         */
        bake_collision_shape(): ConcavePolygonShape3D
        
        /** The operation that is performed on this shape. This is ignored for the first CSG child node as the operation is between this node and the previous child of this nodes parent. */
        get operation(): int64
        set operation(value: int64)
        
        /** This property does nothing. */
        get snap(): float64
        set snap(value: float64)
        
        /** Calculate tangents for the CSG shape which allows the use of normal maps. This is only applied on the root shape, this setting is ignored on any child. */
        get calculate_tangents(): boolean
        set calculate_tangents(value: boolean)
        
        /** Adds a collision shape to the physics engine for our CSG shape. This will always act like a static body. Note that the collision shape is still active even if the CSG shape itself is hidden. See also [member collision_mask] and [member collision_priority]. */
        get use_collision(): boolean
        set use_collision(value: boolean)
        
        /** The physics layers this area is in.  
         *  Collidable objects can exist in any of 32 different layers. These layers work like a tagging system, and are not visual. A collidable can use these layers to select with which objects it can collide, using the collision_mask property.  
         *  A contact is detected if object A is in any of the layers that object B scans, or object B is in any layer scanned by object A. See [url=https://docs.godotengine.org/en/4.4/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information.  
         */
        get collision_layer(): int64
        set collision_layer(value: int64)
        
        /** The physics layers this CSG shape scans for collisions. Only effective if [member use_collision] is `true`. See [url=https://docs.godotengine.org/en/4.4/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information. */
        get collision_mask(): int64
        set collision_mask(value: int64)
        
        /** The priority used to solve colliding when occurring penetration. Only effective if [member use_collision] is `true`. The higher the priority is, the lower the penetration into the object will be. This can for example be used to prevent the player from breaking through the boundaries of a level. */
        get collision_priority(): float64
        set collision_priority(value: float64)
    }
    class CSGShape3DGizmoPlugin extends EditorNode3DGizmoPlugin {
        constructor(identifier?: any)
    }
    class CSGShapeEditor<Map extends Record<string, Node> = Record<string, Node>> extends Control<Map> {
        constructor(identifier?: any)
    }
    /** A CSG Sphere shape.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_csgsphere3d.html  
     */
    class CSGSphere3D<Map extends Record<string, Node> = Record<string, Node>> extends CSGPrimitive3D<Map> {
        constructor(identifier?: any)
        /** Radius of the sphere. */
        get radius(): float64
        set radius(value: float64)
        
        /** Number of vertical slices for the sphere. */
        get radial_segments(): int64
        set radial_segments(value: int64)
        
        /** Number of horizontal slices for the sphere. */
        get rings(): int64
        set rings(value: int64)
        
        /** If `true` the normals of the sphere are set to give a smooth effect making the sphere seem rounded. If `false` the sphere will have a flat shaded look. */
        get smooth_faces(): boolean
        set smooth_faces(value: boolean)
        
        /** The material used to render the sphere. */
        get material(): BaseMaterial3D | ShaderMaterial
        set material(value: BaseMaterial3D | ShaderMaterial)
    }
    /** A CSG Torus shape.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_csgtorus3d.html  
     */
    class CSGTorus3D<Map extends Record<string, Node> = Record<string, Node>> extends CSGPrimitive3D<Map> {
        constructor(identifier?: any)
        /** The inner radius of the torus. */
        get inner_radius(): float64
        set inner_radius(value: float64)
        
        /** The outer radius of the torus. */
        get outer_radius(): float64
        set outer_radius(value: float64)
        
        /** The number of slices the torus is constructed of. */
        get sides(): int64
        set sides(value: int64)
        
        /** The number of edges each ring of the torus is constructed of. */
        get ring_sides(): int64
        set ring_sides(value: int64)
        
        /** If `true` the normals of the torus are set to give a smooth effect making the torus seem rounded. If `false` the torus will have a flat shaded look. */
        get smooth_faces(): boolean
        set smooth_faces(value: boolean)
        
        /** The material used to render the torus. */
        get material(): BaseMaterial3D | ShaderMaterial
        set material(value: BaseMaterial3D | ShaderMaterial)
    }
    /** Calls the specified method after optional delay.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_callbacktweener.html  
     */
    class CallbackTweener extends Tweener {
        constructor(identifier?: any)
        /** Makes the callback call delayed by given time in seconds.  
         *  **Example:** Call [method Node.queue_free] after 2 seconds:  
         *    
         */
        set_delay(delay: float64): CallbackTweener
    }
    namespace Camera2D {
        enum AnchorMode {
            /** The camera's position is fixed so that the top-left corner is always at the origin. */
            ANCHOR_MODE_FIXED_TOP_LEFT = 0,
            
            /** The camera's position takes into account vertical/horizontal offsets and the screen size. */
            ANCHOR_MODE_DRAG_CENTER = 1,
        }
        enum Camera2DProcessCallback {
            /** The camera updates during physics frames (see [constant Node.NOTIFICATION_INTERNAL_PHYSICS_PROCESS]). */
            CAMERA2D_PROCESS_PHYSICS = 0,
            
            /** The camera updates during process frames (see [constant Node.NOTIFICATION_INTERNAL_PROCESS]). */
            CAMERA2D_PROCESS_IDLE = 1,
        }
    }
    /** Camera node for 2D scenes.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_camera2d.html  
     */
    class Camera2D<Map extends Record<string, Node> = Record<string, Node>> extends Node2D<Map> {
        constructor(identifier?: any)
        _update_scroll(): void
        
        /** Forces this [Camera2D] to become the current active one. [member enabled] must be `true`. */
        make_current(): void
        
        /** Returns `true` if this [Camera2D] is the active camera (see [method Viewport.get_camera_2d]). */
        is_current(): boolean
        _make_current(_unnamed_arg0: Object): void
        
        /** Sets the camera limit for the specified [enum Side]. See also [member limit_bottom], [member limit_top], [member limit_left], and [member limit_right]. */
        set_limit(margin: Side, limit: int64): void
        
        /** Returns the camera limit for the specified [enum Side]. See also [member limit_bottom], [member limit_top], [member limit_left], and [member limit_right]. */
        get_limit(margin: Side): int64
        
        /** Sets the specified [enum Side]'s margin. See also [member drag_bottom_margin], [member drag_top_margin], [member drag_left_margin], and [member drag_right_margin]. */
        set_drag_margin(margin: Side, drag_margin: float64): void
        
        /** Returns the specified [enum Side]'s margin. See also [member drag_bottom_margin], [member drag_top_margin], [member drag_left_margin], and [member drag_right_margin]. */
        get_drag_margin(margin: Side): float64
        
        /** Returns this camera's target position, in global coordinates.  
         *      
         *  **Note:** The returned value is not the same as [member Node2D.global_position], as it is affected by the drag properties. It is also not the same as the current position if [member position_smoothing_enabled] is `true` (see [method get_screen_center_position]).  
         */
        get_target_position(): Vector2
        
        /** Returns the center of the screen from this camera's point of view, in global coordinates.  
         *      
         *  **Note:** The exact targeted position of the camera may be different. See [method get_target_position].  
         */
        get_screen_center_position(): Vector2
        
        /** Forces the camera to update scroll immediately. */
        force_update_scroll(): void
        
        /** Sets the camera's position immediately to its current smoothing destination.  
         *  This method has no effect if [member position_smoothing_enabled] is `false`.  
         */
        reset_smoothing(): void
        
        /** Aligns the camera to the tracked node. */
        align(): void
        _set_old_smoothing(follow_smoothing: float64): void
        
        /** The camera's relative offset. Useful for looking around or camera shake animations. The offsetted camera can go past the limits defined in [member limit_top], [member limit_bottom], [member limit_left] and [member limit_right]. */
        get offset(): Vector2
        set offset(value: Vector2)
        
        /** The Camera2D's anchor point. See [enum AnchorMode] constants. */
        get anchor_mode(): int64
        set anchor_mode(value: int64)
        
        /** If `true`, the camera's rendered view is not affected by its [member Node2D.rotation] and [member Node2D.global_rotation]. */
        get ignore_rotation(): boolean
        set ignore_rotation(value: boolean)
        
        /** Controls whether the camera can be active or not. If `true`, the [Camera2D] will become the main camera when it enters the scene tree and there is no active camera currently (see [method Viewport.get_camera_2d]).  
         *  When the camera is currently active and [member enabled] is set to `false`, the next enabled [Camera2D] in the scene tree will become active.  
         */
        get enabled(): boolean
        set enabled(value: boolean)
        
        /** The camera's zoom. A zoom of `Vector(2, 2)` doubles the size seen in the viewport. A zoom of `Vector(0.5, 0.5)` halves the size seen in the viewport.  
         *      
         *  **Note:** [member FontFile.oversampling] does  *not*  take [Camera2D] zoom into account. This means that zooming in/out will cause bitmap fonts and rasterized (non-MSDF) dynamic fonts to appear blurry or pixelated unless the font is part of a [CanvasLayer] that makes it ignore camera zoom. To ensure text remains crisp regardless of zoom, you can enable MSDF font rendering by enabling [member ProjectSettings.gui/theme/default_font_multichannel_signed_distance_field] (applies to the default project font only), or enabling **Multichannel Signed Distance Field** in the import options of a DynamicFont for custom fonts. On system fonts, [member SystemFont.multichannel_signed_distance_field] can be enabled in the inspector.  
         */
        get zoom(): Vector2
        set zoom(value: Vector2)
        
        /** The custom [Viewport] node attached to the [Camera2D]. If `null` or not a [Viewport], uses the default viewport instead. */
        get custom_viewport(): Viewport
        set custom_viewport(value: Viewport)
        
        /** The camera's process callback. See [enum Camera2DProcessCallback]. */
        get process_callback(): int64
        set process_callback(value: int64)
        
        /** Left scroll limit in pixels. The camera stops moving when reaching this value, but [member offset] can push the view past the limit. */
        get limit_left(): int64
        set limit_left(value: int64)
        
        /** Top scroll limit in pixels. The camera stops moving when reaching this value, but [member offset] can push the view past the limit. */
        get limit_top(): int64
        set limit_top(value: int64)
        
        /** Right scroll limit in pixels. The camera stops moving when reaching this value, but [member offset] can push the view past the limit. */
        get limit_right(): int64
        set limit_right(value: int64)
        
        /** Bottom scroll limit in pixels. The camera stops moving when reaching this value, but [member offset] can push the view past the limit. */
        get limit_bottom(): int64
        set limit_bottom(value: int64)
        
        /** If `true`, the camera smoothly stops when reaches its limits.  
         *  This property has no effect if [member position_smoothing_enabled] is `false`.  
         *      
         *  **Note:** To immediately update the camera's position to be within limits without smoothing, even with this setting enabled, invoke [method reset_smoothing].  
         */
        get limit_smoothed(): boolean
        set limit_smoothed(value: boolean)
        
        /** If `true`, the camera's view smoothly moves towards its target position at [member position_smoothing_speed]. */
        get position_smoothing_enabled(): boolean
        set position_smoothing_enabled(value: boolean)
        
        /** Speed in pixels per second of the camera's smoothing effect when [member position_smoothing_enabled] is `true`. */
        get position_smoothing_speed(): float64
        set position_smoothing_speed(value: float64)
        
        /** If `true`, the camera's view smoothly rotates, via asymptotic smoothing, to align with its target rotation at [member rotation_smoothing_speed].  
         *      
         *  **Note:** This property has no effect if [member ignore_rotation] is `true`.  
         */
        get rotation_smoothing_enabled(): boolean
        set rotation_smoothing_enabled(value: boolean)
        
        /** The angular, asymptotic speed of the camera's rotation smoothing effect when [member rotation_smoothing_enabled] is `true`. */
        get rotation_smoothing_speed(): float64
        set rotation_smoothing_speed(value: float64)
        
        /** If `true`, the camera only moves when reaching the horizontal (left and right) drag margins. If `false`, the camera moves horizontally regardless of margins. */
        get drag_horizontal_enabled(): boolean
        set drag_horizontal_enabled(value: boolean)
        
        /** If `true`, the camera only moves when reaching the vertical (top and bottom) drag margins. If `false`, the camera moves vertically regardless of the drag margins. */
        get drag_vertical_enabled(): boolean
        set drag_vertical_enabled(value: boolean)
        
        /** The relative horizontal drag offset of the camera between the right (`-1`) and left (`1`) drag margins.  
         *      
         *  **Note:** Used to set the initial horizontal drag offset; determine the current offset; or force the current offset. It's not automatically updated when [member drag_horizontal_enabled] is `true` or the drag margins are changed.  
         */
        get drag_horizontal_offset(): float64
        set drag_horizontal_offset(value: float64)
        
        /** The relative vertical drag offset of the camera between the bottom (`-1`) and top (`1`) drag margins.  
         *      
         *  **Note:** Used to set the initial vertical drag offset; determine the current offset; or force the current offset. It's not automatically updated when [member drag_vertical_enabled] is `true` or the drag margins are changed.  
         */
        get drag_vertical_offset(): float64
        set drag_vertical_offset(value: float64)
        
        /** Left margin needed to drag the camera. A value of `1` makes the camera move only when reaching the left edge of the screen. */
        get drag_left_margin(): float64
        set drag_left_margin(value: float64)
        
        /** Top margin needed to drag the camera. A value of `1` makes the camera move only when reaching the top edge of the screen. */
        get drag_top_margin(): float64
        set drag_top_margin(value: float64)
        
        /** Right margin needed to drag the camera. A value of `1` makes the camera move only when reaching the right edge of the screen. */
        get drag_right_margin(): float64
        set drag_right_margin(value: float64)
        
        /** Bottom margin needed to drag the camera. A value of `1` makes the camera move only when reaching the bottom edge of the screen. */
        get drag_bottom_margin(): float64
        set drag_bottom_margin(value: float64)
        
        /** If `true`, draws the camera's screen rectangle in the editor. */
        get editor_draw_screen(): boolean
        set editor_draw_screen(value: boolean)
        
        /** If `true`, draws the camera's limits rectangle in the editor. */
        get editor_draw_limits(): boolean
        set editor_draw_limits(value: boolean)
        
        /** If `true`, draws the camera's drag margin rectangle in the editor. */
        get editor_draw_drag_margin(): boolean
        set editor_draw_drag_margin(value: boolean)
    }
    namespace Camera3D {
        enum ProjectionType {
            /** Perspective projection. Objects on the screen becomes smaller when they are far away. */
            PROJECTION_PERSPECTIVE = 0,
            
            /** Orthogonal projection, also known as orthographic projection. Objects remain the same size on the screen no matter how far away they are. */
            PROJECTION_ORTHOGONAL = 1,
            
            /** Frustum projection. This mode allows adjusting [member frustum_offset] to create "tilted frustum" effects. */
            PROJECTION_FRUSTUM = 2,
        }
        enum KeepAspect {
            /** Preserves the horizontal aspect ratio; also known as Vert- scaling. This is usually the best option for projects running in portrait mode, as taller aspect ratios will benefit from a wider vertical FOV. */
            KEEP_WIDTH = 0,
            
            /** Preserves the vertical aspect ratio; also known as Hor+ scaling. This is usually the best option for projects running in landscape mode, as wider aspect ratios will automatically benefit from a wider horizontal FOV. */
            KEEP_HEIGHT = 1,
        }
        enum DopplerTracking {
            /** Disables [url=https://en.wikipedia.org/wiki/Doppler_effect]Doppler effect[/url] simulation (default). */
            DOPPLER_TRACKING_DISABLED = 0,
            
            /** Simulate [url=https://en.wikipedia.org/wiki/Doppler_effect]Doppler effect[/url] by tracking positions of objects that are changed in `_process`. Changes in the relative velocity of this camera compared to those objects affect how audio is perceived (changing the audio's [member AudioStreamPlayer3D.pitch_scale]). */
            DOPPLER_TRACKING_IDLE_STEP = 1,
            
            /** Simulate [url=https://en.wikipedia.org/wiki/Doppler_effect]Doppler effect[/url] by tracking positions of objects that are changed in `_physics_process`. Changes in the relative velocity of this camera compared to those objects affect how audio is perceived (changing the audio's [member AudioStreamPlayer3D.pitch_scale]). */
            DOPPLER_TRACKING_PHYSICS_STEP = 2,
        }
    }
    /** Camera node, displays from a point of view.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_camera3d.html  
     */
    class Camera3D<Map extends Record<string, Node> = Record<string, Node>> extends Node3D<Map> {
        constructor(identifier?: any)
        /** Returns a normal vector in world space, that is the result of projecting a point on the [Viewport] rectangle by the inverse camera projection. This is useful for casting rays in the form of (origin, normal) for object intersection or picking. */
        project_ray_normal(screen_point: Vector2): Vector3
        
        /** Returns a normal vector from the screen point location directed along the camera. Orthogonal cameras are normalized. Perspective cameras account for perspective, screen width/height, etc. */
        project_local_ray_normal(screen_point: Vector2): Vector3
        
        /** Returns a 3D position in world space, that is the result of projecting a point on the [Viewport] rectangle by the inverse camera projection. This is useful for casting rays in the form of (origin, normal) for object intersection or picking. */
        project_ray_origin(screen_point: Vector2): Vector3
        
        /** Returns the 2D coordinate in the [Viewport] rectangle that maps to the given 3D point in world space.  
         *      
         *  **Note:** When using this to position GUI elements over a 3D viewport, use [method is_position_behind] to prevent them from appearing if the 3D point is behind the camera:  
         *    
         */
        unproject_position(world_point: Vector3): Vector2
        
        /** Returns `true` if the given position is behind the camera (the blue part of the linked diagram). [url=https://raw.githubusercontent.com/godotengine/godot-docs/master/img/camera3d_position_frustum.png]See this diagram[/url] for an overview of position query methods.  
         *      
         *  **Note:** A position which returns `false` may still be outside the camera's field of view.  
         */
        is_position_behind(world_point: Vector3): boolean
        
        /** Returns the 3D point in world space that maps to the given 2D coordinate in the [Viewport] rectangle on a plane that is the given [param z_depth] distance into the scene away from the camera. */
        project_position(screen_point: Vector2, z_depth: float64): Vector3
        
        /** Sets the camera projection to perspective mode (see [constant PROJECTION_PERSPECTIVE]), by specifying a [param fov] (field of view) angle in degrees, and the [param z_near] and [param z_far] clip planes in world space units. */
        set_perspective(fov: float64, z_near: float64, z_far: float64): void
        
        /** Sets the camera projection to orthogonal mode (see [constant PROJECTION_ORTHOGONAL]), by specifying a [param size], and the [param z_near] and [param z_far] clip planes in world space units. (As a hint, 2D games often use this projection, with values specified in pixels.) */
        set_orthogonal(size: float64, z_near: float64, z_far: float64): void
        
        /** Sets the camera projection to frustum mode (see [constant PROJECTION_FRUSTUM]), by specifying a [param size], an [param offset], and the [param z_near] and [param z_far] clip planes in world space units. See also [member frustum_offset]. */
        set_frustum(size: float64, offset: Vector2, z_near: float64, z_far: float64): void
        
        /** Makes this camera the current camera for the [Viewport] (see class description). If the camera node is outside the scene tree, it will attempt to become current once it's added. */
        make_current(): void
        
        /** If this is the current camera, remove it from being current. If [param enable_next] is `true`, request to make the next camera current, if any. */
        clear_current(enable_next: boolean = true): void
        
        /** Returns the transform of the camera plus the vertical ([member v_offset]) and horizontal ([member h_offset]) offsets; and any other adjustments made to the position and orientation of the camera by subclassed cameras such as [XRCamera3D]. */
        get_camera_transform(): Transform3D
        
        /** Returns the projection matrix that this camera uses to render to its associated viewport. The camera must be part of the scene tree to function. */
        get_camera_projection(): Projection
        
        /** Returns the camera's frustum planes in world space units as an array of [Plane]s in the following order: near, far, left, top, right, bottom. Not to be confused with [member frustum_offset]. */
        get_frustum(): GArray
        
        /** Returns `true` if the given position is inside the camera's frustum (the green part of the linked diagram). [url=https://raw.githubusercontent.com/godotengine/godot-docs/master/img/camera3d_position_frustum.png]See this diagram[/url] for an overview of position query methods. */
        is_position_in_frustum(world_point: Vector3): boolean
        
        /** Returns the camera's RID from the [RenderingServer]. */
        get_camera_rid(): RID
        
        /** Returns the RID of a pyramid shape encompassing the camera's view frustum, ignoring the camera's near plane. The tip of the pyramid represents the position of the camera. */
        get_pyramid_shape_rid(): RID
        
        /** Based on [param value], enables or disables the specified layer in the [member cull_mask], given a [param layer_number] between 1 and 20. */
        set_cull_mask_value(layer_number: int64, value: boolean): void
        
        /** Returns whether or not the specified layer of the [member cull_mask] is enabled, given a [param layer_number] between 1 and 20. */
        get_cull_mask_value(layer_number: int64): boolean
        
        /** The axis to lock during [member fov]/[member size] adjustments. Can be either [constant KEEP_WIDTH] or [constant KEEP_HEIGHT]. */
        get keep_aspect(): int64
        set keep_aspect(value: int64)
        
        /** The culling mask that describes which [member VisualInstance3D.layers] are rendered by this camera. By default, all 20 user-visible layers are rendered.  
         *      
         *  **Note:** Since the [member cull_mask] allows for 32 layers to be stored in total, there are an additional 12 layers that are only used internally by the engine and aren't exposed in the editor. Setting [member cull_mask] using a script allows you to toggle those reserved layers, which can be useful for editor plugins.  
         *  To adjust [member cull_mask] more easily using a script, use [method get_cull_mask_value] and [method set_cull_mask_value].  
         *      
         *  **Note:** [VoxelGI], SDFGI and [LightmapGI] will always take all layers into account to determine what contributes to global illumination. If this is an issue, set [member GeometryInstance3D.gi_mode] to [constant GeometryInstance3D.GI_MODE_DISABLED] for meshes and [member Light3D.light_bake_mode] to [constant Light3D.BAKE_DISABLED] for lights to exclude them from global illumination.  
         */
        get cull_mask(): int64
        set cull_mask(value: int64)
        
        /** The [Environment] to use for this camera. */
        get environment(): Environment
        set environment(value: Environment)
        
        /** The [CameraAttributes] to use for this camera. */
        get attributes(): CameraAttributesPractical | CameraAttributesPhysical
        set attributes(value: CameraAttributesPractical | CameraAttributesPhysical)
        
        /** The [Compositor] to use for this camera. */
        get compositor(): Compositor
        set compositor(value: Compositor)
        
        /** The horizontal (X) offset of the camera viewport. */
        get h_offset(): float64
        set h_offset(value: float64)
        
        /** The vertical (Y) offset of the camera viewport. */
        get v_offset(): float64
        set v_offset(value: float64)
        
        /** If not [constant DOPPLER_TRACKING_DISABLED], this camera will simulate the [url=https://en.wikipedia.org/wiki/Doppler_effect]Doppler effect[/url] for objects changed in particular `_process` methods. See [enum DopplerTracking] for possible values. */
        get doppler_tracking(): int64
        set doppler_tracking(value: int64)
        
        /** The camera's projection mode. In [constant PROJECTION_PERSPECTIVE] mode, objects' Z distance from the camera's local space scales their perceived size. */
        get projection(): int64
        set projection(value: int64)
        
        /** If `true`, the ancestor [Viewport] is currently using this camera.  
         *  If multiple cameras are in the scene, one will always be made current. For example, if two [Camera3D] nodes are present in the scene and only one is current, setting one camera's [member current] to `false` will cause the other camera to be made current.  
         */
        get current(): boolean
        set current(value: boolean)
        
        /** The camera's field of view angle (in degrees). Only applicable in perspective mode. Since [member keep_aspect] locks one axis, [member fov] sets the other axis' field of view angle.  
         *  For reference, the default vertical field of view value (`75.0`) is equivalent to a horizontal FOV of:  
         *  - ~91.31 degrees in a 4:3 viewport  
         *  - ~101.67 degrees in a 16:10 viewport  
         *  - ~107.51 degrees in a 16:9 viewport  
         *  - ~121.63 degrees in a 21:9 viewport  
         */
        get fov(): float64
        set fov(value: float64)
        
        /** The camera's size in meters measured as the diameter of the width or height, depending on [member keep_aspect]. Only applicable in orthogonal and frustum modes. */
        get size(): float64
        set size(value: float64)
        
        /** The camera's frustum offset. This can be changed from the default to create "tilted frustum" effects such as [url=https://zdoom.org/wiki/Y-shearing]Y-shearing[/url].  
         *      
         *  **Note:** Only effective if [member projection] is [constant PROJECTION_FRUSTUM].  
         */
        get frustum_offset(): Vector2
        set frustum_offset(value: Vector2)
        
        /** The distance to the near culling boundary for this camera relative to its local Z axis. Lower values allow the camera to see objects more up close to its origin, at the cost of lower precision across the  *entire*  range. Values lower than the default can lead to increased Z-fighting. */
        get near(): float64
        set near(value: float64)
        
        /** The distance to the far culling boundary for this camera relative to its local Z axis. Higher values allow the camera to see further away, while decreasing [member far] can improve performance if it results in objects being partially or fully culled. */
        get far(): float64
        set far(value: float64)
    }
    class Camera3DEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    class Camera3DGizmoPlugin extends EditorNode3DGizmoPlugin {
        constructor(identifier?: any)
    }
    /** Parent class for camera settings.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_cameraattributes.html  
     */
    class CameraAttributes extends Resource {
        constructor(identifier?: any)
        /** Sensitivity of camera sensors, measured in ISO. A higher sensitivity results in a brighter image.  
         *  If [member auto_exposure_enabled] is `true`, this can be used as a method of exposure compensation, doubling the value will increase the exposure value (measured in EV100) by 1 stop.  
         *      
         *  **Note:** Only available when [member ProjectSettings.rendering/lights_and_shadows/use_physical_light_units] is enabled.  
         */
        get exposure_sensitivity(): float64
        set exposure_sensitivity(value: float64)
        
        /** Multiplier for the exposure amount. A higher value results in a brighter image. */
        get exposure_multiplier(): float64
        set exposure_multiplier(value: float64)
        
        /** If `true`, enables the tonemapping auto exposure mode of the scene renderer. If `true`, the renderer will automatically determine the exposure setting to adapt to the scene's illumination and the observed light. */
        get auto_exposure_enabled(): boolean
        set auto_exposure_enabled(value: boolean)
        
        /** The scale of the auto exposure effect. Affects the intensity of auto exposure. */
        get auto_exposure_scale(): float64
        set auto_exposure_scale(value: float64)
        
        /** The speed of the auto exposure effect. Affects the time needed for the camera to perform auto exposure. */
        get auto_exposure_speed(): float64
        set auto_exposure_speed(value: float64)
    }
    /** Physically-based camera settings.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_cameraattributesphysical.html  
     */
    class CameraAttributesPhysical extends CameraAttributes {
        constructor(identifier?: any)
        /** Returns the vertical field of view that corresponds to the [member frustum_focal_length]. This value is calculated internally whenever [member frustum_focal_length] is changed. */
        get_fov(): float64
        
        /** Distance from camera of object that will be in focus, measured in meters. Internally this will be clamped to be at least 1 millimeter larger than [member frustum_focal_length]. */
        get frustum_focus_distance(): float64
        set frustum_focus_distance(value: float64)
        
        /** Distance between camera lens and camera aperture, measured in millimeters. Controls field of view and depth of field. A larger focal length will result in a smaller field of view and a narrower depth of field meaning fewer objects will be in focus. A smaller focal length will result in a wider field of view and a larger depth of field meaning more objects will be in focus. When attached to a [Camera3D] as its [member Camera3D.attributes], it will override the [member Camera3D.fov] property and the [member Camera3D.keep_aspect] property. */
        get frustum_focal_length(): float64
        set frustum_focal_length(value: float64)
        
        /** Override value for [member Camera3D.near]. Used internally when calculating depth of field. When attached to a [Camera3D] as its [member Camera3D.attributes], it will override the [member Camera3D.near] property. */
        get frustum_near(): float64
        set frustum_near(value: float64)
        
        /** Override value for [member Camera3D.far]. Used internally when calculating depth of field. When attached to a [Camera3D] as its [member Camera3D.attributes], it will override the [member Camera3D.far] property. */
        get frustum_far(): float64
        set frustum_far(value: float64)
        
        /** Size of the aperture of the camera, measured in f-stops. An f-stop is a unitless ratio between the focal length of the camera and the diameter of the aperture. A high aperture setting will result in a smaller aperture which leads to a dimmer image and sharper focus. A low aperture results in a wide aperture which lets in more light resulting in a brighter, less-focused image. Default is appropriate for outdoors at daytime (i.e. for use with a default [DirectionalLight3D]), for indoor lighting, a value between 2 and 4 is more appropriate.  
         *  Only available when [member ProjectSettings.rendering/lights_and_shadows/use_physical_light_units] is enabled.  
         */
        get exposure_aperture(): float64
        set exposure_aperture(value: float64)
        
        /** Time for shutter to open and close, evaluated as `1 / shutter_speed` seconds. A higher value will allow less light (leading to a darker image), while a lower value will allow more light (leading to a brighter image).  
         *  Only available when [member ProjectSettings.rendering/lights_and_shadows/use_physical_light_units] is enabled.  
         */
        get exposure_shutter_speed(): float64
        set exposure_shutter_speed(value: float64)
        
        /** The minimum luminance (in EV100) used when calculating auto exposure. When calculating scene average luminance, color values will be clamped to at least this value. This limits the auto-exposure from exposing above a certain brightness, resulting in a cut off point where the scene will remain dark. */
        get auto_exposure_min_exposure_value(): float64
        set auto_exposure_min_exposure_value(value: float64)
        
        /** The maximum luminance (in EV100) used when calculating auto exposure. When calculating scene average luminance, color values will be clamped to at least this value. This limits the auto-exposure from exposing below a certain brightness, resulting in a cut off point where the scene will remain bright. */
        get auto_exposure_max_exposure_value(): float64
        set auto_exposure_max_exposure_value(value: float64)
    }
    /** Camera settings in an easy to use format.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_cameraattributespractical.html  
     */
    class CameraAttributesPractical extends CameraAttributes {
        constructor(identifier?: any)
        /** Enables depth of field blur for objects further than [member dof_blur_far_distance]. Strength of blur is controlled by [member dof_blur_amount] and modulated by [member dof_blur_far_transition].  
         *      
         *  **Note:** Depth of field blur is only supported in the Forward+ and Mobile rendering methods, not Compatibility.  
         */
        get dof_blur_far_enabled(): boolean
        set dof_blur_far_enabled(value: boolean)
        
        /** Objects further from the [Camera3D] by this amount will be blurred by the depth of field effect. Measured in meters. */
        get dof_blur_far_distance(): float64
        set dof_blur_far_distance(value: float64)
        
        /** When positive, distance over which (starting from [member dof_blur_far_distance]) blur effect will scale from 0 to [member dof_blur_amount]. When negative, uses physically-based scaling so depth of field effect will scale from 0 at [member dof_blur_far_distance] and will increase in a physically accurate way as objects get further from the [Camera3D]. */
        get dof_blur_far_transition(): float64
        set dof_blur_far_transition(value: float64)
        
        /** Enables depth of field blur for objects closer than [member dof_blur_near_distance]. Strength of blur is controlled by [member dof_blur_amount] and modulated by [member dof_blur_near_transition].  
         *      
         *  **Note:** Depth of field blur is only supported in the Forward+ and Mobile rendering methods, not Compatibility.  
         */
        get dof_blur_near_enabled(): boolean
        set dof_blur_near_enabled(value: boolean)
        
        /** Objects closer from the [Camera3D] by this amount will be blurred by the depth of field effect. Measured in meters. */
        get dof_blur_near_distance(): float64
        set dof_blur_near_distance(value: float64)
        
        /** When positive, distance over which blur effect will scale from 0 to [member dof_blur_amount], ending at [member dof_blur_near_distance]. When negative, uses physically-based scaling so depth of field effect will scale from 0 at [member dof_blur_near_distance] and will increase in a physically accurate way as objects get closer to the [Camera3D]. */
        get dof_blur_near_transition(): float64
        set dof_blur_near_transition(value: float64)
        
        /** Sets the maximum amount of blur. When using physically-based blur amounts, will instead act as a multiplier. High values lead to an increased amount of blurriness, but can be much more expensive to calculate. It is best to keep this as low as possible for a given art style. */
        get dof_blur_amount(): float64
        set dof_blur_amount(value: float64)
        
        /** The minimum sensitivity (in ISO) used when calculating auto exposure. When calculating scene average luminance, color values will be clamped to at least this value. This limits the auto-exposure from exposing above a certain brightness, resulting in a cut off point where the scene will remain dark. */
        get auto_exposure_min_sensitivity(): float64
        set auto_exposure_min_sensitivity(value: float64)
        
        /** The maximum sensitivity (in ISO) used when calculating auto exposure. When calculating scene average luminance, color values will be clamped to at least this value. This limits the auto-exposure from exposing below a certain brightness, resulting in a cut off point where the scene will remain bright. */
        get auto_exposure_max_sensitivity(): float64
        set auto_exposure_max_sensitivity(value: float64)
    }
    namespace CameraFeed {
        enum FeedDataType {
            /** No image set for the feed. */
            FEED_NOIMAGE = 0,
            
            /** Feed supplies RGB images. */
            FEED_RGB = 1,
            
            /** Feed supplies YCbCr images that need to be converted to RGB. */
            FEED_YCBCR = 2,
            
            /** Feed supplies separate Y and CbCr images that need to be combined and converted to RGB. */
            FEED_YCBCR_SEP = 3,
            
            /** Feed supplies external image. */
            FEED_EXTERNAL = 4,
        }
        enum FeedPosition {
            /** Unspecified position. */
            FEED_UNSPECIFIED = 0,
            
            /** Camera is mounted at the front of the device. */
            FEED_FRONT = 1,
            
            /** Camera is mounted at the back of the device. */
            FEED_BACK = 2,
        }
    }
    /** A camera feed gives you access to a single physical camera attached to your device.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_camerafeed.html  
     */
    class CameraFeed extends RefCounted {
        constructor(identifier?: any)
        /** Called when the camera feed is activated. */
        /* gdvirtual */ _activate_feed(): boolean
        
        /** Called when the camera feed is deactivated. */
        /* gdvirtual */ _deactivate_feed(): void
        
        /** Returns the unique ID for this feed. */
        get_id(): int64
        
        /** Returns the camera's name. */
        get_name(): string
        
        /** Sets the camera's name. */
        set_name(name: string): void
        
        /** Returns the position of camera on the device. */
        get_position(): CameraFeed.FeedPosition
        
        /** Sets the position of this camera. */
        set_position(position: CameraFeed.FeedPosition): void
        
        /** Sets RGB image for this feed. */
        set_rgb_image(rgb_image: Image): void
        
        /** Sets YCbCr image for this feed. */
        set_ycbcr_image(ycbcr_image: Image): void
        
        /** Sets the feed as external feed provided by another library. */
        set_external(width: int64, height: int64): void
        
        /** Returns the texture backend ID (usable by some external libraries that need a handle to a texture to write data). */
        get_texture_tex_id(feed_image_type: CameraServer.FeedImage): int64
        
        /** Returns feed image data type. */
        get_datatype(): CameraFeed.FeedDataType
        
        /** Sets the feed format parameters for the given index in the [member formats] array. Returns `true` on success. By default YUYV encoded stream is transformed to FEED_RGB. YUYV encoded stream output format can be changed with [param parameters].output value:  
         *  `separate` will result in FEED_YCBCR_SEP  
         *  `grayscale` will result in desaturated FEED_RGB  
         *  `copy` will result in FEED_YCBCR  
         */
        set_format(index: int64, parameters: GDictionary): boolean
        
        /** If `true`, the feed is active. */
        get feed_is_active(): boolean
        set feed_is_active(value: boolean)
        
        /** The transform applied to the camera's image. */
        get feed_transform(): Transform2D
        set feed_transform(value: Transform2D)
        
        /** Formats supported by the feed. Each entry is a [Dictionary] describing format parameters. */
        get formats(): GArray
        
        /** Emitted when a new frame is available. */
        readonly frame_changed: Signal0
        
        /** Emitted when the format has changed. */
        readonly format_changed: Signal0
    }
    /** Texture provided by a [CameraFeed].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_cameratexture.html  
     */
    class CameraTexture extends Texture2D {
        constructor(identifier?: any)
        /** The ID of the [CameraFeed] for which we want to display the image. */
        get camera_feed_id(): int64
        set camera_feed_id(value: int64)
        
        /** Which image within the [CameraFeed] we want access to, important if the camera image is split in a Y and CbCr component. */
        get which_feed(): int64
        set which_feed(value: int64)
        
        /** Convenience property that gives access to the active property of the [CameraFeed]. */
        get camera_is_active(): boolean
        set camera_is_active(value: boolean)
    }
    /** Merges several 2D nodes into a single draw operation.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_canvasgroup.html  
     */
    class CanvasGroup<Map extends Record<string, Node> = Record<string, Node>> extends Node2D<Map> {
        constructor(identifier?: any)
        /** Sets the size of a margin used to expand the drawable rect of this [CanvasGroup]. The size of the [CanvasGroup] is determined by fitting a rect around its children then expanding that rect by [member fit_margin]. This increases both the backbuffer area used and the area covered by the [CanvasGroup] both of which can reduce performance. This should be kept as small as possible and should only be expanded when an increased size is needed (e.g. for custom shader effects). */
        get fit_margin(): float64
        set fit_margin(value: float64)
        
        /** Sets the size of the margin used to expand the clearing rect of this [CanvasGroup]. This expands the area of the backbuffer that will be used by the [CanvasGroup]. A smaller margin will reduce the area of the backbuffer used which can increase performance, however if [member use_mipmaps] is enabled, a small margin may result in mipmap errors at the edge of the [CanvasGroup]. Accordingly, this should be left as small as possible, but should be increased if artifacts appear along the edges of the canvas group. */
        get clear_margin(): float64
        set clear_margin(value: float64)
        
        /** If `true`, calculates mipmaps for the backbuffer before drawing the [CanvasGroup] so that mipmaps can be used in a custom [ShaderMaterial] attached to the [CanvasGroup]. Generating mipmaps has a performance cost so this should not be enabled unless required. */
        get use_mipmaps(): boolean
        set use_mipmaps(value: boolean)
    }
    namespace CanvasItem {
        enum TextureFilter {
            /** The [CanvasItem] will inherit the filter from its parent. */
            TEXTURE_FILTER_PARENT_NODE = 0,
            
            /** The texture filter reads from the nearest pixel only. This makes the texture look pixelated from up close, and grainy from a distance (due to mipmaps not being sampled). */
            TEXTURE_FILTER_NEAREST = 1,
            
            /** The texture filter blends between the nearest 4 pixels. This makes the texture look smooth from up close, and grainy from a distance (due to mipmaps not being sampled). */
            TEXTURE_FILTER_LINEAR = 2,
            
            /** The texture filter reads from the nearest pixel and blends between the nearest 2 mipmaps (or uses the nearest mipmap if [member ProjectSettings.rendering/textures/default_filters/use_nearest_mipmap_filter] is `true`). This makes the texture look pixelated from up close, and smooth from a distance.  
             *  Use this for non-pixel art textures that may be viewed at a low scale (e.g. due to [Camera2D] zoom or sprite scaling), as mipmaps are important to smooth out pixels that are smaller than on-screen pixels.  
             */
            TEXTURE_FILTER_NEAREST_WITH_MIPMAPS = 3,
            
            /** The texture filter blends between the nearest 4 pixels and between the nearest 2 mipmaps (or uses the nearest mipmap if [member ProjectSettings.rendering/textures/default_filters/use_nearest_mipmap_filter] is `true`). This makes the texture look smooth from up close, and smooth from a distance.  
             *  Use this for non-pixel art textures that may be viewed at a low scale (e.g. due to [Camera2D] zoom or sprite scaling), as mipmaps are important to smooth out pixels that are smaller than on-screen pixels.  
             */
            TEXTURE_FILTER_LINEAR_WITH_MIPMAPS = 4,
            
            /** The texture filter reads from the nearest pixel and blends between 2 mipmaps (or uses the nearest mipmap if [member ProjectSettings.rendering/textures/default_filters/use_nearest_mipmap_filter] is `true`) based on the angle between the surface and the camera view. This makes the texture look pixelated from up close, and smooth from a distance. Anisotropic filtering improves texture quality on surfaces that are almost in line with the camera, but is slightly slower. The anisotropic filtering level can be changed by adjusting [member ProjectSettings.rendering/textures/default_filters/anisotropic_filtering_level].  
             *      
             *  **Note:** This texture filter is rarely useful in 2D projects. [constant TEXTURE_FILTER_NEAREST_WITH_MIPMAPS] is usually more appropriate in this case.  
             */
            TEXTURE_FILTER_NEAREST_WITH_MIPMAPS_ANISOTROPIC = 5,
            
            /** The texture filter blends between the nearest 4 pixels and blends between 2 mipmaps (or uses the nearest mipmap if [member ProjectSettings.rendering/textures/default_filters/use_nearest_mipmap_filter] is `true`) based on the angle between the surface and the camera view. This makes the texture look smooth from up close, and smooth from a distance. Anisotropic filtering improves texture quality on surfaces that are almost in line with the camera, but is slightly slower. The anisotropic filtering level can be changed by adjusting [member ProjectSettings.rendering/textures/default_filters/anisotropic_filtering_level].  
             *      
             *  **Note:** This texture filter is rarely useful in 2D projects. [constant TEXTURE_FILTER_LINEAR_WITH_MIPMAPS] is usually more appropriate in this case.  
             */
            TEXTURE_FILTER_LINEAR_WITH_MIPMAPS_ANISOTROPIC = 6,
            
            /** Represents the size of the [enum TextureFilter] enum. */
            TEXTURE_FILTER_MAX = 7,
        }
        enum TextureRepeat {
            /** The [CanvasItem] will inherit the filter from its parent. */
            TEXTURE_REPEAT_PARENT_NODE = 0,
            
            /** Texture will not repeat. */
            TEXTURE_REPEAT_DISABLED = 1,
            
            /** Texture will repeat normally. */
            TEXTURE_REPEAT_ENABLED = 2,
            
            /** Texture will repeat in a 2×2 tiled mode, where elements at even positions are mirrored. */
            TEXTURE_REPEAT_MIRROR = 3,
            
            /** Represents the size of the [enum TextureRepeat] enum. */
            TEXTURE_REPEAT_MAX = 4,
        }
        enum ClipChildrenMode {
            /** Child draws over parent and is not clipped. */
            CLIP_CHILDREN_DISABLED = 0,
            
            /** Parent is used for the purposes of clipping only. Child is clipped to the parent's visible area, parent is not drawn. */
            CLIP_CHILDREN_ONLY = 1,
            
            /** Parent is used for clipping child, but parent is also drawn underneath child as normal before clipping child to its visible area. */
            CLIP_CHILDREN_AND_DRAW = 2,
            
            /** Represents the size of the [enum ClipChildrenMode] enum. */
            CLIP_CHILDREN_MAX = 3,
        }
    }
    /** Abstract base class for everything in 2D space.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_canvasitem.html  
     */
    class CanvasItem<Map extends Record<string, Node> = Record<string, Node>> extends Node<Map> {
        /** The [CanvasItem]'s global transform has changed. This notification is only received if enabled by [method set_notify_transform]. */
        static readonly NOTIFICATION_TRANSFORM_CHANGED = 2000
        
        /** The [CanvasItem]'s local transform has changed. This notification is only received if enabled by [method set_notify_local_transform]. */
        static readonly NOTIFICATION_LOCAL_TRANSFORM_CHANGED = 35
        
        /** The [CanvasItem] is requested to draw (see [method _draw]). */
        static readonly NOTIFICATION_DRAW = 30
        
        /** The [CanvasItem]'s visibility has changed. */
        static readonly NOTIFICATION_VISIBILITY_CHANGED = 31
        
        /** The [CanvasItem] has entered the canvas. */
        static readonly NOTIFICATION_ENTER_CANVAS = 32
        
        /** The [CanvasItem] has exited the canvas. */
        static readonly NOTIFICATION_EXIT_CANVAS = 33
        
        /** The [CanvasItem]'s active [World2D] changed. */
        static readonly NOTIFICATION_WORLD_2D_CHANGED = 36
        constructor(identifier?: any)
        
        /** Called when [CanvasItem] has been requested to redraw (after [method queue_redraw] is called, either manually or by the engine).  
         *  Corresponds to the [constant NOTIFICATION_DRAW] notification in [method Object._notification].  
         */
        /* gdvirtual */ _draw(): void
        _top_level_raise_self(): void
        _edit_set_state(state: GDictionary): void
        _edit_get_state(): GDictionary
        _edit_set_position(position: Vector2): void
        _edit_get_position(): Vector2
        _edit_set_scale(scale: Vector2): void
        _edit_get_scale(): Vector2
        _edit_set_rect(rect: Rect2): void
        _edit_get_rect(): Rect2
        _edit_use_rect(): boolean
        _edit_set_rotation(degrees: float64): void
        _edit_get_rotation(): float64
        _edit_use_rotation(): boolean
        _edit_set_pivot(pivot: Vector2): void
        _edit_get_pivot(): Vector2
        _edit_use_pivot(): boolean
        _edit_get_transform(): Transform2D
        
        /** Returns the canvas item RID used by [RenderingServer] for this item. */
        get_canvas_item(): RID
        
        /** Returns `true` if the node is present in the [SceneTree], its [member visible] property is `true` and all its ancestors are also visible. If any ancestor is hidden, this node will not be visible in the scene tree, and is therefore not drawn (see [method _draw]).  
         *  Visibility is checked only in parent nodes that inherit from [CanvasItem], [CanvasLayer], and [Window]. If the parent is of any other type (such as [Node], [AnimationPlayer], or [Node3D]), it is assumed to be visible.  
         *      
         *  **Note:** This method does not take [member visibility_layer] into account, so even if this method returns `true`, the node might end up not being rendered.  
         */
        is_visible_in_tree(): boolean
        
        /** Show the [CanvasItem] if it's currently hidden. This is equivalent to setting [member visible] to `true`. For controls that inherit [Popup], the correct way to make them visible is to call one of the multiple `popup*()` functions instead. */
        show(): void
        
        /** Hide the [CanvasItem] if it's currently visible. This is equivalent to setting [member visible] to `false`. */
        hide(): void
        
        /** Queues the [CanvasItem] to redraw. During idle time, if [CanvasItem] is visible, [constant NOTIFICATION_DRAW] is sent and [method _draw] is called. This only occurs **once** per frame, even if this method has been called multiple times. */
        queue_redraw(): void
        
        /** Moves this node to display on top of its siblings.  
         *  Internally, the node is moved to the bottom of parent's child list. The method has no effect on nodes without a parent.  
         */
        move_to_front(): void
        
        /** Draws a line from a 2D point to another, with a given color and width. It can be optionally antialiased. See also [method draw_dashed_line], [method draw_multiline], and [method draw_polyline].  
         *  If [param width] is negative, then a two-point primitive will be drawn instead of a four-point one. This means that when the CanvasItem is scaled, the line will remain thin. If this behavior is not desired, then pass a positive [param width] like `1.0`.  
         */
        draw_line(from: Vector2, to: Vector2, color: Color, width: float64 = -1, antialiased: boolean = false): void
        
        /** Draws a dashed line from a 2D point to another, with a given color and width. See also [method draw_line], [method draw_multiline], and [method draw_polyline].  
         *  If [param width] is negative, then a two-point primitives will be drawn instead of a four-point ones. This means that when the CanvasItem is scaled, the line parts will remain thin. If this behavior is not desired, then pass a positive [param width] like `1.0`.  
         *  [param dash] is the length of each dash in pixels, with the gap between each dash being the same length. If [param aligned] is `true`, the length of the first and last dashes may be shortened or lengthened to allow the line to begin and end at the precise points defined by [param from] and [param to]. Both ends are always symmetrical when [param aligned] is `true`. If [param aligned] is `false`, all dashes will have the same length, but the line may appear incomplete at the end due to the dash length not dividing evenly into the line length. Only full dashes are drawn when [param aligned] is `false`.  
         *  If [param antialiased] is `true`, half transparent "feathers" will be attached to the boundary, making outlines smooth.  
         *      
         *  **Note:** [param antialiased] is only effective if [param width] is greater than `0.0`.  
         */
        draw_dashed_line(from: Vector2, to: Vector2, color: Color, width: float64 = -1, dash: float64 = 2, aligned: boolean = true, antialiased: boolean = false): void
        
        /** Draws interconnected line segments with a uniform [param color] and [param width] and optional antialiasing (supported only for positive [param width]). When drawing large amounts of lines, this is faster than using individual [method draw_line] calls. To draw disconnected lines, use [method draw_multiline] instead. See also [method draw_polygon].  
         *  If [param width] is negative, it will be ignored and the polyline will be drawn using [constant RenderingServer.PRIMITIVE_LINE_STRIP]. This means that when the CanvasItem is scaled, the polyline will remain thin. If this behavior is not desired, then pass a positive [param width] like `1.0`.  
         */
        draw_polyline(points: PackedVector2Array | Vector2[], color: Color, width: float64 = -1, antialiased: boolean = false): void
        
        /** Draws interconnected line segments with a uniform [param width], point-by-point coloring, and optional antialiasing (supported only for positive [param width]). Colors assigned to line points match by index between [param points] and [param colors], i.e. each line segment is filled with a gradient between the colors of the endpoints. When drawing large amounts of lines, this is faster than using individual [method draw_line] calls. To draw disconnected lines, use [method draw_multiline_colors] instead. See also [method draw_polygon].  
         *  If [param width] is negative, it will be ignored and the polyline will be drawn using [constant RenderingServer.PRIMITIVE_LINE_STRIP]. This means that when the CanvasItem is scaled, the polyline will remain thin. If this behavior is not desired, then pass a positive [param width] like `1.0`.  
         */
        draw_polyline_colors(points: PackedVector2Array | Vector2[], colors: PackedColorArray | Color[], width: float64 = -1, antialiased: boolean = false): void
        
        /** Draws an unfilled arc between the given angles with a uniform [param color] and [param width] and optional antialiasing (supported only for positive [param width]). The larger the value of [param point_count], the smoother the curve. See also [method draw_circle].  
         *  If [param width] is negative, it will be ignored and the arc will be drawn using [constant RenderingServer.PRIMITIVE_LINE_STRIP]. This means that when the CanvasItem is scaled, the arc will remain thin. If this behavior is not desired, then pass a positive [param width] like `1.0`.  
         *  The arc is drawn from [param start_angle] towards the value of [param end_angle] so in clockwise direction if `start_angle < end_angle` and counter-clockwise otherwise. Passing the same angles but in reversed order will produce the same arc. If absolute difference of [param start_angle] and [param end_angle] is greater than [constant @GDScript.TAU] radians, then a full circle arc is drawn (i.e. arc will not overlap itself).  
         */
        draw_arc(center: Vector2, radius: float64, start_angle: float64, end_angle: float64, point_count: int64, color: Color, width: float64 = -1, antialiased: boolean = false): void
        
        /** Draws multiple disconnected lines with a uniform [param width] and [param color]. Each line is defined by two consecutive points from [param points] array, i.e. i-th segment consists of `points[2 * i]`, `points[2 * i + 1]` endpoints. When drawing large amounts of lines, this is faster than using individual [method draw_line] calls. To draw interconnected lines, use [method draw_polyline] instead.  
         *  If [param width] is negative, then two-point primitives will be drawn instead of a four-point ones. This means that when the CanvasItem is scaled, the lines will remain thin. If this behavior is not desired, then pass a positive [param width] like `1.0`.  
         *      
         *  **Note:** [param antialiased] is only effective if [param width] is greater than `0.0`.  
         */
        draw_multiline(points: PackedVector2Array | Vector2[], color: Color, width: float64 = -1, antialiased: boolean = false): void
        
        /** Draws multiple disconnected lines with a uniform [param width] and segment-by-segment coloring. Each segment is defined by two consecutive points from [param points] array and a corresponding color from [param colors] array, i.e. i-th segment consists of `points[2 * i]`, `points[2 * i + 1]` endpoints and has `colors *` color. When drawing large amounts of lines, this is faster than using individual [method draw_line] calls. To draw interconnected lines, use [method draw_polyline_colors] instead.  
         *  If [param width] is negative, then two-point primitives will be drawn instead of a four-point ones. This means that when the CanvasItem is scaled, the lines will remain thin. If this behavior is not desired, then pass a positive [param width] like `1.0`.  
         *      
         *  **Note:** [param antialiased] is only effective if [param width] is greater than `0.0`.  
         */
        draw_multiline_colors(points: PackedVector2Array | Vector2[], colors: PackedColorArray | Color[], width: float64 = -1, antialiased: boolean = false): void
        
        /** Draws a rectangle. If [param filled] is `true`, the rectangle will be filled with the [param color] specified. If [param filled] is `false`, the rectangle will be drawn as a stroke with the [param color] and [param width] specified. See also [method draw_texture_rect].  
         *  If [param width] is negative, then two-point primitives will be drawn instead of a four-point ones. This means that when the CanvasItem is scaled, the lines will remain thin. If this behavior is not desired, then pass a positive [param width] like `1.0`.  
         *  If [param antialiased] is `true`, half transparent "feathers" will be attached to the boundary, making outlines smooth.  
         *      
         *  **Note:** [param width] is only effective if [param filled] is `false`.  
         *      
         *  **Note:** Unfilled rectangles drawn with a negative [param width] may not display perfectly. For example, corners may be missing or brighter due to overlapping lines (for a translucent [param color]).  
         */
        draw_rect(rect: Rect2, color: Color, filled: boolean = true, width: float64 = -1, antialiased: boolean = false): void
        
        /** Draws a circle. See also [method draw_arc], [method draw_polyline], and [method draw_polygon].  
         *  If [param filled] is `true`, the circle will be filled with the [param color] specified. If [param filled] is `false`, the circle will be drawn as a stroke with the [param color] and [param width] specified.  
         *  If [param width] is negative, then two-point primitives will be drawn instead of a four-point ones. This means that when the CanvasItem is scaled, the lines will remain thin. If this behavior is not desired, then pass a positive [param width] like `1.0`.  
         *  If [param antialiased] is `true`, half transparent "feathers" will be attached to the boundary, making outlines smooth.  
         *      
         *  **Note:** [param width] is only effective if [param filled] is `false`.  
         */
        draw_circle(position: Vector2, radius: float64, color: Color, filled: boolean = true, width: float64 = -1, antialiased: boolean = false): void
        
        /** Draws a texture at a given position. */
        draw_texture(texture: Texture2D, position: Vector2, modulate: Color = new Color(1, 1, 1, 1)): void
        
        /** Draws a textured rectangle at a given position, optionally modulated by a color. If [param transpose] is `true`, the texture will have its X and Y coordinates swapped. See also [method draw_rect] and [method draw_texture_rect_region]. */
        draw_texture_rect(texture: Texture2D, rect: Rect2, tile: boolean, modulate: Color = new Color(1, 1, 1, 1), transpose: boolean = false): void
        
        /** Draws a textured rectangle from a texture's region (specified by [param src_rect]) at a given position, optionally modulated by a color. If [param transpose] is `true`, the texture will have its X and Y coordinates swapped. See also [method draw_texture_rect]. */
        draw_texture_rect_region(texture: Texture2D, rect: Rect2, src_rect: Rect2, modulate: Color = new Color(1, 1, 1, 1), transpose: boolean = false, clip_uv: boolean = true): void
        
        /** Draws a textured rectangle region of the multi-channel signed distance field texture at a given position, optionally modulated by a color. See [member FontFile.multichannel_signed_distance_field] for more information and caveats about MSDF font rendering.  
         *  If [param outline] is positive, each alpha channel value of pixel in region is set to maximum value of true distance in the [param outline] radius.  
         *  Value of the [param pixel_range] should the same that was used during distance field texture generation.  
         */
        draw_msdf_texture_rect_region(texture: Texture2D, rect: Rect2, src_rect: Rect2, modulate: Color = new Color(1, 1, 1, 1), outline: float64 = 0, pixel_range: float64 = 4, scale: float64 = 1): void
        
        /** Draws a textured rectangle region of the font texture with LCD subpixel anti-aliasing at a given position, optionally modulated by a color.  
         *  Texture is drawn using the following blend operation, blend mode of the [CanvasItemMaterial] is ignored:  
         *    
         */
        draw_lcd_texture_rect_region(texture: Texture2D, rect: Rect2, src_rect: Rect2, modulate: Color = new Color(1, 1, 1, 1)): void
        
        /** Draws a styled rectangle. */
        draw_style_box(style_box: StyleBox, rect: Rect2): void
        
        /** Draws a custom primitive. 1 point for a point, 2 points for a line, 3 points for a triangle, and 4 points for a quad. If 0 points or more than 4 points are specified, nothing will be drawn and an error message will be printed. See also [method draw_line], [method draw_polyline], [method draw_polygon], and [method draw_rect]. */
        draw_primitive(points: PackedVector2Array | Vector2[], colors: PackedColorArray | Color[], uvs: PackedVector2Array | Vector2[], texture: Texture2D = undefined): void
        
        /** Draws a solid polygon of any number of points, convex or concave. Unlike [method draw_colored_polygon], each point's color can be changed individually. See also [method draw_polyline] and [method draw_polyline_colors]. If you need more flexibility (such as being able to use bones), use [method RenderingServer.canvas_item_add_triangle_array] instead.  
         *      
         *  **Note:** If you frequently redraw the same polygon with a large number of vertices, consider pre-calculating the triangulation with [method Geometry2D.triangulate_polygon] and using [method draw_mesh], [method draw_multimesh], or [method RenderingServer.canvas_item_add_triangle_array].  
         */
        draw_polygon(points: PackedVector2Array | Vector2[], colors: PackedColorArray | Color[], uvs: PackedVector2Array | Vector2[] = [], texture: Texture2D = undefined): void
        
        /** Draws a colored polygon of any number of points, convex or concave. Unlike [method draw_polygon], a single color must be specified for the whole polygon.  
         *      
         *  **Note:** If you frequently redraw the same polygon with a large number of vertices, consider pre-calculating the triangulation with [method Geometry2D.triangulate_polygon] and using [method draw_mesh], [method draw_multimesh], or [method RenderingServer.canvas_item_add_triangle_array].  
         */
        draw_colored_polygon(points: PackedVector2Array | Vector2[], color: Color, uvs: PackedVector2Array | Vector2[] = [], texture: Texture2D = undefined): void
        
        /** Draws [param text] using the specified [param font] at the [param pos] (bottom-left corner using the baseline of the font). The text will have its color multiplied by [param modulate]. If [param width] is greater than or equal to 0, the text will be clipped if it exceeds the specified width.  
         *  **Example:** Draw "Hello world", using the project's default font:  
         *    
         *  See also [method Font.draw_string].  
         */
        draw_string(font: Font, pos: Vector2, text: string, alignment: HorizontalAlignment = 0, width: float64 = -1, font_size: int64 = 16, modulate: Color = new Color(1, 1, 1, 1), justification_flags: TextServer.JustificationFlag = 3, direction: TextServer.Direction = 0, orientation: TextServer.Orientation = 0): void
        
        /** Breaks [param text] into lines and draws it using the specified [param font] at the [param pos] (top-left corner). The text will have its color multiplied by [param modulate]. If [param width] is greater than or equal to 0, the text will be clipped if it exceeds the specified width. */
        draw_multiline_string(font: Font, pos: Vector2, text: string, alignment: HorizontalAlignment = 0, width: float64 = -1, font_size: int64 = 16, max_lines: int64 = -1, modulate: Color = new Color(1, 1, 1, 1), brk_flags: TextServer.LineBreakFlag = 3, justification_flags: TextServer.JustificationFlag = 3, direction: TextServer.Direction = 0, orientation: TextServer.Orientation = 0): void
        
        /** Draws [param text] outline using the specified [param font] at the [param pos] (bottom-left corner using the baseline of the font). The text will have its color multiplied by [param modulate]. If [param width] is greater than or equal to 0, the text will be clipped if it exceeds the specified width. */
        draw_string_outline(font: Font, pos: Vector2, text: string, alignment: HorizontalAlignment = 0, width: float64 = -1, font_size: int64 = 16, size: int64 = 1, modulate: Color = new Color(1, 1, 1, 1), justification_flags: TextServer.JustificationFlag = 3, direction: TextServer.Direction = 0, orientation: TextServer.Orientation = 0): void
        
        /** Breaks [param text] to the lines and draws text outline using the specified [param font] at the [param pos] (top-left corner). The text will have its color multiplied by [param modulate]. If [param width] is greater than or equal to 0, the text will be clipped if it exceeds the specified width. */
        draw_multiline_string_outline(font: Font, pos: Vector2, text: string, alignment: HorizontalAlignment = 0, width: float64 = -1, font_size: int64 = 16, max_lines: int64 = -1, size: int64 = 1, modulate: Color = new Color(1, 1, 1, 1), brk_flags: TextServer.LineBreakFlag = 3, justification_flags: TextServer.JustificationFlag = 3, direction: TextServer.Direction = 0, orientation: TextServer.Orientation = 0): void
        
        /** Draws a string first character using a custom font. */
        draw_char(font: Font, pos: Vector2, char: string, font_size: int64 = 16, modulate: Color = new Color(1, 1, 1, 1)): void
        
        /** Draws a string first character outline using a custom font. */
        draw_char_outline(font: Font, pos: Vector2, char: string, font_size: int64 = 16, size: int64 = -1, modulate: Color = new Color(1, 1, 1, 1)): void
        
        /** Draws a [Mesh] in 2D, using the provided texture. See [MeshInstance2D] for related documentation. */
        draw_mesh(mesh: Mesh, texture: Texture2D, transform: Transform2D = new Transform2D(), modulate: Color = new Color(1, 1, 1, 1)): void
        
        /** Draws a [MultiMesh] in 2D with the provided texture. See [MultiMeshInstance2D] for related documentation. */
        draw_multimesh(multimesh: MultiMesh, texture: Texture2D): void
        
        /** Sets a custom transform for drawing via components. Anything drawn afterwards will be transformed by this.  
         *      
         *  **Note:** [member FontFile.oversampling] does  *not*  take [param scale] into account. This means that scaling up/down will cause bitmap fonts and rasterized (non-MSDF) dynamic fonts to appear blurry or pixelated. To ensure text remains crisp regardless of scale, you can enable MSDF font rendering by enabling [member ProjectSettings.gui/theme/default_font_multichannel_signed_distance_field] (applies to the default project font only), or enabling **Multichannel Signed Distance Field** in the import options of a DynamicFont for custom fonts. On system fonts, [member SystemFont.multichannel_signed_distance_field] can be enabled in the inspector.  
         */
        draw_set_transform(position: Vector2, rotation: float64 = 0, scale: Vector2 = Vector2.ONE): void
        
        /** Sets a custom transform for drawing via matrix. Anything drawn afterwards will be transformed by this. */
        draw_set_transform_matrix(xform: Transform2D): void
        
        /** Subsequent drawing commands will be ignored unless they fall within the specified animation slice. This is a faster way to implement animations that loop on background rather than redrawing constantly. */
        draw_animation_slice(animation_length: float64, slice_begin: float64, slice_end: float64, offset: float64 = 0): void
        
        /** After submitting all animations slices via [method draw_animation_slice], this function can be used to revert drawing to its default state (all subsequent drawing commands will be visible). If you don't care about this particular use case, usage of this function after submitting the slices is not required. */
        draw_end_animation(): void
        
        /** Returns the transform matrix of this item. */
        get_transform(): Transform2D
        
        /** Returns the global transform matrix of this item, i.e. the combined transform up to the topmost [CanvasItem] node. The topmost item is a [CanvasItem] that either has no parent, has non-[CanvasItem] parent or it has [member top_level] enabled. */
        get_global_transform(): Transform2D
        
        /** Returns the transform from the local coordinate system of this [CanvasItem] to the [Viewport]s coordinate system. */
        get_global_transform_with_canvas(): Transform2D
        
        /** Returns the transform from the coordinate system of the canvas, this item is in, to the [Viewport]s embedders coordinate system. */
        get_viewport_transform(): Transform2D
        
        /** Returns the viewport's boundaries as a [Rect2]. */
        get_viewport_rect(): Rect2
        
        /** Returns the transform from the coordinate system of the canvas, this item is in, to the [Viewport]s coordinate system. */
        get_canvas_transform(): Transform2D
        
        /** Returns the transform of this [CanvasItem] in global screen coordinates (i.e. taking window position into account). Mostly useful for editor plugins.  
         *  Equals to [method get_global_transform] if the window is embedded (see [member Viewport.gui_embed_subwindows]).  
         */
        get_screen_transform(): Transform2D
        
        /** Returns the mouse's position in this [CanvasItem] using the local coordinate system of this [CanvasItem]. */
        get_local_mouse_position(): Vector2
        
        /** Returns the mouse's position in the [CanvasLayer] that this [CanvasItem] is in using the coordinate system of the [CanvasLayer].  
         *      
         *  **Note:** For screen-space coordinates (e.g. when using a non-embedded [Popup]), you can use [method DisplayServer.mouse_get_position].  
         */
        get_global_mouse_position(): Vector2
        
        /** Returns the [RID] of the [World2D] canvas where this item is in. */
        get_canvas(): RID
        
        /** Returns the [CanvasLayer] that contains this node, or `null` if the node is not in any [CanvasLayer]. */
        get_canvas_layer_node(): CanvasLayer
        
        /** Returns the [World2D] where this item is in. */
        get_world_2d(): World2D
        
        /** Set the value of a shader uniform for this instance only ([url=https://docs.godotengine.org/en/4.4/tutorials/shaders/shader_reference/shading_language.html#per-instance-uniforms]per-instance uniform[/url]). See also [method ShaderMaterial.set_shader_parameter] to assign a uniform on all instances using the same [ShaderMaterial].  
         *      
         *  **Note:** For a shader uniform to be assignable on a per-instance basis, it  *must*  be defined with `instance uniform ...` rather than `uniform ...` in the shader code.  
         *      
         *  **Note:** [param name] is case-sensitive and must match the name of the uniform in the code exactly (not the capitalized name in the inspector).  
         */
        set_instance_shader_parameter(name: StringName, value: any): void
        
        /** Get the value of a shader parameter as set on this instance. */
        get_instance_shader_parameter(name: StringName): any
        
        /** If [param enable] is `true`, this node will receive [constant NOTIFICATION_LOCAL_TRANSFORM_CHANGED] when its local transform changes. */
        set_notify_local_transform(enable: boolean): void
        
        /** Returns `true` if local transform notifications are communicated to children. */
        is_local_transform_notification_enabled(): boolean
        
        /** If [param enable] is `true`, this node will receive [constant NOTIFICATION_TRANSFORM_CHANGED] when its global transform changes. */
        set_notify_transform(enable: boolean): void
        
        /** Returns `true` if global transform notifications are communicated to children. */
        is_transform_notification_enabled(): boolean
        
        /** Forces the transform to update. Transform changes in physics are not instant for performance reasons. Transforms are accumulated and then set. Use this if you need an up-to-date transform when doing physics operations. */
        force_update_transform(): void
        
        /** Transforms [param viewport_point] from the viewport's coordinates to this node's local coordinates.  
         *  For the opposite operation, use [method get_global_transform_with_canvas].  
         *    
         */
        make_canvas_position_local(viewport_point: Vector2): Vector2
        
        /** Transformations issued by [param event]'s inputs are applied in local space instead of global space. */
        make_input_local(event: InputEvent): InputEvent
        
        /** Set/clear individual bits on the rendering visibility layer. This simplifies editing this [CanvasItem]'s visibility layer. */
        set_visibility_layer_bit(layer: int64, enabled: boolean): void
        
        /** Returns an individual bit on the rendering visibility layer. */
        get_visibility_layer_bit(layer: int64): boolean
        
        /** If `true`, this [CanvasItem] may be drawn. Whether this [CanvasItem] is actually drawn depends on the visibility of all of its [CanvasItem] ancestors. In other words: this [CanvasItem] will be drawn when [method is_visible_in_tree] returns `true` and all [CanvasItem] ancestors share at least one [member visibility_layer] with this [CanvasItem].  
         *      
         *  **Note:** For controls that inherit [Popup], the correct way to make them visible is to call one of the multiple `popup*()` functions instead.  
         */
        get visible(): boolean
        set visible(value: boolean)
        
        /** The color applied to this [CanvasItem]. This property does affect child [CanvasItem]s, unlike [member self_modulate] which only affects the node itself. */
        get modulate(): Color
        set modulate(value: Color)
        
        /** The color applied to this [CanvasItem]. This property does **not** affect child [CanvasItem]s, unlike [member modulate] which affects both the node itself and its children.  
         *      
         *  **Note:** Internal children (e.g. sliders in [ColorPicker] or tab bar in [TabContainer]) are also not affected by this property (see `include_internal` parameter of [method Node.get_child] and other similar methods).  
         */
        get self_modulate(): Color
        set self_modulate(value: Color)
        
        /** If `true`, the object draws behind its parent. */
        get show_behind_parent(): boolean
        set show_behind_parent(value: boolean)
        
        /** If `true`, this [CanvasItem] will  *not*  inherit its transform from parent [CanvasItem]s. Its draw order will also be changed to make it draw on top of other [CanvasItem]s that do not have [member top_level] set to `true`. The [CanvasItem] will effectively act as if it was placed as a child of a bare [Node]. */
        get top_level(): boolean
        set top_level(value: boolean)
        
        /** Allows the current node to clip child nodes, essentially acting as a mask.  
         *      
         *  **Note:** Clipping nodes cannot be nested or placed within [CanvasGroup]s. If an ancestor of this node clips its children or is a [CanvasGroup], then this node's clip mode should be set to [constant CLIP_CHILDREN_DISABLED] to avoid unexpected behavior.  
         */
        get clip_children(): int64
        set clip_children(value: int64)
        
        /** The rendering layers in which this [CanvasItem] responds to [Light2D] nodes. */
        get light_mask(): int64
        set light_mask(value: int64)
        
        /** The rendering layer in which this [CanvasItem] is rendered by [Viewport] nodes. A [Viewport] will render a [CanvasItem] if it and all its parents share a layer with the [Viewport]'s canvas cull mask. */
        get visibility_layer(): int64
        set visibility_layer(value: int64)
        
        /** Controls the order in which the nodes render. A node with a higher Z index will display in front of others. Must be between [constant RenderingServer.CANVAS_ITEM_Z_MIN] and [constant RenderingServer.CANVAS_ITEM_Z_MAX] (inclusive).  
         *      
         *  **Note:** Changing the Z index of a [Control] only affects the drawing order, not the order in which input events are handled. This can be useful to implement certain UI animations, e.g. a menu where hovered items are scaled and should overlap others.  
         */
        get z_index(): int64
        set z_index(value: int64)
        
        /** If `true`, the node's Z index is relative to its parent's Z index. If this node's Z index is 2 and its parent's effective Z index is 3, then this node's effective Z index will be 2 + 3 = 5. */
        get z_as_relative(): boolean
        set z_as_relative(value: boolean)
        
        /** If `true`, this and child [CanvasItem] nodes with a higher Y position are rendered in front of nodes with a lower Y position. If `false`, this and child [CanvasItem] nodes are rendered normally in scene tree order.  
         *  With Y-sorting enabled on a parent node ('A') but disabled on a child node ('B'), the child node ('B') is sorted but its children ('C1', 'C2', etc.) render together on the same Y position as the child node ('B'). This allows you to organize the render order of a scene without changing the scene tree.  
         *  Nodes sort relative to each other only if they are on the same [member z_index].  
         */
        get y_sort_enabled(): boolean
        set y_sort_enabled(value: boolean)
        
        /** The texture filtering mode to use on this [CanvasItem]. */
        get texture_filter(): int64
        set texture_filter(value: int64)
        
        /** The texture repeating mode to use on this [CanvasItem]. */
        get texture_repeat(): int64
        set texture_repeat(value: int64)
        
        /** The material applied to this [CanvasItem]. */
        get material(): CanvasItemMaterial | ShaderMaterial
        set material(value: CanvasItemMaterial | ShaderMaterial)
        
        /** If `true`, the parent [CanvasItem]'s [member material] property is used as this one's material. */
        get use_parent_material(): boolean
        set use_parent_material(value: boolean)
        
        /** Emitted when the [CanvasItem] must redraw,  *after*  the related [constant NOTIFICATION_DRAW] notification, and  *before*  [method _draw] is called.  
         *      
         *  **Note:** Deferred connections do not allow drawing through the `draw_*` methods.  
         */
        readonly draw: Signal0
        
        /** Emitted when the [CanvasItem]'s visibility changes, either because its own [member visible] property changed or because its visibility in the tree changed (see [method is_visible_in_tree]). */
        readonly visibility_changed: Signal0
        
        /** Emitted when the [CanvasItem] is hidden, i.e. it's no longer visible in the tree (see [method is_visible_in_tree]). */
        readonly hidden: Signal0
        
        /** Emitted when the [CanvasItem]'s boundaries (position or size) change, or when an action took place that may have affected these boundaries (e.g. changing [member Sprite2D.texture]). */
        readonly item_rect_changed: Signal0
    }
    class CanvasItemEditor<Map extends Record<string, Node> = Record<string, Node>> extends VBoxContainer<Map> {
        constructor(identifier?: any)
        _get_editor_data(_unnamed_arg0: Object): Object
        update_viewport(): void
        center_at(position: Vector2): void
        _set_owner_for_node_and_children(_unnamed_arg0: Node, _unnamed_arg1: Node): void
        readonly item_lock_status_changed: Signal0
        readonly item_group_status_changed: Signal0
    }
    class CanvasItemEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    class CanvasItemEditorViewport<Map extends Record<string, Node> = Record<string, Node>> extends Control<Map> {
        constructor(identifier?: any)
    }
    namespace CanvasItemMaterial {
        enum BlendMode {
            /** Mix blending mode. Colors are assumed to be independent of the alpha (opacity) value. */
            BLEND_MODE_MIX = 0,
            
            /** Additive blending mode. */
            BLEND_MODE_ADD = 1,
            
            /** Subtractive blending mode. */
            BLEND_MODE_SUB = 2,
            
            /** Multiplicative blending mode. */
            BLEND_MODE_MUL = 3,
            
            /** Mix blending mode. Colors are assumed to be premultiplied by the alpha (opacity) value. */
            BLEND_MODE_PREMULT_ALPHA = 4,
        }
        enum LightMode {
            /** Render the material using both light and non-light sensitive material properties. */
            LIGHT_MODE_NORMAL = 0,
            
            /** Render the material as if there were no light. */
            LIGHT_MODE_UNSHADED = 1,
            
            /** Render the material as if there were only light. */
            LIGHT_MODE_LIGHT_ONLY = 2,
        }
    }
    /** A material for [CanvasItem]s.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_canvasitemmaterial.html  
     */
    class CanvasItemMaterial extends Material {
        constructor(identifier?: any)
        /** The manner in which a material's rendering is applied to underlying textures. */
        get blend_mode(): int64
        set blend_mode(value: int64)
        
        /** The manner in which material reacts to lighting. */
        get light_mode(): int64
        set light_mode(value: int64)
        
        /** If `true`, enable spritesheet-based animation features when assigned to [GPUParticles2D] and [CPUParticles2D] nodes. The [member ParticleProcessMaterial.anim_speed_max] or [member CPUParticles2D.anim_speed_max] should also be set to a positive value for the animation to play.  
         *  This property (and other `particles_anim_*` properties that depend on it) has no effect on other types of nodes.  
         */
        get particles_animation(): boolean
        set particles_animation(value: boolean)
        
        /** The number of columns in the spritesheet assigned as [Texture2D] for a [GPUParticles2D] or [CPUParticles2D].  
         *      
         *  **Note:** This property is only used and visible in the editor if [member particles_animation] is `true`.  
         */
        get particles_anim_h_frames(): int64
        set particles_anim_h_frames(value: int64)
        
        /** The number of rows in the spritesheet assigned as [Texture2D] for a [GPUParticles2D] or [CPUParticles2D].  
         *      
         *  **Note:** This property is only used and visible in the editor if [member particles_animation] is `true`.  
         */
        get particles_anim_v_frames(): int64
        set particles_anim_v_frames(value: int64)
        
        /** If `true`, the particles animation will loop.  
         *      
         *  **Note:** This property is only used and visible in the editor if [member particles_animation] is `true`.  
         */
        get particles_anim_loop(): boolean
        set particles_anim_loop(value: boolean)
    }
    class CanvasItemMaterialConversionPlugin extends EditorResourceConversionPlugin {
        constructor(identifier?: any)
    }
    /** A node used for independent rendering of objects within a 2D scene.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_canvaslayer.html  
     */
    class CanvasLayer<Map extends Record<string, Node> = Record<string, Node>> extends Node<Map> {
        constructor(identifier?: any)
        /** Shows any [CanvasItem] under this [CanvasLayer]. This is equivalent to setting [member visible] to `true`. */
        show(): void
        
        /** Hides any [CanvasItem] under this [CanvasLayer]. This is equivalent to setting [member visible] to `false`. */
        hide(): void
        
        /** Returns the transform from the [CanvasLayer]s coordinate system to the [Viewport]s coordinate system. */
        get_final_transform(): Transform2D
        
        /** Returns the RID of the canvas used by this layer. */
        get_canvas(): RID
        
        /** Layer index for draw order. Lower values are drawn behind higher values.  
         *      
         *  **Note:** If multiple CanvasLayers have the same layer index, [CanvasItem] children of one CanvasLayer are drawn behind the [CanvasItem] children of the other CanvasLayer. Which CanvasLayer is drawn in front is non-deterministic.  
         */
        get layer(): int64
        set layer(value: int64)
        
        /** If `false`, any [CanvasItem] under this [CanvasLayer] will be hidden.  
         *  Unlike [member CanvasItem.visible], visibility of a [CanvasLayer] isn't propagated to underlying layers.  
         */
        get visible(): boolean
        set visible(value: boolean)
        
        /** The layer's base offset. */
        get offset(): Vector2
        set offset(value: Vector2)
        
        /** The layer's rotation in radians. */
        get rotation(): float64
        set rotation(value: float64)
        
        /** The layer's scale. */
        get scale(): Vector2
        set scale(value: Vector2)
        
        /** The layer's transform. */
        get transform(): Transform2D
        set transform(value: Transform2D)
        
        /** The custom [Viewport] node assigned to the [CanvasLayer]. If `null`, uses the default viewport instead. */
        get custom_viewport(): Viewport
        set custom_viewport(value: Viewport)
        
        /** If enabled, the [CanvasLayer] stays in a fixed position on the screen. If disabled, the [CanvasLayer] maintains its position in world space.  
         *  Together with [member follow_viewport_scale], this can be used for a pseudo-3D effect.  
         */
        get follow_viewport_enabled(): boolean
        set follow_viewport_enabled(value: boolean)
        
        /** Scales the layer when using [member follow_viewport_enabled]. Layers moving into the foreground should have increasing scales, while layers moving into the background should have decreasing scales. */
        get follow_viewport_scale(): float64
        set follow_viewport_scale(value: float64)
        
        /** Emitted when visibility of the layer is changed. See [member visible]. */
        readonly visibility_changed: Signal0
    }
    /** A node that applies a color tint to a canvas.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_canvasmodulate.html  
     */
    class CanvasModulate<Map extends Record<string, Node> = Record<string, Node>> extends Node2D<Map> {
        constructor(identifier?: any)
        /** The tint color to apply. */
        get color(): Color
        set color(value: Color)
    }
    /** Texture with optional normal and specular maps for use in 2D rendering.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_canvastexture.html  
     */
    class CanvasTexture extends Texture2D {
        constructor(identifier?: any)
        /** The diffuse (color) texture to use. This is the main texture you want to set in most cases. */
        get diffuse_texture(): Texture2D
        set diffuse_texture(value: Texture2D)
        
        /** The normal map texture to use. Only has a visible effect if [Light2D]s are affecting this [CanvasTexture].  
         *      
         *  **Note:** Godot expects the normal map to use X+, Y+, and Z+ coordinates. See [url=http://wiki.polycount.com/wiki/Normal_Map_Technical_Details#Common_Swizzle_Coordinates]this page[/url] for a comparison of normal map coordinates expected by popular engines.  
         */
        get normal_texture(): Texture2D
        set normal_texture(value: Texture2D)
        
        /** The specular map to use for [Light2D] specular reflections. This should be a grayscale or colored texture, with brighter areas resulting in a higher [member specular_shininess] value. Using a colored [member specular_texture] allows controlling specular shininess on a per-channel basis. Only has a visible effect if [Light2D]s are affecting this [CanvasTexture]. */
        get specular_texture(): Texture2D
        set specular_texture(value: Texture2D)
        
        /** The multiplier for specular reflection colors. The [Light2D]'s color is also taken into account when determining the reflection color. Only has a visible effect if [Light2D]s are affecting this [CanvasTexture]. */
        get specular_color(): Color
        set specular_color(value: Color)
        
        /** The specular exponent for [Light2D] specular reflections. Higher values result in a more glossy/"wet" look, with reflections becoming more localized and less visible overall. The default value of `1.0` disables specular reflections entirely. Only has a visible effect if [Light2D]s are affecting this [CanvasTexture]. */
        get specular_shininess(): float64
        set specular_shininess(value: float64)
        
        /** The texture filtering mode to use when drawing this [CanvasTexture]. */
        get texture_filter(): int64
        set texture_filter(value: int64)
        
        /** The texture repeat mode to use when drawing this [CanvasTexture]. */
        get texture_repeat(): int64
        set texture_repeat(value: int64)
    }
    /** Class representing a capsule-shaped [PrimitiveMesh].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_capsulemesh.html  
     */
    class CapsuleMesh extends PrimitiveMesh {
        constructor(identifier?: any)
        /** Radius of the capsule mesh. */
        get radius(): float64
        set radius(value: float64)
        
        /** Total height of the capsule mesh (including the hemispherical ends). */
        get height(): float64
        set height(value: float64)
        
        /** Number of radial segments on the capsule mesh. */
        get radial_segments(): int64
        set radial_segments(value: int64)
        
        /** Number of rings along the height of the capsule. */
        get rings(): int64
        set rings(value: int64)
    }
    /** A 2D capsule shape used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_capsuleshape2d.html  
     */
    class CapsuleShape2D extends Shape2D {
        constructor(identifier?: any)
        /** The capsule's radius. */
        get radius(): float64
        set radius(value: float64)
        
        /** The capsule's height. */
        get height(): float64
        set height(value: float64)
    }
    /** A 3D capsule shape used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_capsuleshape3d.html  
     */
    class CapsuleShape3D extends Shape3D {
        constructor(identifier?: any)
        /** The capsule's radius. */
        get radius(): float64
        set radius(value: float64)
        
        /** The capsule's height. */
        get height(): float64
        set height(value: float64)
    }
    class Cast2DEditor<Map extends Record<string, Node> = Record<string, Node>> extends Control<Map> {
        constructor(identifier?: any)
    }
    class Cast2DEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    /** A container that keeps child controls in its center.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_centercontainer.html  
     */
    class CenterContainer<Map extends Record<string, Node> = Record<string, Node>> extends Container<Map> {
        constructor(identifier?: any)
        /** If `true`, centers children relative to the [CenterContainer]'s top left corner. */
        get use_top_left(): boolean
        set use_top_left(value: boolean)
    }
    /** Controls how an individual character will be displayed in a [RichTextEffect].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_charfxtransform.html  
     */
    class CharFXTransform extends RefCounted {
        constructor(identifier?: any)
        /** The current transform of the current glyph. It can be overridden (for example, by driving the position and rotation from a curve). You can also alter the existing value to apply transforms on top of other effects. */
        get transform(): Transform2D
        set transform(value: Transform2D)
        
        /** Absolute character range in the string, corresponding to the glyph.  
         *      
         *  **Note:** Read-only. Setting this property won't affect drawing.  
         */
        get range(): Vector2i
        set range(value: Vector2i)
        
        /** The time elapsed since the [RichTextLabel] was added to the scene tree (in seconds). Time stops when the [RichTextLabel] is paused (see [member Node.process_mode]). Resets when the text in the [RichTextLabel] is changed.  
         *      
         *  **Note:** Time still passes while the [RichTextLabel] is hidden.  
         */
        get elapsed_time(): float64
        set elapsed_time(value: float64)
        
        /** If `true`, the character will be drawn. If `false`, the character will be hidden. Characters around hidden characters will reflow to take the space of hidden characters. If this is not desired, set their [member color] to `Color(1, 1, 1, 0)` instead. */
        get visible(): boolean
        set visible(value: boolean)
        
        /** If `true`, FX transform is called for outline drawing.  
         *      
         *  **Note:** Read-only. Setting this property won't affect drawing.  
         */
        get outline(): boolean
        set outline(value: boolean)
        
        /** The position offset the character will be drawn with (in pixels). */
        get offset(): Vector2
        set offset(value: Vector2)
        
        /** The color the character will be drawn with. */
        get color(): Color
        set color(value: Color)
        
        /** Contains the arguments passed in the opening BBCode tag. By default, arguments are strings; if their contents match a type such as [bool], [int] or [float], they will be converted automatically. Color codes in the form `#rrggbb` or `#rgb` will be converted to an opaque [Color]. String arguments may not contain spaces, even if they're quoted. If present, quotes will also be present in the final string.  
         *  For example, the opening BBCode tag `[example foo=hello bar=true baz=42 color=#ffffff]` will map to the following [Dictionary]:  
         *    
         */
        get env(): GDictionary
        set env(value: GDictionary)
        
        /** Glyph index specific to the [member font]. If you want to replace this glyph, use [method TextServer.font_get_glyph_index] with [member font] to get a new glyph index for a single character. */
        get glyph_index(): int64
        set glyph_index(value: int64)
        
        /** Number of glyphs in the grapheme cluster. This value is set in the first glyph of a cluster.  
         *      
         *  **Note:** Read-only. Setting this property won't affect drawing.  
         */
        get glyph_count(): int64
        set glyph_count(value: int64)
        
        /** Glyph flags. See [enum TextServer.GraphemeFlag] for more info.  
         *      
         *  **Note:** Read-only. Setting this property won't affect drawing.  
         */
        get glyph_flags(): int64
        set glyph_flags(value: int64)
        
        /** The character offset of the glyph, relative to the current [RichTextEffect] custom block.  
         *      
         *  **Note:** Read-only. Setting this property won't affect drawing.  
         */
        get relative_index(): int64
        set relative_index(value: int64)
        
        /** [TextServer] RID of the font used to render glyph, this value can be used with `TextServer.font_*` methods to retrieve font information.  
         *      
         *  **Note:** Read-only. Setting this property won't affect drawing.  
         */
        get font(): RID
        set font(value: RID)
    }
    namespace CharacterBody2D {
        enum MotionMode {
            /** Apply when notions of walls, ceiling and floor are relevant. In this mode the body motion will react to slopes (acceleration/slowdown). This mode is suitable for sided games like platformers. */
            MOTION_MODE_GROUNDED = 0,
            
            /** Apply when there is no notion of floor or ceiling. All collisions will be reported as `on_wall`. In this mode, when you slide, the speed will always be constant. This mode is suitable for top-down games. */
            MOTION_MODE_FLOATING = 1,
        }
        enum PlatformOnLeave {
            /** Add the last platform velocity to the [member velocity] when you leave a moving platform. */
            PLATFORM_ON_LEAVE_ADD_VELOCITY = 0,
            
            /** Add the last platform velocity to the [member velocity] when you leave a moving platform, but any downward motion is ignored. It's useful to keep full jump height even when the platform is moving down. */
            PLATFORM_ON_LEAVE_ADD_UPWARD_VELOCITY = 1,
            
            /** Do nothing when leaving a platform. */
            PLATFORM_ON_LEAVE_DO_NOTHING = 2,
        }
    }
    /** A 2D physics body specialized for characters moved by script.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_characterbody2d.html  
     */
    class CharacterBody2D<Map extends Record<string, Node> = Record<string, Node>> extends PhysicsBody2D<Map> {
        constructor(identifier?: any)
        /** Moves the body based on [member velocity]. If the body collides with another, it will slide along the other body (by default only on floor) rather than stop immediately. If the other body is a [CharacterBody2D] or [RigidBody2D], it will also be affected by the motion of the other body. You can use this to make moving and rotating platforms, or to make nodes push other nodes.  
         *  Modifies [member velocity] if a slide collision occurred. To get the latest collision call [method get_last_slide_collision], for detailed information about collisions that occurred, use [method get_slide_collision].  
         *  When the body touches a moving platform, the platform's velocity is automatically added to the body motion. If a collision occurs due to the platform's motion, it will always be first in the slide collisions.  
         *  The general behavior and available properties change according to the [member motion_mode].  
         *  Returns `true` if the body collided, otherwise, returns `false`.  
         */
        move_and_slide(): boolean
        
        /** Allows to manually apply a snap to the floor regardless of the body's velocity. This function does nothing when [method is_on_floor] returns `true`. */
        apply_floor_snap(): void
        
        /** Returns `true` if the body collided with the floor on the last call of [method move_and_slide]. Otherwise, returns `false`. The [member up_direction] and [member floor_max_angle] are used to determine whether a surface is "floor" or not. */
        is_on_floor(): boolean
        
        /** Returns `true` if the body collided only with the floor on the last call of [method move_and_slide]. Otherwise, returns `false`. The [member up_direction] and [member floor_max_angle] are used to determine whether a surface is "floor" or not. */
        is_on_floor_only(): boolean
        
        /** Returns `true` if the body collided with the ceiling on the last call of [method move_and_slide]. Otherwise, returns `false`. The [member up_direction] and [member floor_max_angle] are used to determine whether a surface is "ceiling" or not. */
        is_on_ceiling(): boolean
        
        /** Returns `true` if the body collided only with the ceiling on the last call of [method move_and_slide]. Otherwise, returns `false`. The [member up_direction] and [member floor_max_angle] are used to determine whether a surface is "ceiling" or not. */
        is_on_ceiling_only(): boolean
        
        /** Returns `true` if the body collided with a wall on the last call of [method move_and_slide]. Otherwise, returns `false`. The [member up_direction] and [member floor_max_angle] are used to determine whether a surface is "wall" or not. */
        is_on_wall(): boolean
        
        /** Returns `true` if the body collided only with a wall on the last call of [method move_and_slide]. Otherwise, returns `false`. The [member up_direction] and [member floor_max_angle] are used to determine whether a surface is "wall" or not. */
        is_on_wall_only(): boolean
        
        /** Returns the collision normal of the floor at the last collision point. Only valid after calling [method move_and_slide] and when [method is_on_floor] returns `true`.  
         *  **Warning:** The collision normal is not always the same as the surface normal.  
         */
        get_floor_normal(): Vector2
        
        /** Returns the collision normal of the wall at the last collision point. Only valid after calling [method move_and_slide] and when [method is_on_wall] returns `true`.  
         *  **Warning:** The collision normal is not always the same as the surface normal.  
         */
        get_wall_normal(): Vector2
        
        /** Returns the last motion applied to the [CharacterBody2D] during the last call to [method move_and_slide]. The movement can be split into multiple motions when sliding occurs, and this method return the last one, which is useful to retrieve the current direction of the movement. */
        get_last_motion(): Vector2
        
        /** Returns the travel (position delta) that occurred during the last call to [method move_and_slide]. */
        get_position_delta(): Vector2
        
        /** Returns the current real velocity since the last call to [method move_and_slide]. For example, when you climb a slope, you will move diagonally even though the velocity is horizontal. This method returns the diagonal movement, as opposed to [member velocity] which returns the requested velocity. */
        get_real_velocity(): Vector2
        
        /** Returns the floor's collision angle at the last collision point according to [param up_direction], which is [constant Vector2.UP] by default. This value is always positive and only valid after calling [method move_and_slide] and when [method is_on_floor] returns `true`. */
        get_floor_angle(up_direction: Vector2 = new Vector2(0, -1)): float64
        
        /** Returns the linear velocity of the platform at the last collision point. Only valid after calling [method move_and_slide]. */
        get_platform_velocity(): Vector2
        
        /** Returns the number of times the body collided and changed direction during the last call to [method move_and_slide]. */
        get_slide_collision_count(): int64
        
        /** Returns a [KinematicCollision2D], which contains information about a collision that occurred during the last call to [method move_and_slide]. Since the body can collide several times in a single call to [method move_and_slide], you must specify the index of the collision in the range 0 to ([method get_slide_collision_count] - 1).  
         *  **Example:** Iterate through the collisions with a `for` loop:  
         *    
         */
        get_slide_collision(slide_idx: int64): KinematicCollision2D
        
        /** Returns a [KinematicCollision2D], which contains information about the latest collision that occurred during the last call to [method move_and_slide]. */
        get_last_slide_collision(): KinematicCollision2D
        
        /** Sets the motion mode which defines the behavior of [method move_and_slide]. See [enum MotionMode] constants for available modes. */
        get motion_mode(): int64
        set motion_mode(value: int64)
        
        /** Vector pointing upwards, used to determine what is a wall and what is a floor (or a ceiling) when calling [method move_and_slide]. Defaults to [constant Vector2.UP]. As the vector will be normalized it can't be equal to [constant Vector2.ZERO], if you want all collisions to be reported as walls, consider using [constant MOTION_MODE_FLOATING] as [member motion_mode]. */
        get up_direction(): Vector2
        set up_direction(value: Vector2)
        
        /** Current velocity vector in pixels per second, used and modified during calls to [method move_and_slide]. */
        get velocity(): Vector2
        set velocity(value: Vector2)
        
        /** If `true`, during a jump against the ceiling, the body will slide, if `false` it will be stopped and will fall vertically. */
        get slide_on_ceiling(): boolean
        set slide_on_ceiling(value: boolean)
        
        /** Maximum number of times the body can change direction before it stops when calling [method move_and_slide]. */
        get max_slides(): int64
        set max_slides(value: int64)
        
        /** Minimum angle (in radians) where the body is allowed to slide when it encounters a slope. The default value equals 15 degrees. This property only affects movement when [member motion_mode] is [constant MOTION_MODE_FLOATING]. */
        get wall_min_slide_angle(): float64
        set wall_min_slide_angle(value: float64)
        
        /** If `true`, the body will not slide on slopes when calling [method move_and_slide] when the body is standing still.  
         *  If `false`, the body will slide on floor's slopes when [member velocity] applies a downward force.  
         */
        get floor_stop_on_slope(): boolean
        set floor_stop_on_slope(value: boolean)
        
        /** If `false` (by default), the body will move faster on downward slopes and slower on upward slopes.  
         *  If `true`, the body will always move at the same speed on the ground no matter the slope. Note that you need to use [member floor_snap_length] to stick along a downward slope at constant speed.  
         */
        get floor_constant_speed(): boolean
        set floor_constant_speed(value: boolean)
        
        /** If `true`, the body will be able to move on the floor only. This option avoids to be able to walk on walls, it will however allow to slide down along them. */
        get floor_block_on_wall(): boolean
        set floor_block_on_wall(value: boolean)
        
        /** Maximum angle (in radians) where a slope is still considered a floor (or a ceiling), rather than a wall, when calling [method move_and_slide]. The default value equals 45 degrees. */
        get floor_max_angle(): float64
        set floor_max_angle(value: float64)
        
        /** Sets a snapping distance. When set to a value different from `0.0`, the body is kept attached to slopes when calling [method move_and_slide]. The snapping vector is determined by the given distance along the opposite direction of the [member up_direction].  
         *  As long as the snapping vector is in contact with the ground and the body moves against [member up_direction], the body will remain attached to the surface. Snapping is not applied if the body moves along [member up_direction], meaning it contains vertical rising velocity, so it will be able to detach from the ground when jumping or when the body is pushed up by something. If you want to apply a snap without taking into account the velocity, use [method apply_floor_snap].  
         */
        get floor_snap_length(): float64
        set floor_snap_length(value: float64)
        
        /** Sets the behavior to apply when you leave a moving platform. By default, to be physically accurate, when you leave the last platform velocity is applied. See [enum PlatformOnLeave] constants for available behavior. */
        get platform_on_leave(): int64
        set platform_on_leave(value: int64)
        
        /** Collision layers that will be included for detecting floor bodies that will act as moving platforms to be followed by the [CharacterBody2D]. By default, all floor bodies are detected and propagate their velocity. */
        get platform_floor_layers(): int64
        set platform_floor_layers(value: int64)
        
        /** Collision layers that will be included for detecting wall bodies that will act as moving platforms to be followed by the [CharacterBody2D]. By default, all wall bodies are ignored. */
        get platform_wall_layers(): int64
        set platform_wall_layers(value: int64)
        
        /** Extra margin used for collision recovery when calling [method move_and_slide].  
         *  If the body is at least this close to another body, it will consider them to be colliding and will be pushed away before performing the actual motion.  
         *  A higher value means it's more flexible for detecting collision, which helps with consistently detecting walls and floors.  
         *  A lower value forces the collision algorithm to use more exact detection, so it can be used in cases that specifically require precision, e.g at very low scale to avoid visible jittering, or for stability with a stack of character bodies.  
         */
        get safe_margin(): float64
        set safe_margin(value: float64)
    }
    namespace CharacterBody3D {
        enum MotionMode {
            /** Apply when notions of walls, ceiling and floor are relevant. In this mode the body motion will react to slopes (acceleration/slowdown). This mode is suitable for grounded games like platformers. */
            MOTION_MODE_GROUNDED = 0,
            
            /** Apply when there is no notion of floor or ceiling. All collisions will be reported as `on_wall`. In this mode, when you slide, the speed will always be constant. This mode is suitable for games without ground like space games. */
            MOTION_MODE_FLOATING = 1,
        }
        enum PlatformOnLeave {
            /** Add the last platform velocity to the [member velocity] when you leave a moving platform. */
            PLATFORM_ON_LEAVE_ADD_VELOCITY = 0,
            
            /** Add the last platform velocity to the [member velocity] when you leave a moving platform, but any downward motion is ignored. It's useful to keep full jump height even when the platform is moving down. */
            PLATFORM_ON_LEAVE_ADD_UPWARD_VELOCITY = 1,
            
            /** Do nothing when leaving a platform. */
            PLATFORM_ON_LEAVE_DO_NOTHING = 2,
        }
    }
    /** A 3D physics body specialized for characters moved by script.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_characterbody3d.html  
     */
    class CharacterBody3D<Map extends Record<string, Node> = Record<string, Node>> extends PhysicsBody3D<Map> {
        constructor(identifier?: any)
        /** Moves the body based on [member velocity]. If the body collides with another, it will slide along the other body rather than stop immediately. If the other body is a [CharacterBody3D] or [RigidBody3D], it will also be affected by the motion of the other body. You can use this to make moving and rotating platforms, or to make nodes push other nodes.  
         *  Modifies [member velocity] if a slide collision occurred. To get the latest collision call [method get_last_slide_collision], for more detailed information about collisions that occurred, use [method get_slide_collision].  
         *  When the body touches a moving platform, the platform's velocity is automatically added to the body motion. If a collision occurs due to the platform's motion, it will always be first in the slide collisions.  
         *  Returns `true` if the body collided, otherwise, returns `false`.  
         */
        move_and_slide(): boolean
        
        /** Allows to manually apply a snap to the floor regardless of the body's velocity. This function does nothing when [method is_on_floor] returns `true`. */
        apply_floor_snap(): void
        
        /** Returns `true` if the body collided with the floor on the last call of [method move_and_slide]. Otherwise, returns `false`. The [member up_direction] and [member floor_max_angle] are used to determine whether a surface is "floor" or not. */
        is_on_floor(): boolean
        
        /** Returns `true` if the body collided only with the floor on the last call of [method move_and_slide]. Otherwise, returns `false`. The [member up_direction] and [member floor_max_angle] are used to determine whether a surface is "floor" or not. */
        is_on_floor_only(): boolean
        
        /** Returns `true` if the body collided with the ceiling on the last call of [method move_and_slide]. Otherwise, returns `false`. The [member up_direction] and [member floor_max_angle] are used to determine whether a surface is "ceiling" or not. */
        is_on_ceiling(): boolean
        
        /** Returns `true` if the body collided only with the ceiling on the last call of [method move_and_slide]. Otherwise, returns `false`. The [member up_direction] and [member floor_max_angle] are used to determine whether a surface is "ceiling" or not. */
        is_on_ceiling_only(): boolean
        
        /** Returns `true` if the body collided with a wall on the last call of [method move_and_slide]. Otherwise, returns `false`. The [member up_direction] and [member floor_max_angle] are used to determine whether a surface is "wall" or not. */
        is_on_wall(): boolean
        
        /** Returns `true` if the body collided only with a wall on the last call of [method move_and_slide]. Otherwise, returns `false`. The [member up_direction] and [member floor_max_angle] are used to determine whether a surface is "wall" or not. */
        is_on_wall_only(): boolean
        
        /** Returns the collision normal of the floor at the last collision point. Only valid after calling [method move_and_slide] and when [method is_on_floor] returns `true`.  
         *  **Warning:** The collision normal is not always the same as the surface normal.  
         */
        get_floor_normal(): Vector3
        
        /** Returns the collision normal of the wall at the last collision point. Only valid after calling [method move_and_slide] and when [method is_on_wall] returns `true`.  
         *  **Warning:** The collision normal is not always the same as the surface normal.  
         */
        get_wall_normal(): Vector3
        
        /** Returns the last motion applied to the [CharacterBody3D] during the last call to [method move_and_slide]. The movement can be split into multiple motions when sliding occurs, and this method return the last one, which is useful to retrieve the current direction of the movement. */
        get_last_motion(): Vector3
        
        /** Returns the travel (position delta) that occurred during the last call to [method move_and_slide]. */
        get_position_delta(): Vector3
        
        /** Returns the current real velocity since the last call to [method move_and_slide]. For example, when you climb a slope, you will move diagonally even though the velocity is horizontal. This method returns the diagonal movement, as opposed to [member velocity] which returns the requested velocity. */
        get_real_velocity(): Vector3
        
        /** Returns the floor's collision angle at the last collision point according to [param up_direction], which is [constant Vector3.UP] by default. This value is always positive and only valid after calling [method move_and_slide] and when [method is_on_floor] returns `true`. */
        get_floor_angle(up_direction: Vector3 = Vector3.ZERO): float64
        
        /** Returns the linear velocity of the platform at the last collision point. Only valid after calling [method move_and_slide]. */
        get_platform_velocity(): Vector3
        
        /** Returns the angular velocity of the platform at the last collision point. Only valid after calling [method move_and_slide]. */
        get_platform_angular_velocity(): Vector3
        
        /** Returns the number of times the body collided and changed direction during the last call to [method move_and_slide]. */
        get_slide_collision_count(): int64
        
        /** Returns a [KinematicCollision3D], which contains information about a collision that occurred during the last call to [method move_and_slide]. Since the body can collide several times in a single call to [method move_and_slide], you must specify the index of the collision in the range 0 to ([method get_slide_collision_count] - 1). */
        get_slide_collision(slide_idx: int64): KinematicCollision3D
        
        /** Returns a [KinematicCollision3D], which contains information about the latest collision that occurred during the last call to [method move_and_slide]. */
        get_last_slide_collision(): KinematicCollision3D
        
        /** Sets the motion mode which defines the behavior of [method move_and_slide]. See [enum MotionMode] constants for available modes. */
        get motion_mode(): int64
        set motion_mode(value: int64)
        
        /** Vector pointing upwards, used to determine what is a wall and what is a floor (or a ceiling) when calling [method move_and_slide]. Defaults to [constant Vector3.UP]. As the vector will be normalized it can't be equal to [constant Vector3.ZERO], if you want all collisions to be reported as walls, consider using [constant MOTION_MODE_FLOATING] as [member motion_mode]. */
        get up_direction(): Vector3
        set up_direction(value: Vector3)
        
        /** If `true`, during a jump against the ceiling, the body will slide, if `false` it will be stopped and will fall vertically. */
        get slide_on_ceiling(): boolean
        set slide_on_ceiling(value: boolean)
        
        /** Current velocity vector (typically meters per second), used and modified during calls to [method move_and_slide]. */
        get velocity(): Vector3
        set velocity(value: Vector3)
        
        /** Maximum number of times the body can change direction before it stops when calling [method move_and_slide]. */
        get max_slides(): int64
        set max_slides(value: int64)
        
        /** Minimum angle (in radians) where the body is allowed to slide when it encounters a slope. The default value equals 15 degrees. When [member motion_mode] is [constant MOTION_MODE_GROUNDED], it only affects movement if [member floor_block_on_wall] is `true`. */
        get wall_min_slide_angle(): float64
        set wall_min_slide_angle(value: float64)
        
        /** If `true`, the body will not slide on slopes when calling [method move_and_slide] when the body is standing still.  
         *  If `false`, the body will slide on floor's slopes when [member velocity] applies a downward force.  
         */
        get floor_stop_on_slope(): boolean
        set floor_stop_on_slope(value: boolean)
        
        /** If `false` (by default), the body will move faster on downward slopes and slower on upward slopes.  
         *  If `true`, the body will always move at the same speed on the ground no matter the slope. Note that you need to use [member floor_snap_length] to stick along a downward slope at constant speed.  
         */
        get floor_constant_speed(): boolean
        set floor_constant_speed(value: boolean)
        
        /** If `true`, the body will be able to move on the floor only. This option avoids to be able to walk on walls, it will however allow to slide down along them. */
        get floor_block_on_wall(): boolean
        set floor_block_on_wall(value: boolean)
        
        /** Maximum angle (in radians) where a slope is still considered a floor (or a ceiling), rather than a wall, when calling [method move_and_slide]. The default value equals 45 degrees. */
        get floor_max_angle(): float64
        set floor_max_angle(value: float64)
        
        /** Sets a snapping distance. When set to a value different from `0.0`, the body is kept attached to slopes when calling [method move_and_slide]. The snapping vector is determined by the given distance along the opposite direction of the [member up_direction].  
         *  As long as the snapping vector is in contact with the ground and the body moves against [member up_direction], the body will remain attached to the surface. Snapping is not applied if the body moves along [member up_direction], meaning it contains vertical rising velocity, so it will be able to detach from the ground when jumping or when the body is pushed up by something. If you want to apply a snap without taking into account the velocity, use [method apply_floor_snap].  
         */
        get floor_snap_length(): float64
        set floor_snap_length(value: float64)
        
        /** Sets the behavior to apply when you leave a moving platform. By default, to be physically accurate, when you leave the last platform velocity is applied. See [enum PlatformOnLeave] constants for available behavior. */
        get platform_on_leave(): int64
        set platform_on_leave(value: int64)
        
        /** Collision layers that will be included for detecting floor bodies that will act as moving platforms to be followed by the [CharacterBody3D]. By default, all floor bodies are detected and propagate their velocity. */
        get platform_floor_layers(): int64
        set platform_floor_layers(value: int64)
        
        /** Collision layers that will be included for detecting wall bodies that will act as moving platforms to be followed by the [CharacterBody3D]. By default, all wall bodies are ignored. */
        get platform_wall_layers(): int64
        set platform_wall_layers(value: int64)
        
        /** Extra margin used for collision recovery when calling [method move_and_slide].  
         *  If the body is at least this close to another body, it will consider them to be colliding and will be pushed away before performing the actual motion.  
         *  A higher value means it's more flexible for detecting collision, which helps with consistently detecting walls and floors.  
         *  A lower value forces the collision algorithm to use more exact detection, so it can be used in cases that specifically require precision, e.g at very low scale to avoid visible jittering, or for stability with a stack of character bodies.  
         */
        get safe_margin(): float64
        set safe_margin(value: float64)
    }
    /** A button that represents a binary choice.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_checkbox.html  
     */
    class CheckBox<Map extends Record<string, Node> = Record<string, Node>> extends Button<Map> {
        constructor(identifier?: any)
    }
    /** A button that represents a binary choice.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_checkbutton.html  
     */
    class CheckButton<Map extends Record<string, Node> = Record<string, Node>> extends Button<Map> {
        constructor(identifier?: any)
    }
    /** A 2D circle shape used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_circleshape2d.html  
     */
    class CircleShape2D extends Shape2D {
        constructor(identifier?: any)
        /** The circle's radius. */
        get radius(): float64
        set radius(value: float64)
    }
    namespace CodeEdit {
        enum CodeCompletionKind {
            /** Marks the option as a class. */
            KIND_CLASS = 0,
            
            /** Marks the option as a function. */
            KIND_FUNCTION = 1,
            
            /** Marks the option as a Godot signal. */
            KIND_SIGNAL = 2,
            
            /** Marks the option as a variable. */
            KIND_VARIABLE = 3,
            
            /** Marks the option as a member. */
            KIND_MEMBER = 4,
            
            /** Marks the option as an enum entry. */
            KIND_ENUM = 5,
            
            /** Marks the option as a constant. */
            KIND_CONSTANT = 6,
            
            /** Marks the option as a Godot node path. */
            KIND_NODE_PATH = 7,
            
            /** Marks the option as a file path. */
            KIND_FILE_PATH = 8,
            
            /** Marks the option as unclassified or plain text. */
            KIND_PLAIN_TEXT = 9,
        }
        enum CodeCompletionLocation {
            /** The option is local to the location of the code completion query - e.g. a local variable. Subsequent value of location represent options from the outer class, the exact value represent how far they are (in terms of inner classes). */
            LOCATION_LOCAL = 0,
            
            /** The option is from the containing class or a parent class, relative to the location of the code completion query. Perform a bitwise OR with the class depth (e.g. `0` for the local class, `1` for the parent, `2` for the grandparent, etc.) to store the depth of an option in the class or a parent class. */
            LOCATION_PARENT_MASK = 256,
            
            /** The option is from user code which is not local and not in a derived class (e.g. Autoload Singletons). */
            LOCATION_OTHER_USER_CODE = 512,
            
            /** The option is from other engine code, not covered by the other enum constants - e.g. built-in classes. */
            LOCATION_OTHER = 1024,
        }
    }
    /** A multiline text editor designed for editing code.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_codeedit.html  
     */
    class CodeEdit<Map extends Record<string, Node> = Record<string, Node>> extends TextEdit<Map> {
        constructor(identifier?: any)
        /** Override this method to define how the selected entry should be inserted. If [param replace] is `true`, any existing text should be replaced. */
        /* gdvirtual */ _confirm_code_completion(replace: boolean): void
        
        /** Override this method to define what happens when the user requests code completion. If [param force] is `true`, any checks should be bypassed. */
        /* gdvirtual */ _request_code_completion(force: boolean): void
        
        /** Override this method to define what items in [param candidates] should be displayed.  
         *  Both [param candidates] and the return is a [Array] of [Dictionary], see [method get_code_completion_option] for [Dictionary] content.  
         */
        /* gdvirtual */ _filter_code_completion_candidates(candidates: GArray): GArray
        
        /** If there is no selection, indentation is inserted at the caret. Otherwise, the selected lines are indented like [method indent_lines]. Equivalent to the [member ProjectSettings.input/ui_text_indent] action. The indentation characters used depend on [member indent_use_spaces] and [member indent_size]. */
        do_indent(): void
        
        /** Indents all lines that are selected or have a caret on them. Uses spaces or a tab depending on [member indent_use_spaces]. See [method unindent_lines]. */
        indent_lines(): void
        
        /** Unindents all lines that are selected or have a caret on them. Uses spaces or a tab depending on [member indent_use_spaces]. Equivalent to the [member ProjectSettings.input/ui_text_dedent] action. See [method indent_lines]. */
        unindent_lines(): void
        
        /** Converts the indents of lines between [param from_line] and [param to_line] to tabs or spaces as set by [member indent_use_spaces].  
         *  Values of `-1` convert the entire text.  
         */
        convert_indent(from_line: int64 = -1, to_line: int64 = -1): void
        
        /** Adds a brace pair.  
         *  Both the start and end keys must be symbols. Only the start key has to be unique.  
         */
        add_auto_brace_completion_pair(start_key: string, end_key: string): void
        
        /** Returns `true` if open key [param open_key] exists. */
        has_auto_brace_completion_open_key(open_key: string): boolean
        
        /** Returns `true` if close key [param close_key] exists. */
        has_auto_brace_completion_close_key(close_key: string): boolean
        
        /** Gets the matching auto brace close key for [param open_key]. */
        get_auto_brace_completion_close_key(open_key: string): string
        
        /** Sets the given line as a breakpoint. If `true` and [member gutters_draw_breakpoints_gutter] is `true`, draws the [theme_item breakpoint] icon in the gutter for this line. See [method get_breakpointed_lines] and [method is_line_breakpointed]. */
        set_line_as_breakpoint(line: int64, breakpointed: boolean): void
        
        /** Returns `true` if the given line is breakpointed. See [method set_line_as_breakpoint]. */
        is_line_breakpointed(line: int64): boolean
        
        /** Clears all breakpointed lines. */
        clear_breakpointed_lines(): void
        
        /** Gets all breakpointed lines. */
        get_breakpointed_lines(): PackedInt32Array
        
        /** Sets the given line as bookmarked. If `true` and [member gutters_draw_bookmarks] is `true`, draws the [theme_item bookmark] icon in the gutter for this line. See [method get_bookmarked_lines] and [method is_line_bookmarked]. */
        set_line_as_bookmarked(line: int64, bookmarked: boolean): void
        
        /** Returns `true` if the given line is bookmarked. See [method set_line_as_bookmarked]. */
        is_line_bookmarked(line: int64): boolean
        
        /** Clears all bookmarked lines. */
        clear_bookmarked_lines(): void
        
        /** Gets all bookmarked lines. */
        get_bookmarked_lines(): PackedInt32Array
        
        /** Sets the given line as executing. If `true` and [member gutters_draw_executing_lines] is `true`, draws the [theme_item executing_line] icon in the gutter for this line. See [method get_executing_lines] and [method is_line_executing]. */
        set_line_as_executing(line: int64, executing: boolean): void
        
        /** Returns `true` if the given line is marked as executing. See [method set_line_as_executing]. */
        is_line_executing(line: int64): boolean
        
        /** Clears all executed lines. */
        clear_executing_lines(): void
        
        /** Gets all executing lines. */
        get_executing_lines(): PackedInt32Array
        
        /** Returns `true` if the given line is foldable. A line is foldable if it is the start of a valid code region (see [method get_code_region_start_tag]), if it is the start of a comment or string block, or if the next non-empty line is more indented (see [method TextEdit.get_indent_level]). */
        can_fold_line(line: int64): boolean
        
        /** Folds the given line, if possible (see [method can_fold_line]). */
        fold_line(line: int64): void
        
        /** Unfolds the given line if it is folded or if it is hidden under a folded line. */
        unfold_line(line: int64): void
        
        /** Folds all lines that are possible to be folded (see [method can_fold_line]). */
        fold_all_lines(): void
        
        /** Unfolds all lines that are folded. */
        unfold_all_lines(): void
        
        /** Toggle the folding of the code block at the given line. */
        toggle_foldable_line(line: int64): void
        
        /** Toggle the folding of the code block on all lines with a caret on them. */
        toggle_foldable_lines_at_carets(): void
        
        /** Returns `true` if the given line is folded. See [method fold_line]. */
        is_line_folded(line: int64): boolean
        
        /** Returns all lines that are currently folded. */
        get_folded_lines(): GArray
        
        /** Creates a new code region with the selection. At least one single line comment delimiter have to be defined (see [method add_comment_delimiter]).  
         *  A code region is a part of code that is highlighted when folded and can help organize your script.  
         *  Code region start and end tags can be customized (see [method set_code_region_tags]).  
         *  Code regions are delimited using start and end tags (respectively `region` and `endregion` by default) preceded by one line comment delimiter. (eg. `#region` and `#endregion`)  
         */
        create_code_region(): void
        
        /** Returns the code region start tag (without comment delimiter). */
        get_code_region_start_tag(): string
        
        /** Returns the code region end tag (without comment delimiter). */
        get_code_region_end_tag(): string
        
        /** Sets the code region start and end tags (without comment delimiter). */
        set_code_region_tags(start: string = 'region', end: string = 'endregion'): void
        
        /** Returns `true` if the given line is a code region start. See [method set_code_region_tags]. */
        is_line_code_region_start(line: int64): boolean
        
        /** Returns `true` if the given line is a code region end. See [method set_code_region_tags]. */
        is_line_code_region_end(line: int64): boolean
        
        /** Defines a string delimiter from [param start_key] to [param end_key]. Both keys should be symbols, and [param start_key] must not be shared with other delimiters.  
         *  If [param line_only] is `true` or [param end_key] is an empty [String], the region does not carry over to the next line.  
         */
        add_string_delimiter(start_key: string, end_key: string, line_only: boolean = false): void
        
        /** Removes the string delimiter with [param start_key]. */
        remove_string_delimiter(start_key: string): void
        
        /** Returns `true` if string [param start_key] exists. */
        has_string_delimiter(start_key: string): boolean
        
        /** Removes all string delimiters. */
        clear_string_delimiters(): void
        
        /** Returns the delimiter index if [param line] [param column] is in a string. If [param column] is not provided, will return the delimiter index if the entire [param line] is a string. Otherwise `-1`. */
        is_in_string(line: int64, column: int64 = -1): int64
        
        /** Adds a comment delimiter from [param start_key] to [param end_key]. Both keys should be symbols, and [param start_key] must not be shared with other delimiters.  
         *  If [param line_only] is `true` or [param end_key] is an empty [String], the region does not carry over to the next line.  
         */
        add_comment_delimiter(start_key: string, end_key: string, line_only: boolean = false): void
        
        /** Removes the comment delimiter with [param start_key]. */
        remove_comment_delimiter(start_key: string): void
        
        /** Returns `true` if comment [param start_key] exists. */
        has_comment_delimiter(start_key: string): boolean
        
        /** Removes all comment delimiters. */
        clear_comment_delimiters(): void
        
        /** Returns delimiter index if [param line] [param column] is in a comment. If [param column] is not provided, will return delimiter index if the entire [param line] is a comment. Otherwise `-1`. */
        is_in_comment(line: int64, column: int64 = -1): int64
        
        /** Gets the start key for a string or comment region index. */
        get_delimiter_start_key(delimiter_index: int64): string
        
        /** Gets the end key for a string or comment region index. */
        get_delimiter_end_key(delimiter_index: int64): string
        
        /** If [param line] [param column] is in a string or comment, returns the start position of the region. If not or no start could be found, both [Vector2] values will be `-1`. */
        get_delimiter_start_position(line: int64, column: int64): Vector2
        
        /** If [param line] [param column] is in a string or comment, returns the end position of the region. If not or no end could be found, both [Vector2] values will be `-1`. */
        get_delimiter_end_position(line: int64, column: int64): Vector2
        
        /** Sets the code hint text. Pass an empty string to clear. */
        set_code_hint(code_hint: string): void
        
        /** If `true`, the code hint will draw below the main caret. If `false`, the code hint will draw above the main caret. See [method set_code_hint]. */
        set_code_hint_draw_below(draw_below: boolean): void
        
        /** Returns the full text with char `0xFFFF` at the caret location. */
        get_text_for_code_completion(): string
        
        /** Emits [signal code_completion_requested], if [param force] is `true` will bypass all checks. Otherwise will check that the caret is in a word or in front of a prefix. Will ignore the request if all current options are of type file path, node path, or signal. */
        request_code_completion(force: boolean = false): void
        
        /** Submits an item to the queue of potential candidates for the autocomplete menu. Call [method update_code_completion_options] to update the list.  
         *  [param location] indicates location of the option relative to the location of the code completion query. See [enum CodeEdit.CodeCompletionLocation] for how to set this value.  
         *      
         *  **Note:** This list will replace all current candidates.  
         */
        add_code_completion_option(type: CodeEdit.CodeCompletionKind, display_text: string, insert_text: string, text_color: Color = new Color(1, 1, 1, 1), icon: Resource = undefined, value: any = <any> {}, location: int64 = 1024): void
        
        /** Submits all completion options added with [method add_code_completion_option]. Will try to force the autocomplete menu to popup, if [param force] is `true`.  
         *      
         *  **Note:** This will replace all current candidates.  
         */
        update_code_completion_options(force: boolean): void
        
        /** Gets all completion options, see [method get_code_completion_option] for return content. */
        get_code_completion_options(): GArray
        
        /** Gets the completion option at [param index]. The return [Dictionary] has the following key-values:  
         *  `kind`: [enum CodeCompletionKind]  
         *  `display_text`: Text that is shown on the autocomplete menu.  
         *  `insert_text`: Text that is to be inserted when this item is selected.  
         *  `font_color`: Color of the text on the autocomplete menu.  
         *  `icon`: Icon to draw on the autocomplete menu.  
         *  `default_value`: Value of the symbol.  
         */
        get_code_completion_option(index: int64): GDictionary
        
        /** Gets the index of the current selected completion option. */
        get_code_completion_selected_index(): int64
        
        /** Sets the current selected completion option. */
        set_code_completion_selected_index(index: int64): void
        
        /** Inserts the selected entry into the text. If [param replace] is `true`, any existing text is replaced rather than merged. */
        confirm_code_completion(replace: boolean = false): void
        
        /** Cancels the autocomplete menu. */
        cancel_code_completion(): void
        
        /** Returns the full text with char `0xFFFF` at the cursor location. */
        get_text_for_symbol_lookup(): string
        
        /** Returns the full text with char `0xFFFF` at the specified location. */
        get_text_with_cursor_char(line: int64, column: int64): string
        
        /** Sets the symbol emitted by [signal symbol_validate] as a valid lookup. */
        set_symbol_lookup_word_as_valid(valid: boolean): void
        
        /** Moves all lines up that are selected or have a caret on them. */
        move_lines_up(): void
        
        /** Moves all lines down that are selected or have a caret on them. */
        move_lines_down(): void
        
        /** Deletes all lines that are selected or have a caret on them. */
        delete_lines(): void
        
        /** Duplicates all selected text and duplicates all lines with a caret on them. */
        duplicate_selection(): void
        
        /** Duplicates all lines currently selected with any caret. Duplicates the entire line beneath the current one no matter where the caret is within the line. */
        duplicate_lines(): void
        
        /** Set when a validated word from [signal symbol_validate] is clicked, the [signal symbol_lookup] should be emitted. */
        get symbol_lookup_on_click(): boolean
        set symbol_lookup_on_click(value: boolean)
        
        /** Set when a word is hovered, the [signal symbol_hovered] should be emitted. */
        get symbol_tooltip_on_hover(): boolean
        set symbol_tooltip_on_hover(value: boolean)
        
        /** If `true`, lines can be folded. Otherwise, line folding methods like [method fold_line] will not work and [method can_fold_line] will always return `false`. See [member gutters_draw_fold_gutter]. */
        get line_folding(): boolean
        set line_folding(value: boolean)
        
        /** Draws vertical lines at the provided columns. The first entry is considered a main hard guideline and is draw more prominently. */
        get line_length_guidelines(): PackedInt32Array
        set line_length_guidelines(value: PackedInt32Array | int32[])
        
        /** If `true`, breakpoints are drawn in the gutter. This gutter is shared with bookmarks and executing lines. Clicking the gutter will toggle the breakpoint for the line, see [method set_line_as_breakpoint]. */
        get gutters_draw_breakpoints_gutter(): boolean
        set gutters_draw_breakpoints_gutter(value: boolean)
        
        /** If `true`, bookmarks are drawn in the gutter. This gutter is shared with breakpoints and executing lines. See [method set_line_as_bookmarked]. */
        get gutters_draw_bookmarks(): boolean
        set gutters_draw_bookmarks(value: boolean)
        
        /** If `true`, executing lines are marked in the gutter. This gutter is shared with breakpoints and bookmarks. See [method set_line_as_executing]. */
        get gutters_draw_executing_lines(): boolean
        set gutters_draw_executing_lines(value: boolean)
        
        /** If `true`, the line number gutter is drawn. Line numbers start at `1` and are incremented for each line of text. Clicking and dragging in the line number gutter will select entire lines of text. */
        get gutters_draw_line_numbers(): boolean
        set gutters_draw_line_numbers(value: boolean)
        
        /** If `true`, line numbers drawn in the gutter are zero padded based on the total line count. Requires [member gutters_draw_line_numbers] to be set to `true`. */
        get gutters_zero_pad_line_numbers(): boolean
        set gutters_zero_pad_line_numbers(value: boolean)
        
        /** If `true`, the fold gutter is drawn. In this gutter, the [theme_item can_fold_code_region] icon is drawn for each foldable line (see [method can_fold_line]) and the [theme_item folded_code_region] icon is drawn for each folded line (see [method is_line_folded]). These icons can be clicked to toggle the fold state, see [method toggle_foldable_line]. [member line_folding] must be `true` to show icons. */
        get gutters_draw_fold_gutter(): boolean
        set gutters_draw_fold_gutter(value: boolean)
        
        /** Sets the string delimiters. All existing string delimiters will be removed. */
        get delimiter_strings(): PackedStringArray
        set delimiter_strings(value: PackedStringArray | string[])
        
        /** Sets the comment delimiters. All existing comment delimiters will be removed. */
        get delimiter_comments(): PackedStringArray
        set delimiter_comments(value: PackedStringArray | string[])
        
        /** If `true`, the [member ProjectSettings.input/ui_text_completion_query] action requests code completion. To handle it, see [method _request_code_completion] or [signal code_completion_requested]. */
        get code_completion_enabled(): boolean
        set code_completion_enabled(value: boolean)
        
        /** Sets prefixes that will trigger code completion. */
        get code_completion_prefixes(): PackedStringArray
        set code_completion_prefixes(value: PackedStringArray | string[])
        
        /** Size of the tabulation indent (one [kbd]Tab[/kbd] press) in characters. If [member indent_use_spaces] is enabled the number of spaces to use. */
        get indent_size(): int64
        set indent_size(value: int64)
        
        /** Use spaces instead of tabs for indentation. */
        get indent_use_spaces(): boolean
        set indent_use_spaces(value: boolean)
        
        /** If `true`, an extra indent is automatically inserted when a new line is added and a prefix in [member indent_automatic_prefixes] is found. If a brace pair opening key is found, the matching closing brace will be moved to another new line (see [member auto_brace_completion_pairs]). */
        get indent_automatic(): boolean
        set indent_automatic(value: boolean)
        
        /** Prefixes to trigger an automatic indent. Used when [member indent_automatic] is set to `true`. */
        get indent_automatic_prefixes(): PackedStringArray
        set indent_automatic_prefixes(value: PackedStringArray | string[])
        
        /** If `true`, uses [member auto_brace_completion_pairs] to automatically insert the closing brace when the opening brace is inserted by typing or autocompletion. Also automatically removes the closing brace when using backspace on the opening brace. */
        get auto_brace_completion_enabled(): boolean
        set auto_brace_completion_enabled(value: boolean)
        
        /** If `true`, highlights brace pairs when the caret is on either one, using [member auto_brace_completion_pairs]. If matching, the pairs will be underlined. If a brace is unmatched, it is colored with [theme_item brace_mismatch_color]. */
        get auto_brace_completion_highlight_matching(): boolean
        set auto_brace_completion_highlight_matching(value: boolean)
        
        /** Sets the brace pairs to be autocompleted. For each entry in the dictionary, the key is the opening brace and the value is the closing brace that matches it. A brace is a [String] made of symbols. See [member auto_brace_completion_enabled] and [member auto_brace_completion_highlight_matching]. */
        get auto_brace_completion_pairs(): GDictionary
        set auto_brace_completion_pairs(value: GDictionary)
        
        /** Emitted when a breakpoint is added or removed from a line. If the line is moved via backspace a removed is emitted at the old line. */
        readonly breakpoint_toggled: Signal1<int64>
        
        /** Emitted when the user requests code completion. This signal will not be sent if [method _request_code_completion] is overridden or [member code_completion_enabled] is `false`. */
        readonly code_completion_requested: Signal0
        
        /** Emitted when the user has clicked on a valid symbol. */
        readonly symbol_lookup: Signal3<string, int64, int64>
        
        /** Emitted when the user hovers over a symbol. The symbol should be validated and responded to, by calling [method set_symbol_lookup_word_as_valid].  
         *      
         *  **Note:** [member symbol_lookup_on_click] must be `true` for this signal to be emitted.  
         */
        readonly symbol_validate: Signal1<string>
        
        /** Emitted when the user hovers over a symbol. Unlike [signal Control.mouse_entered], this signal is not emitted immediately, but when the cursor is over the symbol for [member ProjectSettings.gui/timers/tooltip_delay_sec] seconds.  
         *      
         *  **Note:** [member symbol_tooltip_on_hover] must be `true` for this signal to be emitted.  
         */
        readonly symbol_hovered: Signal3<string, int64, int64>
    }
    /** A syntax highlighter intended for code.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_codehighlighter.html  
     */
    class CodeHighlighter extends SyntaxHighlighter {
        constructor(identifier?: any)
        /** Sets the color for a keyword.  
         *  The keyword cannot contain any symbols except '_'.  
         */
        add_keyword_color(keyword: string, color: Color): void
        
        /** Removes the keyword. */
        remove_keyword_color(keyword: string): void
        
        /** Returns `true` if the keyword exists, else `false`. */
        has_keyword_color(keyword: string): boolean
        
        /** Returns the color for a keyword. */
        get_keyword_color(keyword: string): Color
        
        /** Removes all keywords. */
        clear_keyword_colors(): void
        
        /** Sets the color for a member keyword.  
         *  The member keyword cannot contain any symbols except '_'.  
         *  It will not be highlighted if preceded by a '.'.  
         */
        add_member_keyword_color(member_keyword: string, color: Color): void
        
        /** Removes the member keyword. */
        remove_member_keyword_color(member_keyword: string): void
        
        /** Returns `true` if the member keyword exists, else `false`. */
        has_member_keyword_color(member_keyword: string): boolean
        
        /** Returns the color for a member keyword. */
        get_member_keyword_color(member_keyword: string): Color
        
        /** Removes all member keywords. */
        clear_member_keyword_colors(): void
        
        /** Adds a color region (such as for comments or strings) from [param start_key] to [param end_key]. Both keys should be symbols, and [param start_key] must not be shared with other delimiters.  
         *  If [param line_only] is `true` or [param end_key] is an empty [String], the region does not carry over to the next line.  
         */
        add_color_region(start_key: string, end_key: string, color: Color, line_only: boolean = false): void
        
        /** Removes the color region that uses that start key. */
        remove_color_region(start_key: string): void
        
        /** Returns `true` if the start key exists, else `false`. */
        has_color_region(start_key: string): boolean
        
        /** Removes all color regions. */
        clear_color_regions(): void
        
        /** Sets the color for numbers. */
        get number_color(): Color
        set number_color(value: Color)
        
        /** Sets the color for symbols. */
        get symbol_color(): Color
        set symbol_color(value: Color)
        
        /** Sets color for functions. A function is a non-keyword string followed by a '('. */
        get function_color(): Color
        set function_color(value: Color)
        
        /** Sets color for member variables. A member variable is non-keyword, non-function string proceeded with a '.'. */
        get member_variable_color(): Color
        set member_variable_color(value: Color)
        
        /** Sets the keyword colors. All existing keywords will be removed. The [Dictionary] key is the keyword. The value is the keyword color. */
        get keyword_colors(): GDictionary
        set keyword_colors(value: GDictionary)
        
        /** Sets the member keyword colors. All existing member keyword will be removed. The [Dictionary] key is the member keyword. The value is the member keyword color. */
        get member_keyword_colors(): GDictionary
        set member_keyword_colors(value: GDictionary)
        
        /** Sets the color regions. All existing regions will be removed. The [Dictionary] key is the region start and end key, separated by a space. The value is the region color. */
        get color_regions(): GDictionary
        set color_regions(value: GDictionary)
    }
    namespace CollisionObject2D {
        enum DisableMode {
            /** When [member Node.process_mode] is set to [constant Node.PROCESS_MODE_DISABLED], remove from the physics simulation to stop all physics interactions with this [CollisionObject2D].  
             *  Automatically re-added to the physics simulation when the [Node] is processed again.  
             */
            DISABLE_MODE_REMOVE = 0,
            
            /** When [member Node.process_mode] is set to [constant Node.PROCESS_MODE_DISABLED], make the body static. Doesn't affect [Area2D]. [PhysicsBody2D] can't be affected by forces or other bodies while static.  
             *  Automatically set [PhysicsBody2D] back to its original mode when the [Node] is processed again.  
             */
            DISABLE_MODE_MAKE_STATIC = 1,
            
            /** When [member Node.process_mode] is set to [constant Node.PROCESS_MODE_DISABLED], do not affect the physics simulation. */
            DISABLE_MODE_KEEP_ACTIVE = 2,
        }
    }
    /** Abstract base class for 2D physics objects.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_collisionobject2d.html  
     */
    class CollisionObject2D<Map extends Record<string, Node> = Record<string, Node>> extends Node2D<Map> {
        constructor(identifier?: any)
        /** Accepts unhandled [InputEvent]s. [param shape_idx] is the child index of the clicked [Shape2D]. Connect to [signal input_event] to easily pick up these events.  
         *      
         *  **Note:** [method _input_event] requires [member input_pickable] to be `true` and at least one [member collision_layer] bit to be set.  
         */
        /* gdvirtual */ _input_event(viewport: Viewport, event: InputEvent, shape_idx: int64): void
        
        /** Called when the mouse pointer enters any of this object's shapes. Requires [member input_pickable] to be `true` and at least one [member collision_layer] bit to be set. Note that moving between different shapes within a single [CollisionObject2D] won't cause this function to be called. */
        /* gdvirtual */ _mouse_enter(): void
        
        /** Called when the mouse pointer exits all this object's shapes. Requires [member input_pickable] to be `true` and at least one [member collision_layer] bit to be set. Note that moving between different shapes within a single [CollisionObject2D] won't cause this function to be called. */
        /* gdvirtual */ _mouse_exit(): void
        
        /** Called when the mouse pointer enters any of this object's shapes or moves from one shape to another. [param shape_idx] is the child index of the newly entered [Shape2D]. Requires [member input_pickable] to be `true` and at least one [member collision_layer] bit to be called. */
        /* gdvirtual */ _mouse_shape_enter(shape_idx: int64): void
        
        /** Called when the mouse pointer exits any of this object's shapes. [param shape_idx] is the child index of the exited [Shape2D]. Requires [member input_pickable] to be `true` and at least one [member collision_layer] bit to be called. */
        /* gdvirtual */ _mouse_shape_exit(shape_idx: int64): void
        
        /** Returns the object's [RID]. */
        get_rid(): RID
        
        /** Based on [param value], enables or disables the specified layer in the [member collision_layer], given a [param layer_number] between 1 and 32. */
        set_collision_layer_value(layer_number: int64, value: boolean): void
        
        /** Returns whether or not the specified layer of the [member collision_layer] is enabled, given a [param layer_number] between 1 and 32. */
        get_collision_layer_value(layer_number: int64): boolean
        
        /** Based on [param value], enables or disables the specified layer in the [member collision_mask], given a [param layer_number] between 1 and 32. */
        set_collision_mask_value(layer_number: int64, value: boolean): void
        
        /** Returns whether or not the specified layer of the [member collision_mask] is enabled, given a [param layer_number] between 1 and 32. */
        get_collision_mask_value(layer_number: int64): boolean
        
        /** Creates a new shape owner for the given object. Returns `owner_id` of the new owner for future reference. */
        create_shape_owner(owner: Object): int64
        
        /** Removes the given shape owner. */
        remove_shape_owner(owner_id: int64): void
        
        /** Returns an [Array] of `owner_id` identifiers. You can use these ids in other methods that take `owner_id` as an argument. */
        get_shape_owners(): PackedInt32Array
        
        /** Sets the [Transform2D] of the given shape owner. */
        shape_owner_set_transform(owner_id: int64, transform: Transform2D): void
        
        /** Returns the shape owner's [Transform2D]. */
        shape_owner_get_transform(owner_id: int64): Transform2D
        
        /** Returns the parent object of the given shape owner. */
        shape_owner_get_owner(owner_id: int64): Object
        
        /** If `true`, disables the given shape owner. */
        shape_owner_set_disabled(owner_id: int64, disabled: boolean): void
        
        /** If `true`, the shape owner and its shapes are disabled. */
        is_shape_owner_disabled(owner_id: int64): boolean
        
        /** If [param enable] is `true`, collisions for the shape owner originating from this [CollisionObject2D] will not be reported to collided with [CollisionObject2D]s. */
        shape_owner_set_one_way_collision(owner_id: int64, enable: boolean): void
        
        /** Returns `true` if collisions for the shape owner originating from this [CollisionObject2D] will not be reported to collided with [CollisionObject2D]s. */
        is_shape_owner_one_way_collision_enabled(owner_id: int64): boolean
        
        /** Sets the `one_way_collision_margin` of the shape owner identified by given [param owner_id] to [param margin] pixels. */
        shape_owner_set_one_way_collision_margin(owner_id: int64, margin: float64): void
        
        /** Returns the `one_way_collision_margin` of the shape owner identified by given [param owner_id]. */
        get_shape_owner_one_way_collision_margin(owner_id: int64): float64
        
        /** Adds a [Shape2D] to the shape owner. */
        shape_owner_add_shape(owner_id: int64, shape: Shape2D): void
        
        /** Returns the number of shapes the given shape owner contains. */
        shape_owner_get_shape_count(owner_id: int64): int64
        
        /** Returns the [Shape2D] with the given ID from the given shape owner. */
        shape_owner_get_shape(owner_id: int64, shape_id: int64): Shape2D
        
        /** Returns the child index of the [Shape2D] with the given ID from the given shape owner. */
        shape_owner_get_shape_index(owner_id: int64, shape_id: int64): int64
        
        /** Removes a shape from the given shape owner. */
        shape_owner_remove_shape(owner_id: int64, shape_id: int64): void
        
        /** Removes all shapes from the shape owner. */
        shape_owner_clear_shapes(owner_id: int64): void
        
        /** Returns the `owner_id` of the given shape. */
        shape_find_owner(shape_index: int64): int64
        
        /** Defines the behavior in physics when [member Node.process_mode] is set to [constant Node.PROCESS_MODE_DISABLED]. See [enum DisableMode] for more details about the different modes. */
        get disable_mode(): int64
        set disable_mode(value: int64)
        
        /** The physics layers this CollisionObject2D is in. Collision objects can exist in one or more of 32 different layers. See also [member collision_mask].  
         *      
         *  **Note:** Object A can detect a contact with object B only if object B is in any of the layers that object A scans. See [url=https://docs.godotengine.org/en/4.4/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information.  
         */
        get collision_layer(): int64
        set collision_layer(value: int64)
        
        /** The physics layers this CollisionObject2D scans. Collision objects can scan one or more of 32 different layers. See also [member collision_layer].  
         *      
         *  **Note:** Object A can detect a contact with object B only if object B is in any of the layers that object A scans. See [url=https://docs.godotengine.org/en/4.4/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information.  
         */
        get collision_mask(): int64
        set collision_mask(value: int64)
        
        /** The priority used to solve colliding when occurring penetration. The higher the priority is, the lower the penetration into the object will be. This can for example be used to prevent the player from breaking through the boundaries of a level. */
        get collision_priority(): float64
        set collision_priority(value: float64)
        
        /** If `true`, this object is pickable. A pickable object can detect the mouse pointer entering/leaving, and if the mouse is inside it, report input events. Requires at least one [member collision_layer] bit to be set. */
        get input_pickable(): boolean
        set input_pickable(value: boolean)
        
        /** Emitted when an input event occurs. Requires [member input_pickable] to be `true` and at least one [member collision_layer] bit to be set. See [method _input_event] for details. */
        readonly input_event: Signal3<Node, InputEvent, int64>
        
        /** Emitted when the mouse pointer enters any of this object's shapes. Requires [member input_pickable] to be `true` and at least one [member collision_layer] bit to be set. Note that moving between different shapes within a single [CollisionObject2D] won't cause this signal to be emitted.  
         *      
         *  **Note:** Due to the lack of continuous collision detection, this signal may not be emitted in the expected order if the mouse moves fast enough and the [CollisionObject2D]'s area is small. This signal may also not be emitted if another [CollisionObject2D] is overlapping the [CollisionObject2D] in question.  
         */
        readonly mouse_entered: Signal0
        
        /** Emitted when the mouse pointer exits all this object's shapes. Requires [member input_pickable] to be `true` and at least one [member collision_layer] bit to be set. Note that moving between different shapes within a single [CollisionObject2D] won't cause this signal to be emitted.  
         *      
         *  **Note:** Due to the lack of continuous collision detection, this signal may not be emitted in the expected order if the mouse moves fast enough and the [CollisionObject2D]'s area is small. This signal may also not be emitted if another [CollisionObject2D] is overlapping the [CollisionObject2D] in question.  
         */
        readonly mouse_exited: Signal0
        
        /** Emitted when the mouse pointer enters any of this object's shapes or moves from one shape to another. [param shape_idx] is the child index of the newly entered [Shape2D]. Requires [member input_pickable] to be `true` and at least one [member collision_layer] bit to be set. */
        readonly mouse_shape_entered: Signal1<int64>
        
        /** Emitted when the mouse pointer exits any of this object's shapes. [param shape_idx] is the child index of the exited [Shape2D]. Requires [member input_pickable] to be `true` and at least one [member collision_layer] bit to be set. */
        readonly mouse_shape_exited: Signal1<int64>
    }
    namespace CollisionObject3D {
        enum DisableMode {
            /** When [member Node.process_mode] is set to [constant Node.PROCESS_MODE_DISABLED], remove from the physics simulation to stop all physics interactions with this [CollisionObject3D].  
             *  Automatically re-added to the physics simulation when the [Node] is processed again.  
             */
            DISABLE_MODE_REMOVE = 0,
            
            /** When [member Node.process_mode] is set to [constant Node.PROCESS_MODE_DISABLED], make the body static. Doesn't affect [Area3D]. [PhysicsBody3D] can't be affected by forces or other bodies while static.  
             *  Automatically set [PhysicsBody3D] back to its original mode when the [Node] is processed again.  
             */
            DISABLE_MODE_MAKE_STATIC = 1,
            
            /** When [member Node.process_mode] is set to [constant Node.PROCESS_MODE_DISABLED], do not affect the physics simulation. */
            DISABLE_MODE_KEEP_ACTIVE = 2,
        }
    }
    /** Abstract base class for 3D physics objects.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_collisionobject3d.html  
     */
    class CollisionObject3D<Map extends Record<string, Node> = Record<string, Node>> extends Node3D<Map> {
        constructor(identifier?: any)
        /** Receives unhandled [InputEvent]s. [param event_position] is the location in world space of the mouse pointer on the surface of the shape with index [param shape_idx] and [param normal] is the normal vector of the surface at that point. Connect to the [signal input_event] signal to easily pick up these events.  
         *      
         *  **Note:** [method _input_event] requires [member input_ray_pickable] to be `true` and at least one [member collision_layer] bit to be set.  
         */
        /* gdvirtual */ _input_event(camera: Camera3D, event: InputEvent, event_position: Vector3, normal: Vector3, shape_idx: int64): void
        
        /** Called when the mouse pointer enters any of this object's shapes. Requires [member input_ray_pickable] to be `true` and at least one [member collision_layer] bit to be set. Note that moving between different shapes within a single [CollisionObject3D] won't cause this function to be called. */
        /* gdvirtual */ _mouse_enter(): void
        
        /** Called when the mouse pointer exits all this object's shapes. Requires [member input_ray_pickable] to be `true` and at least one [member collision_layer] bit to be set. Note that moving between different shapes within a single [CollisionObject3D] won't cause this function to be called. */
        /* gdvirtual */ _mouse_exit(): void
        
        /** Based on [param value], enables or disables the specified layer in the [member collision_layer], given a [param layer_number] between 1 and 32. */
        set_collision_layer_value(layer_number: int64, value: boolean): void
        
        /** Returns whether or not the specified layer of the [member collision_layer] is enabled, given a [param layer_number] between 1 and 32. */
        get_collision_layer_value(layer_number: int64): boolean
        
        /** Based on [param value], enables or disables the specified layer in the [member collision_mask], given a [param layer_number] between 1 and 32. */
        set_collision_mask_value(layer_number: int64, value: boolean): void
        
        /** Returns whether or not the specified layer of the [member collision_mask] is enabled, given a [param layer_number] between 1 and 32. */
        get_collision_mask_value(layer_number: int64): boolean
        
        /** Returns the object's [RID]. */
        get_rid(): RID
        
        /** Creates a new shape owner for the given object. Returns `owner_id` of the new owner for future reference. */
        create_shape_owner(owner: Object): int64
        
        /** Removes the given shape owner. */
        remove_shape_owner(owner_id: int64): void
        
        /** Returns an [Array] of `owner_id` identifiers. You can use these ids in other methods that take `owner_id` as an argument. */
        get_shape_owners(): PackedInt32Array
        
        /** Sets the [Transform3D] of the given shape owner. */
        shape_owner_set_transform(owner_id: int64, transform: Transform3D): void
        
        /** Returns the shape owner's [Transform3D]. */
        shape_owner_get_transform(owner_id: int64): Transform3D
        
        /** Returns the parent object of the given shape owner. */
        shape_owner_get_owner(owner_id: int64): Object
        
        /** If `true`, disables the given shape owner. */
        shape_owner_set_disabled(owner_id: int64, disabled: boolean): void
        
        /** If `true`, the shape owner and its shapes are disabled. */
        is_shape_owner_disabled(owner_id: int64): boolean
        
        /** Adds a [Shape3D] to the shape owner. */
        shape_owner_add_shape(owner_id: int64, shape: Shape3D): void
        
        /** Returns the number of shapes the given shape owner contains. */
        shape_owner_get_shape_count(owner_id: int64): int64
        
        /** Returns the [Shape3D] with the given ID from the given shape owner. */
        shape_owner_get_shape(owner_id: int64, shape_id: int64): Shape3D
        
        /** Returns the child index of the [Shape3D] with the given ID from the given shape owner. */
        shape_owner_get_shape_index(owner_id: int64, shape_id: int64): int64
        
        /** Removes a shape from the given shape owner. */
        shape_owner_remove_shape(owner_id: int64, shape_id: int64): void
        
        /** Removes all shapes from the shape owner. */
        shape_owner_clear_shapes(owner_id: int64): void
        
        /** Returns the `owner_id` of the given shape. */
        shape_find_owner(shape_index: int64): int64
        
        /** Defines the behavior in physics when [member Node.process_mode] is set to [constant Node.PROCESS_MODE_DISABLED]. See [enum DisableMode] for more details about the different modes. */
        get disable_mode(): int64
        set disable_mode(value: int64)
        
        /** The physics layers this CollisionObject3D **is in**. Collision objects can exist in one or more of 32 different layers. See also [member collision_mask].  
         *      
         *  **Note:** Object A can detect a contact with object B only if object B is in any of the layers that object A scans. See [url=https://docs.godotengine.org/en/4.4/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information.  
         */
        get collision_layer(): int64
        set collision_layer(value: int64)
        
        /** The physics layers this CollisionObject3D **scans**. Collision objects can scan one or more of 32 different layers. See also [member collision_layer].  
         *      
         *  **Note:** Object A can detect a contact with object B only if object B is in any of the layers that object A scans. See [url=https://docs.godotengine.org/en/4.4/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information.  
         */
        get collision_mask(): int64
        set collision_mask(value: int64)
        
        /** The priority used to solve colliding when occurring penetration. The higher the priority is, the lower the penetration into the object will be. This can for example be used to prevent the player from breaking through the boundaries of a level. */
        get collision_priority(): float64
        set collision_priority(value: float64)
        
        /** If `true`, this object is pickable. A pickable object can detect the mouse pointer entering/leaving, and if the mouse is inside it, report input events. Requires at least one [member collision_layer] bit to be set. */
        get input_ray_pickable(): boolean
        set input_ray_pickable(value: boolean)
        
        /** If `true`, the [CollisionObject3D] will continue to receive input events as the mouse is dragged across its shapes. */
        get input_capture_on_drag(): boolean
        set input_capture_on_drag(value: boolean)
        
        /** Emitted when the object receives an unhandled [InputEvent]. [param event_position] is the location in world space of the mouse pointer on the surface of the shape with index [param shape_idx] and [param normal] is the normal vector of the surface at that point. */
        readonly input_event: Signal5<Node, InputEvent, Vector3, Vector3, int64>
        
        /** Emitted when the mouse pointer enters any of this object's shapes. Requires [member input_ray_pickable] to be `true` and at least one [member collision_layer] bit to be set.  
         *      
         *  **Note:** Due to the lack of continuous collision detection, this signal may not be emitted in the expected order if the mouse moves fast enough and the [CollisionObject3D]'s area is small. This signal may also not be emitted if another [CollisionObject3D] is overlapping the [CollisionObject3D] in question.  
         */
        readonly mouse_entered: Signal0
        
        /** Emitted when the mouse pointer exits all this object's shapes. Requires [member input_ray_pickable] to be `true` and at least one [member collision_layer] bit to be set.  
         *      
         *  **Note:** Due to the lack of continuous collision detection, this signal may not be emitted in the expected order if the mouse moves fast enough and the [CollisionObject3D]'s area is small. This signal may also not be emitted if another [CollisionObject3D] is overlapping the [CollisionObject3D] in question.  
         */
        readonly mouse_exited: Signal0
    }
    class CollisionObject3DGizmoPlugin extends EditorNode3DGizmoPlugin {
        constructor(identifier?: any)
    }
    namespace CollisionPolygon2D {
        enum BuildMode {
            /** Collisions will include the polygon and its contained area. In this mode the node has the same effect as several [ConvexPolygonShape2D] nodes, one for each convex shape in the convex decomposition of the polygon (but without the overhead of multiple nodes). */
            BUILD_SOLIDS = 0,
            
            /** Collisions will only include the polygon edges. In this mode the node has the same effect as a single [ConcavePolygonShape2D] made of segments, with the restriction that each segment (after the first one) starts where the previous one ends, and the last one ends where the first one starts (forming a closed but hollow polygon). */
            BUILD_SEGMENTS = 1,
        }
    }
    /** A node that provides a polygon shape to a [CollisionObject2D] parent.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_collisionpolygon2d.html  
     */
    class CollisionPolygon2D<Map extends Record<string, Node> = Record<string, Node>> extends Node2D<Map> {
        constructor(identifier?: any)
        /** Collision build mode. Use one of the [enum BuildMode] constants. */
        get build_mode(): int64
        set build_mode(value: int64)
        
        /** The polygon's list of vertices. Each point will be connected to the next, and the final point will be connected to the first.  
         *      
         *  **Note:** The returned vertices are in the local coordinate space of the given [CollisionPolygon2D].  
         */
        get polygon(): PackedVector2Array
        set polygon(value: PackedVector2Array | Vector2[])
        
        /** If `true`, no collisions will be detected. */
        get disabled(): boolean
        set disabled(value: boolean)
        
        /** If `true`, only edges that face up, relative to [CollisionPolygon2D]'s rotation, will collide with other objects.  
         *      
         *  **Note:** This property has no effect if this [CollisionPolygon2D] is a child of an [Area2D] node.  
         */
        get one_way_collision(): boolean
        set one_way_collision(value: boolean)
        
        /** The margin used for one-way collision (in pixels). Higher values will make the shape thicker, and work better for colliders that enter the polygon at a high velocity. */
        get one_way_collision_margin(): float64
        set one_way_collision_margin(value: float64)
    }
    class CollisionPolygon2DEditor<Map extends Record<string, Node> = Record<string, Node>> extends AbstractPolygon2DEditor<Map> {
        constructor(identifier?: any)
    }
    class CollisionPolygon2DEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends AbstractPolygon2DEditorPlugin<Map> {
        constructor(identifier?: any)
    }
    /** A node that provides a thickened polygon shape (a prism) to a [CollisionObject3D] parent.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_collisionpolygon3d.html  
     */
    class CollisionPolygon3D<Map extends Record<string, Node> = Record<string, Node>> extends Node3D<Map> {
        constructor(identifier?: any)
        _is_editable_3d_polygon(): boolean
        
        /** Length that the resulting collision extends in either direction perpendicular to its 2D polygon. */
        get depth(): float64
        set depth(value: float64)
        
        /** If `true`, no collision will be produced. */
        get disabled(): boolean
        set disabled(value: boolean)
        
        /** Array of vertices which define the 2D polygon in the local XY plane. */
        get polygon(): PackedVector2Array
        set polygon(value: PackedVector2Array | Vector2[])
        
        /** The collision margin for the generated [Shape3D]. See [member Shape3D.margin] for more details. */
        get margin(): float64
        set margin(value: float64)
        
        /** The collision shape color that is displayed in the editor, or in the running project if **Debug > Visible Collision Shapes** is checked at the top of the editor.  
         *      
         *  **Note:** The default value is [member ProjectSettings.debug/shapes/collision/shape_color]. The `Color(0, 0, 0, 0)` value documented here is a placeholder, and not the actual default debug color.  
         */
        get debug_color(): Color
        set debug_color(value: Color)
        
        /** If `true`, when the shape is displayed, it will show a solid fill color in addition to its wireframe. */
        get debug_fill(): boolean
        set debug_fill(value: boolean)
    }
    class CollisionPolygon3DGizmoPlugin extends EditorNode3DGizmoPlugin {
        constructor(identifier?: any)
    }
    /** A node that provides a [Shape2D] to a [CollisionObject2D] parent.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_collisionshape2d.html  
     */
    class CollisionShape2D<Map extends Record<string, Node> = Record<string, Node>> extends Node2D<Map> {
        constructor(identifier?: any)
        /** The actual shape owned by this collision shape. */
        get shape(): Shape2D
        set shape(value: Shape2D)
        
        /** A disabled collision shape has no effect in the world. This property should be changed with [method Object.set_deferred]. */
        get disabled(): boolean
        set disabled(value: boolean)
        
        /** Sets whether this collision shape should only detect collision on one side (top or bottom).  
         *      
         *  **Note:** This property has no effect if this [CollisionShape2D] is a child of an [Area2D] node.  
         */
        get one_way_collision(): boolean
        set one_way_collision(value: boolean)
        
        /** The margin used for one-way collision (in pixels). Higher values will make the shape thicker, and work better for colliders that enter the shape at a high velocity. */
        get one_way_collision_margin(): float64
        set one_way_collision_margin(value: float64)
        
        /** The collision shape color that is displayed in the editor, or in the running project if **Debug > Visible Collision Shapes** is checked at the top of the editor.  
         *      
         *  **Note:** The default value is [member ProjectSettings.debug/shapes/collision/shape_color]. The `Color(0, 0, 0, 0)` value documented here is a placeholder, and not the actual default debug color.  
         */
        get debug_color(): Color
        set debug_color(value: Color)
    }
    class CollisionShape2DEditor<Map extends Record<string, Node> = Record<string, Node>> extends Control<Map> {
        constructor(identifier?: any)
    }
    class CollisionShape2DEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    /** A node that provides a [Shape3D] to a [CollisionObject3D] parent.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_collisionshape3d.html  
     */
    class CollisionShape3D<Map extends Record<string, Node> = Record<string, Node>> extends Node3D<Map> {
        constructor(identifier?: any)
        /** This method does nothing. */
        resource_changed(resource: Resource): void
        
        /** Sets the collision shape's shape to the addition of all its convexed [MeshInstance3D] siblings geometry. */
        make_convex_from_siblings(): void
        
        /** The actual shape owned by this collision shape. */
        get shape(): Shape3D
        set shape(value: Shape3D)
        
        /** A disabled collision shape has no effect in the world. */
        get disabled(): boolean
        set disabled(value: boolean)
        
        /** The collision shape color that is displayed in the editor, or in the running project if **Debug > Visible Collision Shapes** is checked at the top of the editor.  
         *      
         *  **Note:** The default value is [member ProjectSettings.debug/shapes/collision/shape_color]. The `Color(0, 0, 0, 0)` value documented here is a placeholder, and not the actual default debug color.  
         */
        get debug_color(): Color
        set debug_color(value: Color)
        
        /** If `true`, when the shape is displayed, it will show a solid fill color in addition to its wireframe. */
        get debug_fill(): boolean
        set debug_fill(value: boolean)
    }
    class CollisionShape3DGizmoPlugin extends EditorNode3DGizmoPlugin {
        constructor(identifier?: any)
    }
    /** A resource class for managing a palette of colors, which can be loaded and saved using [ColorPicker].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_colorpalette.html  
     */
    class ColorPalette extends Resource {
        constructor(identifier?: any)
        /** A [PackedColorArray] containing the colors in the palette. */
        get colors(): PackedColorArray
        set colors(value: PackedColorArray | Color[])
    }
    namespace ColorPicker {
        enum ColorModeType {
            /** Allows editing the color with Red/Green/Blue sliders. */
            MODE_RGB = 0,
            
            /** Allows editing the color with Hue/Saturation/Value sliders. */
            MODE_HSV = 1,
            
            /** Allows the color R, G, B component values to go beyond 1.0, which can be used for certain special operations that require it (like tinting without darkening or rendering sprites in HDR). */
            MODE_RAW = 2,
            
            /** Allows editing the color with Hue/Saturation/Lightness sliders.  
             *  OKHSL is a new color space similar to HSL but that better match perception by leveraging the Oklab color space which is designed to be simple to use, while doing a good job at predicting perceived lightness, chroma and hue.  
             *  [url=https://bottosson.github.io/posts/colorpicker/]Okhsv and Okhsl color spaces[/url]  
             */
            MODE_OKHSL = 3,
        }
        enum PickerShapeType {
            /** HSV Color Model rectangle color space. */
            SHAPE_HSV_RECTANGLE = 0,
            
            /** HSV Color Model rectangle color space with a wheel. */
            SHAPE_HSV_WHEEL = 1,
            
            /** HSV Color Model circle color space. Use Saturation as a radius. */
            SHAPE_VHS_CIRCLE = 2,
            
            /** HSL OK Color Model circle color space. */
            SHAPE_OKHSL_CIRCLE = 3,
            
            /** The color space shape and the shape select button are hidden. Can't be selected from the shapes popup. */
            SHAPE_NONE = 4,
        }
    }
    /** A widget that provides an interface for selecting or modifying a color.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_colorpicker.html  
     */
    class ColorPicker<Map extends Record<string, Node> = Record<string, Node>> extends VBoxContainer<Map> {
        constructor(identifier?: any)
        /** Adds the given color to a list of color presets. The presets are displayed in the color picker and the user will be able to select them.  
         *      
         *  **Note:** The presets list is only for  *this*  color picker.  
         */
        add_preset(color: Color): void
        
        /** Removes the given color from the list of color presets of this color picker. */
        erase_preset(color: Color): void
        
        /** Returns the list of colors in the presets of the color picker. */
        get_presets(): PackedColorArray
        
        /** Adds the given color to a list of color recent presets so that it can be picked later. Recent presets are the colors that were picked recently, a new preset is automatically created and added to recent presets when you pick a new color.  
         *      
         *  **Note:** The recent presets list is only for  *this*  color picker.  
         */
        add_recent_preset(color: Color): void
        
        /** Removes the given color from the list of color recent presets of this color picker. */
        erase_recent_preset(color: Color): void
        
        /** Returns the list of colors in the recent presets of the color picker. */
        get_recent_presets(): PackedColorArray
        
        /** The currently selected color. */
        get color(): Color
        set color(value: Color)
        
        /** If `true`, shows an alpha channel slider (opacity). */
        get edit_alpha(): boolean
        set edit_alpha(value: boolean)
        
        /** The currently selected color mode. See [enum ColorModeType]. */
        get color_mode(): int64
        set color_mode(value: int64)
        
        /** If `true`, the color will apply only after the user releases the mouse button, otherwise it will apply immediately even in mouse motion event (which can cause performance issues). */
        get deferred_mode(): boolean
        set deferred_mode(value: boolean)
        
        /** The shape of the color space view. See [enum PickerShapeType]. */
        get picker_shape(): int64
        set picker_shape(value: int64)
        
        /** If `true`, it's possible to add presets under Swatches. If `false`, the button to add presets is disabled. */
        get can_add_swatches(): boolean
        set can_add_swatches(value: boolean)
        
        /** If `true`, the color sampler and color preview are visible. */
        get sampler_visible(): boolean
        set sampler_visible(value: boolean)
        
        /** If `true`, the color mode buttons are visible. */
        get color_modes_visible(): boolean
        set color_modes_visible(value: boolean)
        
        /** If `true`, the color sliders are visible. */
        get sliders_visible(): boolean
        set sliders_visible(value: boolean)
        
        /** If `true`, the hex color code input field is visible. */
        get hex_visible(): boolean
        set hex_visible(value: boolean)
        
        /** If `true`, the Swatches and Recent Colors presets are visible. */
        get presets_visible(): boolean
        set presets_visible(value: boolean)
        
        /** Emitted when the color is changed. */
        readonly color_changed: Signal1<Color>
        
        /** Emitted when a preset is added. */
        readonly preset_added: Signal1<Color>
        
        /** Emitted when a preset is removed. */
        readonly preset_removed: Signal1<Color>
    }
    /** A button that brings up a [ColorPicker] when pressed.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_colorpickerbutton.html  
     */
    class ColorPickerButton<Map extends Record<string, Node> = Record<string, Node>> extends Button<Map> {
        constructor(identifier?: any)
        /** Returns the [ColorPicker] that this node toggles.  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member CanvasItem.visible] property.  
         */
        get_picker(): ColorPicker
        
        /** Returns the control's [PopupPanel] which allows you to connect to popup signals. This allows you to handle events when the ColorPicker is shown or hidden.  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member Window.visible] property.  
         */
        get_popup(): PopupPanel
        _about_to_popup(): void
        
        /** The currently selected color. */
        get color(): Color
        set color(value: Color)
        
        /** If `true`, the alpha channel in the displayed [ColorPicker] will be visible. */
        get edit_alpha(): boolean
        set edit_alpha(value: boolean)
        
        /** Emitted when the color changes. */
        readonly color_changed: Signal1<Color>
        
        /** Emitted when the [ColorPicker] is closed. */
        readonly popup_closed: Signal0
        
        /** Emitted when the [ColorPicker] is created (the button is pressed for the first time). */
        readonly picker_created: Signal0
    }
    /** A control that displays a solid color rectangle.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_colorrect.html  
     */
    class ColorRect<Map extends Record<string, Node> = Record<string, Node>> extends Control<Map> {
        constructor(identifier?: any)
        /** The fill color of the rectangle. */
        get color(): Color
        set color(value: Color)
    }
    /** Stores attributes used to customize how a Viewport is rendered.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_compositor.html  
     */
    class Compositor extends Resource {
        constructor(identifier?: any)
        /** The custom [CompositorEffect]s that are applied during rendering of viewports using this compositor. */
        get compositor_effects(): GArray
        set compositor_effects(value: GArray)
    }
    namespace CompositorEffect {
        enum EffectCallbackType {
            /** The callback is called before our opaque rendering pass, but after depth prepass (if applicable). */
            EFFECT_CALLBACK_TYPE_PRE_OPAQUE = 0,
            
            /** The callback is called after our opaque rendering pass, but before our sky is rendered. */
            EFFECT_CALLBACK_TYPE_POST_OPAQUE = 1,
            
            /** The callback is called after our sky is rendered, but before our back buffers are created (and if enabled, before subsurface scattering and/or screen space reflections). */
            EFFECT_CALLBACK_TYPE_POST_SKY = 2,
            
            /** The callback is called before our transparent rendering pass, but after our sky is rendered and we've created our back buffers. */
            EFFECT_CALLBACK_TYPE_PRE_TRANSPARENT = 3,
            
            /** The callback is called after our transparent rendering pass, but before any built-in post-processing effects and output to our render target. */
            EFFECT_CALLBACK_TYPE_POST_TRANSPARENT = 4,
            
            /** Represents the size of the [enum EffectCallbackType] enum. */
            EFFECT_CALLBACK_TYPE_MAX = 5,
        }
    }
    /** This resource allows for creating a custom rendering effect.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_compositoreffect.html  
     */
    class CompositorEffect extends Resource {
        constructor(identifier?: any)
        /** Implement this function with your custom rendering code. [param effect_callback_type] should always match the effect callback type you've specified in [member effect_callback_type]. [param render_data] provides access to the rendering state, it is only valid during rendering and should not be stored. */
        /* gdvirtual */ _render_callback(effect_callback_type: int64, render_data: RenderData): void
        
        /** If `true` this rendering effect is applied to any viewport it is added to. */
        get enabled(): boolean
        set enabled(value: boolean)
        
        /** The type of effect that is implemented, determines at what stage of rendering the callback is called. */
        get effect_callback_type(): int64
        set effect_callback_type(value: int64)
        
        /** If `true` and MSAA is enabled, this will trigger a color buffer resolve before the effect is run.  
         *      
         *  **Note:** In [method _render_callback], to access the resolved buffer use:  
         *    
         */
        get access_resolved_color(): boolean
        set access_resolved_color(value: boolean)
        
        /** If `true` and MSAA is enabled, this will trigger a depth buffer resolve before the effect is run.  
         *      
         *  **Note:** In [method _render_callback], to access the resolved buffer use:  
         *    
         */
        get access_resolved_depth(): boolean
        set access_resolved_depth(value: boolean)
        
        /** If `true` this triggers motion vectors being calculated during the opaque render state.  
         *      
         *  **Note:** In [method _render_callback], to access the motion vector buffer use:  
         *    
         */
        get needs_motion_vectors(): boolean
        set needs_motion_vectors(value: boolean)
        
        /** If `true` this triggers normal and roughness data to be output during our depth pre-pass, only applicable for the Forward+ renderer.  
         *      
         *  **Note:** In [method _render_callback], to access the roughness buffer use:  
         *    
         *  The raw normal and roughness buffer is stored in an optimized format, different than the one available in Spatial shaders. When sampling the buffer, a conversion function must be applied. Use this function, copied from [url=https://github.com/godotengine/godot/blob/da5f39889f155658cef7f7ec3cc1abb94e17d815/servers/rendering/renderer_rd/shaders/forward_clustered/scene_forward_clustered_inc.glsl#L334-L341]here[/url]:  
         *    
         */
        get needs_normal_roughness(): boolean
        set needs_normal_roughness(value: boolean)
        
        /** If `true` this triggers specular data being rendered to a separate buffer and combined after effects have been applied, only applicable for the Forward+ renderer. */
        get needs_separate_specular(): boolean
        set needs_separate_specular(value: boolean)
    }
    /** An optionally compressed [Cubemap].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_compressedcubemap.html  
     */
    class CompressedCubemap extends CompressedTextureLayered {
        constructor(identifier?: any)
    }
    /** An optionally compressed [CubemapArray].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_compressedcubemaparray.html  
     */
    class CompressedCubemapArray extends CompressedTextureLayered {
        constructor(identifier?: any)
    }
    /** Texture with 2 dimensions, optionally compressed.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_compressedtexture2d.html  
     */
    class CompressedTexture2D extends Texture2D {
        constructor(identifier?: any)
        /** The [CompressedTexture2D]'s file path to a `.ctex` file. */
        get load_path(): string
        set load_path(value: string)
    }
    /** Array of 2-dimensional textures, optionally compressed.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_compressedtexture2darray.html  
     */
    class CompressedTexture2DArray extends CompressedTextureLayered {
        constructor(identifier?: any)
    }
    /** Texture with 3 dimensions, optionally compressed.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_compressedtexture3d.html  
     */
    class CompressedTexture3D extends Texture3D {
        constructor(identifier?: any)
        /** The [CompressedTexture3D]'s file path to a `.ctex3d` file. */
        get load_path(): string
        set load_path(value: string)
    }
    /** Base class for texture arrays that can optionally be compressed.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_compressedtexturelayered.html  
     */
    class CompressedTextureLayered extends TextureLayered {
        constructor(identifier?: any)
        /** The path the texture should be loaded from. */
        get load_path(): string
        set load_path(value: string)
    }
    /** A 2D polyline shape used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_concavepolygonshape2d.html  
     */
    class ConcavePolygonShape2D extends Shape2D {
        constructor(identifier?: any)
        /** The array of points that make up the [ConcavePolygonShape2D]'s line segments. The array (of length divisible by two) is naturally divided into pairs (one pair for each segment); each pair consists of the starting point of a segment and the endpoint of a segment. */
        get segments(): PackedVector2Array
        set segments(value: PackedVector2Array | Vector2[])
    }
    /** A 3D trimesh shape used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_concavepolygonshape3d.html  
     */
    class ConcavePolygonShape3D extends Shape3D {
        constructor(identifier?: any)
        get data(): PackedVector3Array
        set data(value: PackedVector3Array | Vector3[])
        
        /** If set to `true`, collisions occur on both sides of the concave shape faces. Otherwise they occur only along the face normals. */
        get backface_collision(): boolean
        set backface_collision(value: boolean)
    }
    namespace ConeTwistJoint3D {
        enum Param {
            /** Swing is rotation from side to side, around the axis perpendicular to the twist axis.  
             *  The swing span defines, how much rotation will not get corrected along the swing axis.  
             *  Could be defined as looseness in the [ConeTwistJoint3D].  
             *  If below 0.05, this behavior is locked.  
             */
            PARAM_SWING_SPAN = 0,
            
            /** Twist is the rotation around the twist axis, this value defined how far the joint can twist.  
             *  Twist is locked if below 0.05.  
             */
            PARAM_TWIST_SPAN = 1,
            
            /** The speed with which the swing or twist will take place.  
             *  The higher, the faster.  
             */
            PARAM_BIAS = 2,
            
            /** The ease with which the joint starts to twist. If it's too low, it takes more force to start twisting the joint. */
            PARAM_SOFTNESS = 3,
            
            /** Defines, how fast the swing- and twist-speed-difference on both sides gets synced. */
            PARAM_RELAXATION = 4,
            
            /** Represents the size of the [enum Param] enum. */
            PARAM_MAX = 5,
        }
    }
    /** A physics joint that connects two 3D physics bodies in a way that simulates a ball-and-socket joint.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_conetwistjoint3d.html  
     */
    class ConeTwistJoint3D<Map extends Record<string, Node> = Record<string, Node>> extends Joint3D<Map> {
        constructor(identifier?: any)
        /** Sets the value of the specified parameter. */
        set_param(param: ConeTwistJoint3D.Param, value: float64): void
        
        /** Returns the value of the specified parameter. */
        get_param(param: ConeTwistJoint3D.Param): float64
        
        /** Swing is rotation from side to side, around the axis perpendicular to the twist axis.  
         *  The swing span defines, how much rotation will not get corrected along the swing axis.  
         *  Could be defined as looseness in the [ConeTwistJoint3D].  
         *  If below 0.05, this behavior is locked.  
         */
        get swing_span(): float64
        set swing_span(value: float64)
        
        /** Twist is the rotation around the twist axis, this value defined how far the joint can twist.  
         *  Twist is locked if below 0.05.  
         */
        get twist_span(): float64
        set twist_span(value: float64)
        
        /** The speed with which the swing or twist will take place.  
         *  The higher, the faster.  
         */
        get bias(): float64
        set bias(value: float64)
        
        /** The ease with which the joint starts to twist. If it's too low, it takes more force to start twisting the joint. */
        get softness(): float64
        set softness(value: float64)
        
        /** Defines, how fast the swing- and twist-speed-difference on both sides gets synced. */
        get relaxation(): float64
        set relaxation(value: float64)
    }
    /** Helper class to handle INI-style files.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_configfile.html  
     */
    class ConfigFile extends RefCounted {
        constructor(identifier?: any)
        /** Assigns a value to the specified key of the specified section. If either the section or the key do not exist, they are created. Passing a `null` value deletes the specified key if it exists, and deletes the section if it ends up empty once the key has been removed. */
        set_value(section: string, key: string, value: any): void
        
        /** Returns the current value for the specified section and key. If either the section or the key do not exist, the method returns the fallback [param default] value. If [param default] is not specified or set to `null`, an error is also raised. */
        get_value(section: string, key: string, default_: any = <any> {}): any
        
        /** Returns `true` if the specified section exists. */
        has_section(section: string): boolean
        
        /** Returns `true` if the specified section-key pair exists. */
        has_section_key(section: string, key: string): boolean
        
        /** Returns an array of all defined section identifiers. */
        get_sections(): PackedStringArray
        
        /** Returns an array of all defined key identifiers in the specified section. Raises an error and returns an empty array if the section does not exist. */
        get_section_keys(section: string): PackedStringArray
        
        /** Deletes the specified section along with all the key-value pairs inside. Raises an error if the section does not exist. */
        erase_section(section: string): void
        
        /** Deletes the specified key in a section. Raises an error if either the section or the key do not exist. */
        erase_section_key(section: string, key: string): void
        
        /** Loads the config file specified as a parameter. The file's contents are parsed and loaded in the [ConfigFile] object which the method was called on.  
         *  Returns [constant OK] on success, or one of the other [enum Error] values if the operation failed.  
         */
        load(path: string): GError
        
        /** Parses the passed string as the contents of a config file. The string is parsed and loaded in the ConfigFile object which the method was called on.  
         *  Returns [constant OK] on success, or one of the other [enum Error] values if the operation failed.  
         */
        parse(data: string): GError
        
        /** Saves the contents of the [ConfigFile] object to the file specified as a parameter. The output file uses an INI-style structure.  
         *  Returns [constant OK] on success, or one of the other [enum Error] values if the operation failed.  
         */
        save(path: string): GError
        
        /** Obtain the text version of this config file (the same text that would be written to a file). */
        encode_to_text(): string
        
        /** Loads the encrypted config file specified as a parameter, using the provided [param key] to decrypt it. The file's contents are parsed and loaded in the [ConfigFile] object which the method was called on.  
         *  Returns [constant OK] on success, or one of the other [enum Error] values if the operation failed.  
         */
        load_encrypted(path: string, key: PackedByteArray | byte[] | ArrayBuffer): GError
        
        /** Loads the encrypted config file specified as a parameter, using the provided [param password] to decrypt it. The file's contents are parsed and loaded in the [ConfigFile] object which the method was called on.  
         *  Returns [constant OK] on success, or one of the other [enum Error] values if the operation failed.  
         */
        load_encrypted_pass(path: string, password: string): GError
        
        /** Saves the contents of the [ConfigFile] object to the AES-256 encrypted file specified as a parameter, using the provided [param key] to encrypt it. The output file uses an INI-style structure.  
         *  Returns [constant OK] on success, or one of the other [enum Error] values if the operation failed.  
         */
        save_encrypted(path: string, key: PackedByteArray | byte[] | ArrayBuffer): GError
        
        /** Saves the contents of the [ConfigFile] object to the AES-256 encrypted file specified as a parameter, using the provided [param password] to encrypt it. The output file uses an INI-style structure.  
         *  Returns [constant OK] on success, or one of the other [enum Error] values if the operation failed.  
         */
        save_encrypted_pass(path: string, password: string): GError
        
        /** Removes the entire contents of the config. */
        clear(): void
    }
    /** A dialog used for confirmation of actions.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_confirmationdialog.html  
     */
    class ConfirmationDialog<Map extends Record<string, Node> = Record<string, Node>> extends AcceptDialog<Map> {
        constructor(identifier?: any)
        /** Returns the cancel button.  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member CanvasItem.visible] property.  
         */
        get_cancel_button(): Button
        
        /** The text displayed by the cancel button (see [method get_cancel_button]). */
        get cancel_button_text(): string
        set cancel_button_text(value: string)
    }
    class ConnectDialog<Map extends Record<string, Node> = Record<string, Node>> extends ConfirmationDialog<Map> {
        constructor(identifier?: any)
        readonly connected: Signal0
    }
    class ConnectDialogBinds extends Object {
        constructor(identifier?: any)
    }
    class ConnectionsDock<Map extends Record<string, Node> = Record<string, Node>> extends VBoxContainer<Map> {
        constructor(identifier?: any)
        update_tree(): void
    }
    /** Base class for all GUI containers.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_container.html  
     */
    class Container<Map extends Record<string, Node> = Record<string, Node>> extends Control<Map> {
        /** Notification just before children are going to be sorted, in case there's something to process beforehand. */
        static readonly NOTIFICATION_PRE_SORT_CHILDREN = 50
        
        /** Notification for when sorting the children, it must be obeyed immediately. */
        static readonly NOTIFICATION_SORT_CHILDREN = 51
        constructor(identifier?: any)
        
        /** Implement to return a list of allowed horizontal [enum Control.SizeFlags] for child nodes. This doesn't technically prevent the usages of any other size flags, if your implementation requires that. This only limits the options available to the user in the Inspector dock.  
         *      
         *  **Note:** Having no size flags is equal to having [constant Control.SIZE_SHRINK_BEGIN]. As such, this value is always implicitly allowed.  
         */
        /* gdvirtual */ _get_allowed_size_flags_horizontal(): PackedInt32Array
        
        /** Implement to return a list of allowed vertical [enum Control.SizeFlags] for child nodes. This doesn't technically prevent the usages of any other size flags, if your implementation requires that. This only limits the options available to the user in the Inspector dock.  
         *      
         *  **Note:** Having no size flags is equal to having [constant Control.SIZE_SHRINK_BEGIN]. As such, this value is always implicitly allowed.  
         */
        /* gdvirtual */ _get_allowed_size_flags_vertical(): PackedInt32Array
        
        /** Queue resort of the contained children. This is called automatically anyway, but can be called upon request. */
        queue_sort(): void
        
        /** Fit a child control in a given rect. This is mainly a helper for creating custom container classes. */
        fit_child_in_rect(child: Control, rect: Rect2): void
        
        /** Emitted when children are going to be sorted. */
        readonly pre_sort_children: Signal0
        
        /** Emitted when sorting the children is needed. */
        readonly sort_children: Signal0
    }
    namespace Control {
        enum FocusMode {
            /** The node cannot grab focus. Use with [member focus_mode]. */
            FOCUS_NONE = 0,
            
            /** The node can only grab focus on mouse clicks. Use with [member focus_mode]. */
            FOCUS_CLICK = 1,
            
            /** The node can grab focus on mouse click, using the arrows and the Tab keys on the keyboard, or using the D-pad buttons on a gamepad. Use with [member focus_mode]. */
            FOCUS_ALL = 2,
        }
        enum CursorShape {
            /** Show the system's arrow mouse cursor when the user hovers the node. Use with [member mouse_default_cursor_shape]. */
            CURSOR_ARROW = 0,
            
            /** Show the system's I-beam mouse cursor when the user hovers the node. The I-beam pointer has a shape similar to "I". It tells the user they can highlight or insert text. */
            CURSOR_IBEAM = 1,
            
            /** Show the system's pointing hand mouse cursor when the user hovers the node. */
            CURSOR_POINTING_HAND = 2,
            
            /** Show the system's cross mouse cursor when the user hovers the node. */
            CURSOR_CROSS = 3,
            
            /** Show the system's wait mouse cursor when the user hovers the node. Often an hourglass. */
            CURSOR_WAIT = 4,
            
            /** Show the system's busy mouse cursor when the user hovers the node. Often an arrow with a small hourglass. */
            CURSOR_BUSY = 5,
            
            /** Show the system's drag mouse cursor, often a closed fist or a cross symbol, when the user hovers the node. It tells the user they're currently dragging an item, like a node in the Scene dock. */
            CURSOR_DRAG = 6,
            
            /** Show the system's drop mouse cursor when the user hovers the node. It can be an open hand. It tells the user they can drop an item they're currently grabbing, like a node in the Scene dock. */
            CURSOR_CAN_DROP = 7,
            
            /** Show the system's forbidden mouse cursor when the user hovers the node. Often a crossed circle. */
            CURSOR_FORBIDDEN = 8,
            
            /** Show the system's vertical resize mouse cursor when the user hovers the node. A double-headed vertical arrow. It tells the user they can resize the window or the panel vertically. */
            CURSOR_VSIZE = 9,
            
            /** Show the system's horizontal resize mouse cursor when the user hovers the node. A double-headed horizontal arrow. It tells the user they can resize the window or the panel horizontally. */
            CURSOR_HSIZE = 10,
            
            /** Show the system's window resize mouse cursor when the user hovers the node. The cursor is a double-headed arrow that goes from the bottom left to the top right. It tells the user they can resize the window or the panel both horizontally and vertically. */
            CURSOR_BDIAGSIZE = 11,
            
            /** Show the system's window resize mouse cursor when the user hovers the node. The cursor is a double-headed arrow that goes from the top left to the bottom right, the opposite of [constant CURSOR_BDIAGSIZE]. It tells the user they can resize the window or the panel both horizontally and vertically. */
            CURSOR_FDIAGSIZE = 12,
            
            /** Show the system's move mouse cursor when the user hovers the node. It shows 2 double-headed arrows at a 90 degree angle. It tells the user they can move a UI element freely. */
            CURSOR_MOVE = 13,
            
            /** Show the system's vertical split mouse cursor when the user hovers the node. On Windows, it's the same as [constant CURSOR_VSIZE]. */
            CURSOR_VSPLIT = 14,
            
            /** Show the system's horizontal split mouse cursor when the user hovers the node. On Windows, it's the same as [constant CURSOR_HSIZE]. */
            CURSOR_HSPLIT = 15,
            
            /** Show the system's help mouse cursor when the user hovers the node, a question mark. */
            CURSOR_HELP = 16,
        }
        enum LayoutPreset {
            /** Snap all 4 anchors to the top-left of the parent control's bounds. Use with [method set_anchors_preset]. */
            PRESET_TOP_LEFT = 0,
            
            /** Snap all 4 anchors to the top-right of the parent control's bounds. Use with [method set_anchors_preset]. */
            PRESET_TOP_RIGHT = 1,
            
            /** Snap all 4 anchors to the bottom-left of the parent control's bounds. Use with [method set_anchors_preset]. */
            PRESET_BOTTOM_LEFT = 2,
            
            /** Snap all 4 anchors to the bottom-right of the parent control's bounds. Use with [method set_anchors_preset]. */
            PRESET_BOTTOM_RIGHT = 3,
            
            /** Snap all 4 anchors to the center of the left edge of the parent control's bounds. Use with [method set_anchors_preset]. */
            PRESET_CENTER_LEFT = 4,
            
            /** Snap all 4 anchors to the center of the top edge of the parent control's bounds. Use with [method set_anchors_preset]. */
            PRESET_CENTER_TOP = 5,
            
            /** Snap all 4 anchors to the center of the right edge of the parent control's bounds. Use with [method set_anchors_preset]. */
            PRESET_CENTER_RIGHT = 6,
            
            /** Snap all 4 anchors to the center of the bottom edge of the parent control's bounds. Use with [method set_anchors_preset]. */
            PRESET_CENTER_BOTTOM = 7,
            
            /** Snap all 4 anchors to the center of the parent control's bounds. Use with [method set_anchors_preset]. */
            PRESET_CENTER = 8,
            
            /** Snap all 4 anchors to the left edge of the parent control. The left offset becomes relative to the left edge and the top offset relative to the top left corner of the node's parent. Use with [method set_anchors_preset]. */
            PRESET_LEFT_WIDE = 9,
            
            /** Snap all 4 anchors to the top edge of the parent control. The left offset becomes relative to the top left corner, the top offset relative to the top edge, and the right offset relative to the top right corner of the node's parent. Use with [method set_anchors_preset]. */
            PRESET_TOP_WIDE = 10,
            
            /** Snap all 4 anchors to the right edge of the parent control. The right offset becomes relative to the right edge and the top offset relative to the top right corner of the node's parent. Use with [method set_anchors_preset]. */
            PRESET_RIGHT_WIDE = 11,
            
            /** Snap all 4 anchors to the bottom edge of the parent control. The left offset becomes relative to the bottom left corner, the bottom offset relative to the bottom edge, and the right offset relative to the bottom right corner of the node's parent. Use with [method set_anchors_preset]. */
            PRESET_BOTTOM_WIDE = 12,
            
            /** Snap all 4 anchors to a vertical line that cuts the parent control in half. Use with [method set_anchors_preset]. */
            PRESET_VCENTER_WIDE = 13,
            
            /** Snap all 4 anchors to a horizontal line that cuts the parent control in half. Use with [method set_anchors_preset]. */
            PRESET_HCENTER_WIDE = 14,
            
            /** Snap all 4 anchors to the respective corners of the parent control. Set all 4 offsets to 0 after you applied this preset and the [Control] will fit its parent control. Use with [method set_anchors_preset]. */
            PRESET_FULL_RECT = 15,
        }
        enum LayoutPresetMode {
            /** The control will be resized to its minimum size. */
            PRESET_MODE_MINSIZE = 0,
            
            /** The control's width will not change. */
            PRESET_MODE_KEEP_WIDTH = 1,
            
            /** The control's height will not change. */
            PRESET_MODE_KEEP_HEIGHT = 2,
            
            /** The control's size will not change. */
            PRESET_MODE_KEEP_SIZE = 3,
        }
        enum SizeFlags {
            /** Tells the parent [Container] to align the node with its start, either the top or the left edge. It is mutually exclusive with [constant SIZE_FILL] and other shrink size flags, but can be used with [constant SIZE_EXPAND] in some containers. Use with [member size_flags_horizontal] and [member size_flags_vertical].  
             *      
             *  **Note:** Setting this flag is equal to not having any size flags.  
             */
            SIZE_SHRINK_BEGIN = 0,
            
            /** Tells the parent [Container] to expand the bounds of this node to fill all the available space without pushing any other node. It is mutually exclusive with shrink size flags. Use with [member size_flags_horizontal] and [member size_flags_vertical]. */
            SIZE_FILL = 1,
            
            /** Tells the parent [Container] to let this node take all the available space on the axis you flag. If multiple neighboring nodes are set to expand, they'll share the space based on their stretch ratio. See [member size_flags_stretch_ratio]. Use with [member size_flags_horizontal] and [member size_flags_vertical]. */
            SIZE_EXPAND = 2,
            
            /** Sets the node's size flags to both fill and expand. See [constant SIZE_FILL] and [constant SIZE_EXPAND] for more information. */
            SIZE_EXPAND_FILL = 3,
            
            /** Tells the parent [Container] to center the node in the available space. It is mutually exclusive with [constant SIZE_FILL] and other shrink size flags, but can be used with [constant SIZE_EXPAND] in some containers. Use with [member size_flags_horizontal] and [member size_flags_vertical]. */
            SIZE_SHRINK_CENTER = 4,
            
            /** Tells the parent [Container] to align the node with its end, either the bottom or the right edge. It is mutually exclusive with [constant SIZE_FILL] and other shrink size flags, but can be used with [constant SIZE_EXPAND] in some containers. Use with [member size_flags_horizontal] and [member size_flags_vertical]. */
            SIZE_SHRINK_END = 8,
        }
        enum MouseFilter {
            /** The control will receive mouse movement input events and mouse button input events if clicked on through [method _gui_input]. The control will also receive the [signal mouse_entered] and [signal mouse_exited] signals. These events are automatically marked as handled, and they will not propagate further to other controls. This also results in blocking signals in other controls. */
            MOUSE_FILTER_STOP = 0,
            
            /** The control will receive mouse movement input events and mouse button input events if clicked on through [method _gui_input]. The control will also receive the [signal mouse_entered] and [signal mouse_exited] signals.  
             *  If this control does not handle the event, the event will propagate up to its parent control if it has one. The event is bubbled up the node hierarchy until it reaches a non-[CanvasItem], a control with [constant MOUSE_FILTER_STOP], or a [CanvasItem] with [member CanvasItem.top_level] enabled. This will allow signals to fire in all controls it reaches. If no control handled it, the event will be passed to [method Node._shortcut_input] for further processing.  
             */
            MOUSE_FILTER_PASS = 1,
            
            /** The control will not receive any mouse movement input events nor mouse button input events through [method _gui_input]. The control will also not receive the [signal mouse_entered] nor [signal mouse_exited] signals. This will not block other controls from receiving these events or firing the signals. Ignored events will not be handled automatically. If a child has [constant MOUSE_FILTER_PASS] and an event was passed to this control, the event will further propagate up to the control's parent.  
             *      
             *  **Note:** If the control has received [signal mouse_entered] but not [signal mouse_exited], changing the [member mouse_filter] to [constant MOUSE_FILTER_IGNORE] will cause [signal mouse_exited] to be emitted.  
             */
            MOUSE_FILTER_IGNORE = 2,
        }
        enum GrowDirection {
            /** The control will grow to the left or top to make up if its minimum size is changed to be greater than its current size on the respective axis. */
            GROW_DIRECTION_BEGIN = 0,
            
            /** The control will grow to the right or bottom to make up if its minimum size is changed to be greater than its current size on the respective axis. */
            GROW_DIRECTION_END = 1,
            
            /** The control will grow in both directions equally to make up if its minimum size is changed to be greater than its current size. */
            GROW_DIRECTION_BOTH = 2,
        }
        enum Anchor {
            /** Snaps one of the 4 anchor's sides to the origin of the node's `Rect`, in the top left. Use it with one of the `anchor_*` member variables, like [member anchor_left]. To change all 4 anchors at once, use [method set_anchors_preset]. */
            ANCHOR_BEGIN = 0,
            
            /** Snaps one of the 4 anchor's sides to the end of the node's `Rect`, in the bottom right. Use it with one of the `anchor_*` member variables, like [member anchor_left]. To change all 4 anchors at once, use [method set_anchors_preset]. */
            ANCHOR_END = 1,
        }
        enum LayoutDirection {
            /** Automatic layout direction, determined from the parent control layout direction. */
            LAYOUT_DIRECTION_INHERITED = 0,
            
            /** Automatic layout direction, determined from the current locale. Right-to-left layout direction is automatically used for languages that require it such as Arabic and Hebrew, but only if a valid translation file is loaded for the given language (unless said language is configured as a fallback in [member ProjectSettings.internationalization/locale/fallback]). For all other languages (or if no valid translation file is found by Godot), left-to-right layout direction is used. If using [TextServerFallback] ([member ProjectSettings.internationalization/rendering/text_driver]), left-to-right layout direction is always used regardless of the language. Right-to-left layout direction can also be forced using [member ProjectSettings.internationalization/rendering/force_right_to_left_layout_direction]. */
            LAYOUT_DIRECTION_APPLICATION_LOCALE = 1,
            
            /** Left-to-right layout direction. */
            LAYOUT_DIRECTION_LTR = 2,
            
            /** Right-to-left layout direction. */
            LAYOUT_DIRECTION_RTL = 3,
            
            /** Automatic layout direction, determined from the system locale. Right-to-left layout direction is automatically used for languages that require it such as Arabic and Hebrew, but only if a valid translation file is loaded for the given language.. For all other languages (or if no valid translation file is found by Godot), left-to-right layout direction is used. If using [TextServerFallback] ([member ProjectSettings.internationalization/rendering/text_driver]), left-to-right layout direction is always used regardless of the language. */
            LAYOUT_DIRECTION_SYSTEM_LOCALE = 4,
            
            /** Represents the size of the [enum LayoutDirection] enum. */
            LAYOUT_DIRECTION_MAX = 5,
            LAYOUT_DIRECTION_LOCALE = 1,
        }
        enum TextDirection {
            /** Text writing direction is the same as layout direction. */
            TEXT_DIRECTION_INHERITED = 3,
            
            /** Automatic text writing direction, determined from the current locale and text content. */
            TEXT_DIRECTION_AUTO = 0,
            
            /** Left-to-right text writing direction. */
            TEXT_DIRECTION_LTR = 1,
            
            /** Right-to-left text writing direction. */
            TEXT_DIRECTION_RTL = 2,
        }
    }
    /** Base class for all GUI controls. Adapts its position and size based on its parent control.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_control.html  
     */
    class Control<Map extends Record<string, Node> = Record<string, Node>> extends CanvasItem<Map> {
        /** Sent when the node changes size. Use [member size] to get the new size. */
        static readonly NOTIFICATION_RESIZED = 40
        
        /** Sent when the mouse cursor enters the control's (or any child control's) visible area, that is not occluded behind other Controls or Windows, provided its [member mouse_filter] lets the event reach it and regardless if it's currently focused or not.  
         *      
         *  **Note:** [member CanvasItem.z_index] doesn't affect which Control receives the notification.  
         *  See also [constant NOTIFICATION_MOUSE_ENTER_SELF].  
         */
        static readonly NOTIFICATION_MOUSE_ENTER = 41
        
        /** Sent when the mouse cursor leaves the control's (and all child control's) visible area, that is not occluded behind other Controls or Windows, provided its [member mouse_filter] lets the event reach it and regardless if it's currently focused or not.  
         *      
         *  **Note:** [member CanvasItem.z_index] doesn't affect which Control receives the notification.  
         *  See also [constant NOTIFICATION_MOUSE_EXIT_SELF].  
         */
        static readonly NOTIFICATION_MOUSE_EXIT = 42
        
        /** Sent when the mouse cursor enters the control's visible area, that is not occluded behind other Controls or Windows, provided its [member mouse_filter] lets the event reach it and regardless if it's currently focused or not.  
         *      
         *  **Note:** [member CanvasItem.z_index] doesn't affect which Control receives the notification.  
         *  See also [constant NOTIFICATION_MOUSE_ENTER].  
         */
        static readonly NOTIFICATION_MOUSE_ENTER_SELF = 60
        
        /** Sent when the mouse cursor leaves the control's visible area, that is not occluded behind other Controls or Windows, provided its [member mouse_filter] lets the event reach it and regardless if it's currently focused or not.  
         *      
         *  **Note:** [member CanvasItem.z_index] doesn't affect which Control receives the notification.  
         *  See also [constant NOTIFICATION_MOUSE_EXIT].  
         */
        static readonly NOTIFICATION_MOUSE_EXIT_SELF = 61
        
        /** Sent when the node grabs focus. */
        static readonly NOTIFICATION_FOCUS_ENTER = 43
        
        /** Sent when the node loses focus. */
        static readonly NOTIFICATION_FOCUS_EXIT = 44
        
        /** Sent when the node needs to refresh its theme items. This happens in one of the following cases:  
         *  - The [member theme] property is changed on this node or any of its ancestors.  
         *  - The [member theme_type_variation] property is changed on this node.  
         *  - One of the node's theme property overrides is changed.  
         *  - The node enters the scene tree.  
         *      
         *  **Note:** As an optimization, this notification won't be sent from changes that occur while this node is outside of the scene tree. Instead, all of the theme item updates can be applied at once when the node enters the scene tree.  
         *      
         *  **Note:** This notification is received alongside [constant Node.NOTIFICATION_ENTER_TREE], so if you are instantiating a scene, the child nodes will not be initialized yet. You can use it to setup theming for this node, child nodes created from script, or if you want to access child nodes added in the editor, make sure the node is ready using [method Node.is_node_ready].  
         *    
         */
        static readonly NOTIFICATION_THEME_CHANGED = 45
        
        /** Sent when this node is inside a [ScrollContainer] which has begun being scrolled when dragging the scrollable area  *with a touch event* . This notification is  *not*  sent when scrolling by dragging the scrollbar, scrolling with the mouse wheel or scrolling with keyboard/gamepad events.  
         *      
         *  **Note:** This signal is only emitted on Android or iOS, or on desktop/web platforms when [member ProjectSettings.input_devices/pointing/emulate_touch_from_mouse] is enabled.  
         */
        static readonly NOTIFICATION_SCROLL_BEGIN = 47
        
        /** Sent when this node is inside a [ScrollContainer] which has stopped being scrolled when dragging the scrollable area  *with a touch event* . This notification is  *not*  sent when scrolling by dragging the scrollbar, scrolling with the mouse wheel or scrolling with keyboard/gamepad events.  
         *      
         *  **Note:** This signal is only emitted on Android or iOS, or on desktop/web platforms when [member ProjectSettings.input_devices/pointing/emulate_touch_from_mouse] is enabled.  
         */
        static readonly NOTIFICATION_SCROLL_END = 48
        
        /** Sent when the control layout direction is changed from LTR or RTL or vice versa. This notification is propagated to child Control nodes as result of a change to [member layout_direction]. */
        static readonly NOTIFICATION_LAYOUT_DIRECTION_CHANGED = 49
        constructor(identifier?: any)
        
        /** Virtual method to be implemented by the user. Returns whether the given [param point] is inside this control.  
         *  If not overridden, default behavior is checking if the point is within control's Rect.  
         *      
         *  **Note:** If you want to check if a point is inside the control, you can use `Rect2(Vector2.ZERO, size).has_point(point)`.  
         */
        /* gdvirtual */ _has_point(point: Vector2): boolean
        
        /** User defined BiDi algorithm override function.  
         *  Returns an [Array] of [Vector3i] text ranges and text base directions, in the left-to-right order. Ranges should cover full source [param text] without overlaps. BiDi algorithm will be used on each range separately.  
         */
        /* gdvirtual */ _structured_text_parser(args: GArray, text: string): GArray
        
        /** Virtual method to be implemented by the user. Returns the minimum size for this control. Alternative to [member custom_minimum_size] for controlling minimum size via code. The actual minimum size will be the max value of these two (in each axis separately).  
         *  If not overridden, defaults to [constant Vector2.ZERO].  
         *      
         *  **Note:** This method will not be called when the script is attached to a [Control] node that already overrides its minimum size (e.g. [Label], [Button], [PanelContainer] etc.). It can only be used with most basic GUI nodes, like [Control], [Container], [Panel] etc.  
         */
        /* gdvirtual */ _get_minimum_size(): Vector2
        
        /** Virtual method to be implemented by the user. Returns the tooltip text for the position [param at_position] in control's local coordinates, which will typically appear when the cursor is resting over this control. See [method get_tooltip].  
         *      
         *  **Note:** If this method returns an empty [String] and [method _make_custom_tooltip] is not overridden, no tooltip is displayed.  
         */
        /* gdvirtual */ _get_tooltip(at_position: Vector2): string
        
        /** Godot calls this method to get data that can be dragged and dropped onto controls that expect drop data. Returns `null` if there is no data to drag. Controls that want to receive drop data should implement [method _can_drop_data] and [method _drop_data]. [param at_position] is local to this control. Drag may be forced with [method force_drag].  
         *  A preview that will follow the mouse that should represent the data can be set with [method set_drag_preview]. A good time to set the preview is in this method.  
         *    
         */
        /* gdvirtual */ _get_drag_data(at_position: Vector2): any
        
        /** Godot calls this method to test if [param data] from a control's [method _get_drag_data] can be dropped at [param at_position]. [param at_position] is local to this control.  
         *  This method should only be used to test the data. Process the data in [method _drop_data].  
         *    
         */
        /* gdvirtual */ _can_drop_data(at_position: Vector2, data: any): boolean
        
        /** Godot calls this method to pass you the [param data] from a control's [method _get_drag_data] result. Godot first calls [method _can_drop_data] to test if [param data] is allowed to drop at [param at_position] where [param at_position] is local to this control.  
         *    
         */
        /* gdvirtual */ _drop_data(at_position: Vector2, data: any): void
        
        /** Virtual method to be implemented by the user. Returns a [Control] node that should be used as a tooltip instead of the default one. [param for_text] is the return value of [method get_tooltip].  
         *  The returned node must be of type [Control] or Control-derived. It can have child nodes of any type. It is freed when the tooltip disappears, so make sure you always provide a new instance (if you want to use a pre-existing node from your scene tree, you can duplicate it and pass the duplicated instance). When `null` or a non-Control node is returned, the default tooltip will be used instead.  
         *  The returned node will be added as child to a [PopupPanel], so you should only provide the contents of that panel. That [PopupPanel] can be themed using [method Theme.set_stylebox] for the type `"TooltipPanel"` (see [member tooltip_text] for an example).  
         *      
         *  **Note:** The tooltip is shrunk to minimal size. If you want to ensure it's fully visible, you might want to set its [member custom_minimum_size] to some non-zero value.  
         *      
         *  **Note:** The node (and any relevant children) should have their [member CanvasItem.visible] set to `true` when returned, otherwise, the viewport that instantiates it will not be able to calculate its minimum size reliably.  
         *      
         *  **Note:** If overridden, this method is called even if [method get_tooltip] returns an empty string. When this happens with the default tooltip, it is not displayed. To copy this behavior, return `null` in this method when [param for_text] is empty.  
         *  **Example:** Use a constructed node as a tooltip:  
         *    
         *  **Example:** Usa a scene instance as a tooltip:  
         *    
         */
        /* gdvirtual */ _make_custom_tooltip(for_text: string): Object
        
        /** Virtual method to be implemented by the user. Override this method to handle and accept inputs on UI elements. See also [method accept_event].  
         *  **Example:** Click on the control to print a message:  
         *    
         *  If the [param event] inherits [InputEventMouse], this method will **not** be called when:  
         *  - the control's [member mouse_filter] is set to [constant MOUSE_FILTER_IGNORE];  
         *  - the control is obstructed by another control on top, that doesn't have [member mouse_filter] set to [constant MOUSE_FILTER_IGNORE];  
         *  - the control's parent has [member mouse_filter] set to [constant MOUSE_FILTER_STOP] or has accepted the event;  
         *  - the control's parent has [member clip_contents] enabled and the [param event]'s position is outside the parent's rectangle;  
         *  - the [param event]'s position is outside the control (see [method _has_point]).  
         *      
         *  **Note:** The [param event]'s position is relative to this control's origin.  
         */
        /* gdvirtual */ _gui_input(event: InputEvent): void
        
        /** Marks an input event as handled. Once you accept an input event, it stops propagating, even to nodes listening to [method Node._unhandled_input] or [method Node._unhandled_key_input].  
         *      
         *  **Note:** This does not affect the methods in [Input], only the way events are propagated.  
         */
        accept_event(): void
        
        /** Returns the minimum size for this control. See [member custom_minimum_size]. */
        get_minimum_size(): Vector2
        
        /** Returns combined minimum size from [member custom_minimum_size] and [method get_minimum_size]. */
        get_combined_minimum_size(): Vector2
        
        /** Sets the anchors to a [param preset] from [enum Control.LayoutPreset] enum. This is the code equivalent to using the Layout menu in the 2D editor.  
         *  If [param keep_offsets] is `true`, control's position will also be updated.  
         */
        set_anchors_preset(preset: Control.LayoutPreset, keep_offsets: boolean = false): void
        
        /** Sets the offsets to a [param preset] from [enum Control.LayoutPreset] enum. This is the code equivalent to using the Layout menu in the 2D editor.  
         *  Use parameter [param resize_mode] with constants from [enum Control.LayoutPresetMode] to better determine the resulting size of the [Control]. Constant size will be ignored if used with presets that change size, e.g. [constant PRESET_LEFT_WIDE].  
         *  Use parameter [param margin] to determine the gap between the [Control] and the edges.  
         */
        set_offsets_preset(preset: Control.LayoutPreset, resize_mode: Control.LayoutPresetMode = 0, margin: int64 = 0): void
        
        /** Sets both anchor preset and offset preset. See [method set_anchors_preset] and [method set_offsets_preset]. */
        set_anchors_and_offsets_preset(preset: Control.LayoutPreset, resize_mode: Control.LayoutPresetMode = 0, margin: int64 = 0): void
        _set_anchor(side: Side, anchor: float64): void
        
        /** Sets the anchor for the specified [enum Side] to [param anchor]. A setter method for [member anchor_bottom], [member anchor_left], [member anchor_right] and [member anchor_top].  
         *  If [param keep_offset] is `true`, offsets aren't updated after this operation.  
         *  If [param push_opposite_anchor] is `true` and the opposite anchor overlaps this anchor, the opposite one will have its value overridden. For example, when setting left anchor to 1 and the right anchor has value of 0.5, the right anchor will also get value of 1. If [param push_opposite_anchor] was `false`, the left anchor would get value 0.5.  
         */
        set_anchor(side: Side, anchor: float64, keep_offset: boolean = false, push_opposite_anchor: boolean = true): void
        
        /** Returns the anchor for the specified [enum Side]. A getter method for [member anchor_bottom], [member anchor_left], [member anchor_right] and [member anchor_top]. */
        get_anchor(side: Side): float64
        
        /** Sets the offset for the specified [enum Side] to [param offset]. A setter method for [member offset_bottom], [member offset_left], [member offset_right] and [member offset_top]. */
        set_offset(side: Side, offset: float64): void
        
        /** Returns the offset for the specified [enum Side]. A getter method for [member offset_bottom], [member offset_left], [member offset_right] and [member offset_top]. */
        get_offset(offset: Side): float64
        
        /** Works the same as [method set_anchor], but instead of `keep_offset` argument and automatic update of offset, it allows to set the offset yourself (see [method set_offset]). */
        set_anchor_and_offset(side: Side, anchor: float64, offset: float64, push_opposite_anchor: boolean = false): void
        
        /** Sets [member offset_left] and [member offset_top] at the same time. Equivalent of changing [member position]. */
        set_begin(position: Vector2): void
        
        /** Sets [member offset_right] and [member offset_bottom] at the same time. */
        set_end(position: Vector2): void
        
        /** Sets the [member position] to given [param position].  
         *  If [param keep_offsets] is `true`, control's anchors will be updated instead of offsets.  
         */
        set_position(position: Vector2, keep_offsets: boolean = false): void
        
        /** Sets the size (see [member size]).  
         *  If [param keep_offsets] is `true`, control's anchors will be updated instead of offsets.  
         */
        set_size(size: Vector2, keep_offsets: boolean = false): void
        
        /** Resets the size to [method get_combined_minimum_size]. This is equivalent to calling `set_size(Vector2())` (or any size below the minimum). */
        reset_size(): void
        
        /** Sets the [member global_position] to given [param position].  
         *  If [param keep_offsets] is `true`, control's anchors will be updated instead of offsets.  
         */
        set_global_position(position: Vector2, keep_offsets: boolean = false): void
        
        /** Returns [member offset_left] and [member offset_top]. See also [member position]. */
        get_begin(): Vector2
        
        /** Returns [member offset_right] and [member offset_bottom]. */
        get_end(): Vector2
        
        /** Returns the width/height occupied in the parent control. */
        get_parent_area_size(): Vector2
        
        /** Returns the position of this [Control] in global screen coordinates (i.e. taking window position into account). Mostly useful for editor plugins.  
         *  Equals to [member global_position] if the window is embedded (see [member Viewport.gui_embed_subwindows]).  
         *  **Example:** Show a popup at the mouse position:  
         *    
         */
        get_screen_position(): Vector2
        
        /** Returns the position and size of the control in the coordinate system of the containing node. See [member position], [member scale] and [member size].  
         *      
         *  **Note:** If [member rotation] is not the default rotation, the resulting size is not meaningful.  
         *      
         *  **Note:** Setting [member Viewport.gui_snap_controls_to_pixels] to `true` can lead to rounding inaccuracies between the displayed control and the returned [Rect2].  
         */
        get_rect(): Rect2
        
        /** Returns the position and size of the control relative to the containing canvas. See [member global_position] and [member size].  
         *      
         *  **Note:** If the node itself or any parent [CanvasItem] between the node and the canvas have a non default rotation or skew, the resulting size is likely not meaningful.  
         *      
         *  **Note:** Setting [member Viewport.gui_snap_controls_to_pixels] to `true` can lead to rounding inaccuracies between the displayed control and the returned [Rect2].  
         */
        get_global_rect(): Rect2
        
        /** Returns `true` if this is the current focused control. See [member focus_mode]. */
        has_focus(): boolean
        
        /** Steal the focus from another control and become the focused control (see [member focus_mode]).  
         *      
         *  **Note:** Using this method together with [method Callable.call_deferred] makes it more reliable, especially when called inside [method Node._ready].  
         */
        grab_focus(): void
        
        /** Give up the focus. No other control will be able to receive input. */
        release_focus(): void
        
        /** Finds the previous (above in the tree) [Control] that can receive the focus. */
        find_prev_valid_focus(): Control
        
        /** Finds the next (below in the tree) [Control] that can receive the focus. */
        find_next_valid_focus(): Control
        
        /** Finds the next [Control] that can receive the focus on the specified [enum Side].  
         *      
         *  **Note:** This is different from [method get_focus_neighbor], which returns the path of a specified focus neighbor.  
         */
        find_valid_focus_neighbor(side: Side): Control
        
        /** Prevents `*_theme_*_override` methods from emitting [constant NOTIFICATION_THEME_CHANGED] until [method end_bulk_theme_override] is called. */
        begin_bulk_theme_override(): void
        
        /** Ends a bulk theme override update. See [method begin_bulk_theme_override]. */
        end_bulk_theme_override(): void
        
        /** Creates a local override for a theme icon with the specified [param name]. Local overrides always take precedence when fetching theme items for the control. An override can be removed with [method remove_theme_icon_override].  
         *  See also [method get_theme_icon].  
         */
        add_theme_icon_override(name: StringName, texture: Texture2D): void
        
        /** Creates a local override for a theme [StyleBox] with the specified [param name]. Local overrides always take precedence when fetching theme items for the control. An override can be removed with [method remove_theme_stylebox_override].  
         *  See also [method get_theme_stylebox].  
         *  **Example:** Modify a property in a [StyleBox] by duplicating it:  
         *    
         */
        add_theme_stylebox_override(name: StringName, stylebox: StyleBox): void
        
        /** Creates a local override for a theme [Font] with the specified [param name]. Local overrides always take precedence when fetching theme items for the control. An override can be removed with [method remove_theme_font_override].  
         *  See also [method get_theme_font].  
         */
        add_theme_font_override(name: StringName, font: Font): void
        
        /** Creates a local override for a theme font size with the specified [param name]. Local overrides always take precedence when fetching theme items for the control. An override can be removed with [method remove_theme_font_size_override].  
         *  See also [method get_theme_font_size].  
         */
        add_theme_font_size_override(name: StringName, font_size: int64): void
        
        /** Creates a local override for a theme [Color] with the specified [param name]. Local overrides always take precedence when fetching theme items for the control. An override can be removed with [method remove_theme_color_override].  
         *  See also [method get_theme_color].  
         *  **Example:** Override a [Label]'s color and reset it later:  
         *    
         */
        add_theme_color_override(name: StringName, color: Color): void
        
        /** Creates a local override for a theme constant with the specified [param name]. Local overrides always take precedence when fetching theme items for the control. An override can be removed with [method remove_theme_constant_override].  
         *  See also [method get_theme_constant].  
         */
        add_theme_constant_override(name: StringName, constant: int64): void
        
        /** Removes a local override for a theme icon with the specified [param name] previously added by [method add_theme_icon_override] or via the Inspector dock. */
        remove_theme_icon_override(name: StringName): void
        
        /** Removes a local override for a theme [StyleBox] with the specified [param name] previously added by [method add_theme_stylebox_override] or via the Inspector dock. */
        remove_theme_stylebox_override(name: StringName): void
        
        /** Removes a local override for a theme [Font] with the specified [param name] previously added by [method add_theme_font_override] or via the Inspector dock. */
        remove_theme_font_override(name: StringName): void
        
        /** Removes a local override for a theme font size with the specified [param name] previously added by [method add_theme_font_size_override] or via the Inspector dock. */
        remove_theme_font_size_override(name: StringName): void
        
        /** Removes a local override for a theme [Color] with the specified [param name] previously added by [method add_theme_color_override] or via the Inspector dock. */
        remove_theme_color_override(name: StringName): void
        
        /** Removes a local override for a theme constant with the specified [param name] previously added by [method add_theme_constant_override] or via the Inspector dock. */
        remove_theme_constant_override(name: StringName): void
        
        /** Returns an icon from the first matching [Theme] in the tree if that [Theme] has an icon item with the specified [param name] and [param theme_type].  
         *  See [method get_theme_color] for details.  
         */
        get_theme_icon(name: StringName, theme_type: StringName = ''): Texture2D
        
        /** Returns a [StyleBox] from the first matching [Theme] in the tree if that [Theme] has a stylebox item with the specified [param name] and [param theme_type].  
         *  See [method get_theme_color] for details.  
         */
        get_theme_stylebox(name: StringName, theme_type: StringName = ''): StyleBox
        
        /** Returns a [Font] from the first matching [Theme] in the tree if that [Theme] has a font item with the specified [param name] and [param theme_type].  
         *  See [method get_theme_color] for details.  
         */
        get_theme_font(name: StringName, theme_type: StringName = ''): Font
        
        /** Returns a font size from the first matching [Theme] in the tree if that [Theme] has a font size item with the specified [param name] and [param theme_type].  
         *  See [method get_theme_color] for details.  
         */
        get_theme_font_size(name: StringName, theme_type: StringName = ''): int64
        
        /** Returns a [Color] from the first matching [Theme] in the tree if that [Theme] has a color item with the specified [param name] and [param theme_type]. If [param theme_type] is omitted the class name of the current control is used as the type, or [member theme_type_variation] if it is defined. If the type is a class name its parent classes are also checked, in order of inheritance. If the type is a variation its base types are checked, in order of dependency, then the control's class name and its parent classes are checked.  
         *  For the current control its local overrides are considered first (see [method add_theme_color_override]), then its assigned [member theme]. After the current control, each parent control and its assigned [member theme] are considered; controls without a [member theme] assigned are skipped. If no matching [Theme] is found in the tree, the custom project [Theme] (see [member ProjectSettings.gui/theme/custom]) and the default [Theme] are used (see [ThemeDB]).  
         *    
         */
        get_theme_color(name: StringName, theme_type: StringName = ''): Color
        
        /** Returns a constant from the first matching [Theme] in the tree if that [Theme] has a constant item with the specified [param name] and [param theme_type].  
         *  See [method get_theme_color] for details.  
         */
        get_theme_constant(name: StringName, theme_type: StringName = ''): int64
        
        /** Returns `true` if there is a local override for a theme icon with the specified [param name] in this [Control] node.  
         *  See [method add_theme_icon_override].  
         */
        has_theme_icon_override(name: StringName): boolean
        
        /** Returns `true` if there is a local override for a theme [StyleBox] with the specified [param name] in this [Control] node.  
         *  See [method add_theme_stylebox_override].  
         */
        has_theme_stylebox_override(name: StringName): boolean
        
        /** Returns `true` if there is a local override for a theme [Font] with the specified [param name] in this [Control] node.  
         *  See [method add_theme_font_override].  
         */
        has_theme_font_override(name: StringName): boolean
        
        /** Returns `true` if there is a local override for a theme font size with the specified [param name] in this [Control] node.  
         *  See [method add_theme_font_size_override].  
         */
        has_theme_font_size_override(name: StringName): boolean
        
        /** Returns `true` if there is a local override for a theme [Color] with the specified [param name] in this [Control] node.  
         *  See [method add_theme_color_override].  
         */
        has_theme_color_override(name: StringName): boolean
        
        /** Returns `true` if there is a local override for a theme constant with the specified [param name] in this [Control] node.  
         *  See [method add_theme_constant_override].  
         */
        has_theme_constant_override(name: StringName): boolean
        
        /** Returns `true` if there is a matching [Theme] in the tree that has an icon item with the specified [param name] and [param theme_type].  
         *  See [method get_theme_color] for details.  
         */
        has_theme_icon(name: StringName, theme_type: StringName = ''): boolean
        
        /** Returns `true` if there is a matching [Theme] in the tree that has a stylebox item with the specified [param name] and [param theme_type].  
         *  See [method get_theme_color] for details.  
         */
        has_theme_stylebox(name: StringName, theme_type: StringName = ''): boolean
        
        /** Returns `true` if there is a matching [Theme] in the tree that has a font item with the specified [param name] and [param theme_type].  
         *  See [method get_theme_color] for details.  
         */
        has_theme_font(name: StringName, theme_type: StringName = ''): boolean
        
        /** Returns `true` if there is a matching [Theme] in the tree that has a font size item with the specified [param name] and [param theme_type].  
         *  See [method get_theme_color] for details.  
         */
        has_theme_font_size(name: StringName, theme_type: StringName = ''): boolean
        
        /** Returns `true` if there is a matching [Theme] in the tree that has a color item with the specified [param name] and [param theme_type].  
         *  See [method get_theme_color] for details.  
         */
        has_theme_color(name: StringName, theme_type: StringName = ''): boolean
        
        /** Returns `true` if there is a matching [Theme] in the tree that has a constant item with the specified [param name] and [param theme_type].  
         *  See [method get_theme_color] for details.  
         */
        has_theme_constant(name: StringName, theme_type: StringName = ''): boolean
        
        /** Returns the default base scale value from the first matching [Theme] in the tree if that [Theme] has a valid [member Theme.default_base_scale] value.  
         *  See [method get_theme_color] for details.  
         */
        get_theme_default_base_scale(): float64
        
        /** Returns the default font from the first matching [Theme] in the tree if that [Theme] has a valid [member Theme.default_font] value.  
         *  See [method get_theme_color] for details.  
         */
        get_theme_default_font(): Font
        
        /** Returns the default font size value from the first matching [Theme] in the tree if that [Theme] has a valid [member Theme.default_font_size] value.  
         *  See [method get_theme_color] for details.  
         */
        get_theme_default_font_size(): int64
        
        /** Returns the parent control node. */
        get_parent_control(): Control
        
        /** Returns the tooltip text for the position [param at_position] in control's local coordinates, which will typically appear when the cursor is resting over this control. By default, it returns [member tooltip_text].  
         *  This method can be overridden to customize its behavior. See [method _get_tooltip].  
         *      
         *  **Note:** If this method returns an empty [String] and [method _make_custom_tooltip] is not overridden, no tooltip is displayed.  
         */
        get_tooltip(at_position: Vector2 = Vector2.ZERO): string
        
        /** Returns the mouse cursor shape the control displays on mouse hover. See [enum CursorShape]. */
        get_cursor_shape(position: Vector2 = Vector2.ZERO): Control.CursorShape
        
        /** Sets the focus neighbor for the specified [enum Side] to the [Control] at [param neighbor] node path. A setter method for [member focus_neighbor_bottom], [member focus_neighbor_left], [member focus_neighbor_right] and [member focus_neighbor_top]. */
        set_focus_neighbor(side: Side, neighbor: NodePath | string): void
        
        /** Returns the focus neighbor for the specified [enum Side]. A getter method for [member focus_neighbor_bottom], [member focus_neighbor_left], [member focus_neighbor_right] and [member focus_neighbor_top].  
         *      
         *  **Note:** To find the next [Control] on the specific [enum Side], even if a neighbor is not assigned, use [method find_valid_focus_neighbor].  
         */
        get_focus_neighbor(side: Side): NodePath
        
        /** Forces drag and bypasses [method _get_drag_data] and [method set_drag_preview] by passing [param data] and [param preview]. Drag will start even if the mouse is neither over nor pressed on this control.  
         *  The methods [method _can_drop_data] and [method _drop_data] must be implemented on controls that want to receive drop data.  
         */
        force_drag(data: any, preview: Control): void
        
        /** Creates an [InputEventMouseButton] that attempts to click the control. If the event is received, the control gains focus.  
         *    
         */
        grab_click_focus(): void
        
        /** Sets the given callables to be used instead of the control's own drag-and-drop virtual methods. If a callable is empty, its respective virtual method is used as normal.  
         *  The arguments for each callable should be exactly the same as their respective virtual methods, which would be:  
         *  - [param drag_func] corresponds to [method _get_drag_data] and requires a [Vector2];  
         *  - [param can_drop_func] corresponds to [method _can_drop_data] and requires both a [Vector2] and a [Variant];  
         *  - [param drop_func] corresponds to [method _drop_data] and requires both a [Vector2] and a [Variant].  
         */
        set_drag_forwarding(drag_func: Callable, can_drop_func: Callable, drop_func: Callable): void
        
        /** Shows the given control at the mouse pointer. A good time to call this method is in [method _get_drag_data]. The control must not be in the scene tree. You should not free the control, and you should not keep a reference to the control beyond the duration of the drag. It will be deleted automatically after the drag has ended.  
         *    
         */
        set_drag_preview(control: Control): void
        
        /** Returns `true` if a drag operation is successful. Alternative to [method Viewport.gui_is_drag_successful].  
         *  Best used with [constant Node.NOTIFICATION_DRAG_END].  
         */
        is_drag_successful(): boolean
        
        /** Moves the mouse cursor to [param position], relative to [member position] of this [Control].  
         *      
         *  **Note:** [method warp_mouse] is only supported on Windows, macOS and Linux. It has no effect on Android, iOS and Web.  
         */
        warp_mouse(position: Vector2): void
        
        /** Invalidates the size cache in this node and in parent nodes up to top level. Intended to be used with [method get_minimum_size] when the return value is changed. Setting [member custom_minimum_size] directly calls this method automatically. */
        update_minimum_size(): void
        
        /** Returns `true` if layout is right-to-left. See also [member layout_direction]. */
        is_layout_rtl(): boolean
        
        /** Enables whether rendering of [CanvasItem] based children should be clipped to this control's rectangle. If `true`, parts of a child which would be visibly outside of this control's rectangle will not be rendered and won't receive input. */
        get clip_contents(): boolean
        set clip_contents(value: boolean)
        
        /** The minimum size of the node's bounding rectangle. If you set it to a value greater than `(0, 0)`, the node's bounding rectangle will always have at least this size. Note that [Control] nodes have their internal minimum size returned by [method get_minimum_size]. It depends on the control's contents, like text, textures, or style boxes. The actual minimum size is the maximum value of this property and the internal minimum size (see [method get_combined_minimum_size]). */
        get custom_minimum_size(): Vector2
        set custom_minimum_size(value: Vector2)
        
        /** Controls layout direction and text writing direction. Right-to-left layouts are necessary for certain languages (e.g. Arabic and Hebrew). See also [method is_layout_rtl]. */
        get layout_direction(): int64
        set layout_direction(value: int64)
        get layout_mode(): int64
        set layout_mode(value: int64)
        get anchors_preset(): int64
        set anchors_preset(value: int64)
        
        /** Anchors the left edge of the node to the origin, the center or the end of its parent control. It changes how the left offset updates when the node moves or changes size. You can use one of the [enum Anchor] constants for convenience. */
        get anchor_left(): float64
        set anchor_left(value: float64)
        
        /** Anchors the top edge of the node to the origin, the center or the end of its parent control. It changes how the top offset updates when the node moves or changes size. You can use one of the [enum Anchor] constants for convenience. */
        get anchor_top(): float64
        set anchor_top(value: float64)
        
        /** Anchors the right edge of the node to the origin, the center or the end of its parent control. It changes how the right offset updates when the node moves or changes size. You can use one of the [enum Anchor] constants for convenience. */
        get anchor_right(): float64
        set anchor_right(value: float64)
        
        /** Anchors the bottom edge of the node to the origin, the center, or the end of its parent control. It changes how the bottom offset updates when the node moves or changes size. You can use one of the [enum Anchor] constants for convenience. */
        get anchor_bottom(): float64
        set anchor_bottom(value: float64)
        
        /** Distance between the node's left edge and its parent control, based on [member anchor_left].  
         *  Offsets are often controlled by one or multiple parent [Container] nodes, so you should not modify them manually if your node is a direct child of a [Container]. Offsets update automatically when you move or resize the node.  
         */
        get offset_left(): float64
        set offset_left(value: float64)
        
        /** Distance between the node's top edge and its parent control, based on [member anchor_top].  
         *  Offsets are often controlled by one or multiple parent [Container] nodes, so you should not modify them manually if your node is a direct child of a [Container]. Offsets update automatically when you move or resize the node.  
         */
        get offset_top(): float64
        set offset_top(value: float64)
        
        /** Distance between the node's right edge and its parent control, based on [member anchor_right].  
         *  Offsets are often controlled by one or multiple parent [Container] nodes, so you should not modify them manually if your node is a direct child of a [Container]. Offsets update automatically when you move or resize the node.  
         */
        get offset_right(): float64
        set offset_right(value: float64)
        
        /** Distance between the node's bottom edge and its parent control, based on [member anchor_bottom].  
         *  Offsets are often controlled by one or multiple parent [Container] nodes, so you should not modify them manually if your node is a direct child of a [Container]. Offsets update automatically when you move or resize the node.  
         */
        get offset_bottom(): float64
        set offset_bottom(value: float64)
        
        /** Controls the direction on the horizontal axis in which the control should grow if its horizontal minimum size is changed to be greater than its current size, as the control always has to be at least the minimum size. */
        get grow_horizontal(): int64
        set grow_horizontal(value: int64)
        
        /** Controls the direction on the vertical axis in which the control should grow if its vertical minimum size is changed to be greater than its current size, as the control always has to be at least the minimum size. */
        get grow_vertical(): int64
        set grow_vertical(value: int64)
        
        /** The size of the node's bounding rectangle, in the node's coordinate system. [Container] nodes update this property automatically. */
        get size(): Vector2
        set size(value: Vector2)
        
        /** The node's position, relative to its containing node. It corresponds to the rectangle's top-left corner. The property is not affected by [member pivot_offset]. */
        get position(): Vector2
        set position(value: Vector2)
        
        /** The node's global position, relative to the world (usually to the [CanvasLayer]). */
        get global_position(): Vector2
        set global_position(value: Vector2)
        
        /** The node's rotation around its pivot, in radians. See [member pivot_offset] to change the pivot's position.  
         *      
         *  **Note:** This property is edited in the inspector in degrees. If you want to use degrees in a script, use [member rotation_degrees].  
         */
        get rotation(): float64
        set rotation(value: float64)
        
        /** Helper property to access [member rotation] in degrees instead of radians. */
        get rotation_degrees(): float64
        set rotation_degrees(value: float64)
        
        /** The node's scale, relative to its [member size]. Change this property to scale the node around its [member pivot_offset]. The Control's [member tooltip_text] will also scale according to this value.  
         *      
         *  **Note:** This property is mainly intended to be used for animation purposes. To support multiple resolutions in your project, use an appropriate viewport stretch mode as described in the [url=https://docs.godotengine.org/en/4.4/tutorials/rendering/multiple_resolutions.html]documentation[/url] instead of scaling Controls individually.  
         *      
         *  **Note:** [member FontFile.oversampling] does  *not*  take [Control] [member scale] into account. This means that scaling up/down will cause bitmap fonts and rasterized (non-MSDF) dynamic fonts to appear blurry or pixelated. To ensure text remains crisp regardless of scale, you can enable MSDF font rendering by enabling [member ProjectSettings.gui/theme/default_font_multichannel_signed_distance_field] (applies to the default project font only), or enabling **Multichannel Signed Distance Field** in the import options of a DynamicFont for custom fonts. On system fonts, [member SystemFont.multichannel_signed_distance_field] can be enabled in the inspector.  
         *      
         *  **Note:** If the Control node is a child of a [Container] node, the scale will be reset to `Vector2(1, 1)` when the scene is instantiated. To set the Control's scale when it's instantiated, wait for one frame using `await get_tree().process_frame` then set its [member scale] property.  
         */
        get scale(): Vector2
        set scale(value: Vector2)
        
        /** By default, the node's pivot is its top-left corner. When you change its [member rotation] or [member scale], it will rotate or scale around this pivot. Set this property to [member size] / 2 to pivot around the Control's center. */
        get pivot_offset(): Vector2
        set pivot_offset(value: Vector2)
        
        /** Tells the parent [Container] nodes how they should resize and place the node on the X axis. Use a combination of the [enum SizeFlags] constants to change the flags. See the constants to learn what each does. */
        get size_flags_horizontal(): int64
        set size_flags_horizontal(value: int64)
        
        /** Tells the parent [Container] nodes how they should resize and place the node on the Y axis. Use a combination of the [enum SizeFlags] constants to change the flags. See the constants to learn what each does. */
        get size_flags_vertical(): int64
        set size_flags_vertical(value: int64)
        
        /** If the node and at least one of its neighbors uses the [constant SIZE_EXPAND] size flag, the parent [Container] will let it take more or less space depending on this property. If this node has a stretch ratio of 2 and its neighbor a ratio of 1, this node will take two thirds of the available space. */
        get size_flags_stretch_ratio(): float64
        set size_flags_stretch_ratio(value: float64)
        
        /** If `true`, automatically converts code line numbers, list indices, [SpinBox] and [ProgressBar] values from the Western Arabic (0..9) to the numeral systems used in current locale.  
         *      
         *  **Note:** Numbers within the text are not automatically converted, it can be done manually, using [method TextServer.format_number].  
         */
        get localize_numeral_system(): boolean
        set localize_numeral_system(value: boolean)
        
        /** Toggles if any text should automatically change to its translated version depending on the current locale. */
        get auto_translate(): boolean
        set auto_translate(value: boolean)
        
        /** The default tooltip text. The tooltip appears when the user's mouse cursor stays idle over this control for a few moments, provided that the [member mouse_filter] property is not [constant MOUSE_FILTER_IGNORE]. The time required for the tooltip to appear can be changed with the [member ProjectSettings.gui/timers/tooltip_delay_sec] setting.  
         *  This string is the default return value of [method get_tooltip]. Override [method _get_tooltip] to generate tooltip text dynamically. Override [method _make_custom_tooltip] to customize the tooltip interface and behavior.  
         *  The tooltip popup will use either a default implementation, or a custom one that you can provide by overriding [method _make_custom_tooltip]. The default tooltip includes a [PopupPanel] and [Label] whose theme properties can be customized using [Theme] methods with the `"TooltipPanel"` and `"TooltipLabel"` respectively. For example:  
         *    
         */
        get tooltip_text(): string
        set tooltip_text(value: string)
        
        /** Defines if tooltip text should automatically change to its translated version depending on the current locale. Uses the same auto translate mode as this control when set to [constant Node.AUTO_TRANSLATE_MODE_INHERIT].  
         *      
         *  **Note:** Tooltips customized using [method _make_custom_tooltip] do not use this auto translate mode automatically.  
         */
        get tooltip_auto_translate_mode(): int64
        set tooltip_auto_translate_mode(value: int64)
        
        /** Tells Godot which node it should give focus to if the user presses the left arrow on the keyboard or left on a gamepad by default. You can change the key by editing the [member ProjectSettings.input/ui_left] input action. The node must be a [Control]. If this property is not set, Godot will give focus to the closest [Control] to the left of this one. */
        get focus_neighbor_left(): NodePath
        set focus_neighbor_left(value: NodePath | string)
        
        /** Tells Godot which node it should give focus to if the user presses the top arrow on the keyboard or top on a gamepad by default. You can change the key by editing the [member ProjectSettings.input/ui_up] input action. The node must be a [Control]. If this property is not set, Godot will give focus to the closest [Control] to the top of this one. */
        get focus_neighbor_top(): NodePath
        set focus_neighbor_top(value: NodePath | string)
        
        /** Tells Godot which node it should give focus to if the user presses the right arrow on the keyboard or right on a gamepad by default. You can change the key by editing the [member ProjectSettings.input/ui_right] input action. The node must be a [Control]. If this property is not set, Godot will give focus to the closest [Control] to the right of this one. */
        get focus_neighbor_right(): NodePath
        set focus_neighbor_right(value: NodePath | string)
        
        /** Tells Godot which node it should give focus to if the user presses the down arrow on the keyboard or down on a gamepad by default. You can change the key by editing the [member ProjectSettings.input/ui_down] input action. The node must be a [Control]. If this property is not set, Godot will give focus to the closest [Control] to the bottom of this one. */
        get focus_neighbor_bottom(): NodePath
        set focus_neighbor_bottom(value: NodePath | string)
        
        /** Tells Godot which node it should give focus to if the user presses [kbd]Tab[/kbd] on a keyboard by default. You can change the key by editing the [member ProjectSettings.input/ui_focus_next] input action.  
         *  If this property is not set, Godot will select a "best guess" based on surrounding nodes in the scene tree.  
         */
        get focus_next(): NodePath
        set focus_next(value: NodePath | string)
        
        /** Tells Godot which node it should give focus to if the user presses [kbd]Shift + Tab[/kbd] on a keyboard by default. You can change the key by editing the [member ProjectSettings.input/ui_focus_prev] input action.  
         *  If this property is not set, Godot will select a "best guess" based on surrounding nodes in the scene tree.  
         */
        get focus_previous(): NodePath
        set focus_previous(value: NodePath | string)
        
        /** The focus access mode for the control (None, Click or All). Only one Control can be focused at the same time, and it will receive keyboard, gamepad, and mouse signals. */
        get focus_mode(): int64
        set focus_mode(value: int64)
        
        /** Controls whether the control will be able to receive mouse button input events through [method _gui_input] and how these events should be handled. Also controls whether the control can receive the [signal mouse_entered], and [signal mouse_exited] signals. See the constants to learn what each does. */
        get mouse_filter(): int64
        set mouse_filter(value: int64)
        
        /** When enabled, scroll wheel events processed by [method _gui_input] will be passed to the parent control even if [member mouse_filter] is set to [constant MOUSE_FILTER_STOP].  
         *  You should disable it on the root of your UI if you do not want scroll events to go to the [method Node._unhandled_input] processing.  
         *      
         *  **Note:** Because this property defaults to `true`, this allows nested scrollable containers to work out of the box.  
         */
        get mouse_force_pass_scroll_events(): boolean
        set mouse_force_pass_scroll_events(value: boolean)
        
        /** The default cursor shape for this control. Useful for Godot plugins and applications or games that use the system's mouse cursors.  
         *      
         *  **Note:** On Linux, shapes may vary depending on the cursor theme of the system.  
         */
        get mouse_default_cursor_shape(): int64
        set mouse_default_cursor_shape(value: int64)
        
        /** The [Node] which must be a parent of the focused [Control] for the shortcut to be activated. If `null`, the shortcut can be activated when any control is focused (a global shortcut). This allows shortcuts to be accepted only when the user has a certain area of the GUI focused. */
        get shortcut_context(): Object
        set shortcut_context(value: Object)
        
        /** The [Theme] resource this node and all its [Control] and [Window] children use. If a child node has its own [Theme] resource set, theme items are merged with child's definitions having higher priority.  
         *      
         *  **Note:** [Window] styles will have no effect unless the window is embedded.  
         */
        get theme(): Theme
        set theme(value: Theme)
        
        /** The name of a theme type variation used by this [Control] to look up its own theme items. When empty, the class name of the node is used (e.g. [code skip-lint]Button` for the [Button] control), as well as the class names of all parent classes (in order of inheritance).  
         *  When set, this property gives the highest priority to the type of the specified name. This type can in turn extend another type, forming a dependency chain. See [method Theme.set_type_variation]. If the theme item cannot be found using this type or its base types, lookup falls back on the class names.  
         *      
         *  **Note:** To look up [Control]'s own items use various `get_theme_*` methods without specifying `theme_type`.  
         *      
         *  **Note:** Theme items are looked for in the tree order, from branch to root, where each [Control] node is checked for its [member theme] property. The earliest match against any type/class name is returned. The project-level Theme and the default Theme are checked last.  
         */
        get theme_type_variation(): string
        set theme_type_variation(value: string)
        
        /** Emitted when the control changes size. */
        readonly resized: Signal0
        
        /** Emitted when the node receives an [InputEvent]. */
        readonly gui_input: Signal1<InputEvent>
        
        /** Emitted when the mouse cursor enters the control's (or any child control's) visible area, that is not occluded behind other Controls or Windows, provided its [member mouse_filter] lets the event reach it and regardless if it's currently focused or not.  
         *      
         *  **Note:** [member CanvasItem.z_index] doesn't affect, which Control receives the signal.  
         */
        readonly mouse_entered: Signal0
        
        /** Emitted when the mouse cursor leaves the control's (and all child control's) visible area, that is not occluded behind other Controls or Windows, provided its [member mouse_filter] lets the event reach it and regardless if it's currently focused or not.  
         *      
         *  **Note:** [member CanvasItem.z_index] doesn't affect, which Control receives the signal.  
         *      
         *  **Note:** If you want to check whether the mouse truly left the area, ignoring any top nodes, you can use code like this:  
         *    
         */
        readonly mouse_exited: Signal0
        
        /** Emitted when the node gains focus. */
        readonly focus_entered: Signal0
        
        /** Emitted when the node loses focus. */
        readonly focus_exited: Signal0
        
        /** Emitted when one of the size flags changes. See [member size_flags_horizontal] and [member size_flags_vertical]. */
        readonly size_flags_changed: Signal0
        
        /** Emitted when the node's minimum size changes. */
        readonly minimum_size_changed: Signal0
        
        /** Emitted when the [constant NOTIFICATION_THEME_CHANGED] notification is sent. */
        readonly theme_changed: Signal0
    }
    class ControlEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    class ControlEditorPopupButton<Map extends Record<string, Node> = Record<string, Node>> extends Button<Map> {
        constructor(identifier?: any)
    }
    class ControlEditorPresetPicker<Map extends Record<string, Node> = Record<string, Node>> extends MarginContainer<Map> {
        constructor(identifier?: any)
    }
    class ControlEditorToolbar<Map extends Record<string, Node> = Record<string, Node>> extends HBoxContainer<Map> {
        constructor(identifier?: any)
    }
    /** A 2D convex polygon shape used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_convexpolygonshape2d.html  
     */
    class ConvexPolygonShape2D extends Shape2D {
        constructor(identifier?: any)
        /** Based on the set of points provided, this assigns the [member points] property using the convex hull algorithm, removing all unneeded points. See [method Geometry2D.convex_hull] for details. */
        set_point_cloud(point_cloud: PackedVector2Array | Vector2[]): void
        
        /** The polygon's list of vertices that form a convex hull. Can be in either clockwise or counterclockwise order.  
         *  **Warning:** Only set this property to a list of points that actually form a convex hull. Use [method set_point_cloud] to generate the convex hull of an arbitrary set of points.  
         */
        get points(): PackedVector2Array
        set points(value: PackedVector2Array | Vector2[])
    }
    /** A 3D convex polyhedron shape used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_convexpolygonshape3d.html  
     */
    class ConvexPolygonShape3D extends Shape3D {
        constructor(identifier?: any)
        /** The list of 3D points forming the convex polygon shape. */
        get points(): GArray
        set points(value: GArray)
    }
    class CreateDialog<Map extends Record<string, Node> = Record<string, Node>> extends ConfirmationDialog<Map> {
        constructor(identifier?: any)
        readonly create: Signal0
        readonly favorites_updated: Signal0
    }
    /** Provides access to advanced cryptographic functionalities.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_crypto.html  
     */
    class Crypto extends RefCounted {
        constructor(identifier?: any)
        /** Generates a [PackedByteArray] of cryptographically secure random bytes with given [param size]. */
        generate_random_bytes(size: int64): PackedByteArray
        
        /** Generates an RSA [CryptoKey] that can be used for creating self-signed certificates and passed to [method StreamPeerTLS.accept_stream]. */
        generate_rsa(size: int64): CryptoKey
        
        /** Generates a self-signed [X509Certificate] from the given [CryptoKey] and [param issuer_name]. The certificate validity will be defined by [param not_before] and [param not_after] (first valid date and last valid date). The [param issuer_name] must contain at least "CN=" (common name, i.e. the domain name), "O=" (organization, i.e. your company name), "C=" (country, i.e. 2 lettered ISO-3166 code of the country the organization is based in).  
         *  A small example to generate an RSA key and an X509 self-signed certificate.  
         *    
         */
        generate_self_signed_certificate(key: CryptoKey, issuer_name: string = 'CN=myserver,O=myorganisation,C=IT', not_before: string = '20140101000000', not_after: string = '20340101000000'): X509Certificate
        
        /** Sign a given [param hash] of type [param hash_type] with the provided private [param key]. */
        sign(hash_type: HashingContext.HashType, hash: PackedByteArray | byte[] | ArrayBuffer, key: CryptoKey): PackedByteArray
        
        /** Verify that a given [param signature] for [param hash] of type [param hash_type] against the provided public [param key]. */
        verify(hash_type: HashingContext.HashType, hash: PackedByteArray | byte[] | ArrayBuffer, signature: PackedByteArray | byte[] | ArrayBuffer, key: CryptoKey): boolean
        
        /** Encrypt the given [param plaintext] with the provided public [param key].  
         *      
         *  **Note:** The maximum size of accepted plaintext is limited by the key size.  
         */
        encrypt(key: CryptoKey, plaintext: PackedByteArray | byte[] | ArrayBuffer): PackedByteArray
        
        /** Decrypt the given [param ciphertext] with the provided private [param key].  
         *      
         *  **Note:** The maximum size of accepted ciphertext is limited by the key size.  
         */
        decrypt(key: CryptoKey, ciphertext: PackedByteArray | byte[] | ArrayBuffer): PackedByteArray
        
        /** Generates an [url=https://en.wikipedia.org/wiki/HMAC]HMAC[/url] digest of [param msg] using [param key]. The [param hash_type] parameter is the hashing algorithm that is used for the inner and outer hashes.  
         *  Currently, only [constant HashingContext.HASH_SHA256] and [constant HashingContext.HASH_SHA1] are supported.  
         */
        hmac_digest(hash_type: HashingContext.HashType, key: PackedByteArray | byte[] | ArrayBuffer, msg: PackedByteArray | byte[] | ArrayBuffer): PackedByteArray
        
        /** Compares two [PackedByteArray]s for equality without leaking timing information in order to prevent timing attacks.  
         *  See [url=https://paragonie.com/blog/2015/11/preventing-timing-attacks-on-string-comparison-with-double-hmac-strategy]this blog post[/url] for more information.  
         */
        constant_time_compare(trusted: PackedByteArray | byte[] | ArrayBuffer, received: PackedByteArray | byte[] | ArrayBuffer): boolean
    }
    /** A cryptographic key (RSA or elliptic-curve).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_cryptokey.html  
     */
    class CryptoKey extends Resource {
        constructor(identifier?: any)
        /** Saves a key to the given [param path]. If [param public_only] is `true`, only the public key will be saved.  
         *      
         *  **Note:** [param path] should be a "*.pub" file if [param public_only] is `true`, a "*.key" file otherwise.  
         */
        save(path: string, public_only: boolean = false): GError
        
        /** Loads a key from [param path]. If [param public_only] is `true`, only the public key will be loaded.  
         *      
         *  **Note:** [param path] should be a "*.pub" file if [param public_only] is `true`, a "*.key" file otherwise.  
         */
        load(path: string, public_only: boolean = false): GError
        
        /** Returns `true` if this CryptoKey only has the public part, and not the private one. */
        is_public_only(): boolean
        
        /** Returns a string containing the key in PEM format. If [param public_only] is `true`, only the public key will be included. */
        save_to_string(public_only: boolean = false): string
        
        /** Loads a key from the given [param string_key]. If [param public_only] is `true`, only the public key will be loaded. */
        load_from_string(string_key: string, public_only: boolean = false): GError
    }
    /** Six square textures representing the faces of a cube. Commonly used as a skybox.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_cubemap.html  
     */
    class Cubemap extends ImageTextureLayered {
        constructor(identifier?: any)
        /** Creates a placeholder version of this resource ([PlaceholderCubemap]). */
        create_placeholder(): Resource
    }
    /** An array of [Cubemap]s, stored together and with a single reference.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_cubemaparray.html  
     */
    class CubemapArray extends ImageTextureLayered {
        constructor(identifier?: any)
        /** Creates a placeholder version of this resource ([PlaceholderCubemapArray]). */
        create_placeholder(): Resource
    }
    namespace Curve {
        enum TangentMode {
            /** The tangent on this side of the point is user-defined. */
            TANGENT_FREE = 0,
            
            /** The curve calculates the tangent on this side of the point as the slope halfway towards the adjacent point. */
            TANGENT_LINEAR = 1,
            
            /** The total number of available tangent modes. */
            TANGENT_MODE_COUNT = 2,
        }
    }
    /** A mathematical curve.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_curve.html  
     */
    class Curve extends Resource {
        constructor(identifier?: any)
        /** Adds a point to the curve. For each side, if the `*_mode` is [constant TANGENT_LINEAR], the `*_tangent` angle (in degrees) uses the slope of the curve halfway to the adjacent point. Allows custom assignments to the `*_tangent` angle if `*_mode` is set to [constant TANGENT_FREE]. */
        add_point(position: Vector2, left_tangent: float64 = 0, right_tangent: float64 = 0, left_mode: Curve.TangentMode = 0, right_mode: Curve.TangentMode = 0): int64
        
        /** Removes the point at [param index] from the curve. */
        remove_point(index: int64): void
        
        /** Removes all points from the curve. */
        clear_points(): void
        
        /** Returns the curve coordinates for the point at [param index]. */
        get_point_position(index: int64): Vector2
        
        /** Assigns the vertical position [param y] to the point at [param index]. */
        set_point_value(index: int64, y: float64): void
        
        /** Sets the offset from `0.5`. */
        set_point_offset(index: int64, offset: float64): int64
        
        /** Returns the Y value for the point that would exist at the X position [param offset] along the curve. */
        sample(offset: float64): float64
        
        /** Returns the Y value for the point that would exist at the X position [param offset] along the curve using the baked cache. Bakes the curve's points if not already baked. */
        sample_baked(offset: float64): float64
        
        /** Returns the left tangent angle (in degrees) for the point at [param index]. */
        get_point_left_tangent(index: int64): float64
        
        /** Returns the right tangent angle (in degrees) for the point at [param index]. */
        get_point_right_tangent(index: int64): float64
        
        /** Returns the left [enum TangentMode] for the point at [param index]. */
        get_point_left_mode(index: int64): Curve.TangentMode
        
        /** Returns the right [enum TangentMode] for the point at [param index]. */
        get_point_right_mode(index: int64): Curve.TangentMode
        
        /** Sets the left tangent angle for the point at [param index] to [param tangent]. */
        set_point_left_tangent(index: int64, tangent: float64): void
        
        /** Sets the right tangent angle for the point at [param index] to [param tangent]. */
        set_point_right_tangent(index: int64, tangent: float64): void
        
        /** Sets the left [enum TangentMode] for the point at [param index] to [param mode]. */
        set_point_left_mode(index: int64, mode: Curve.TangentMode): void
        
        /** Sets the right [enum TangentMode] for the point at [param index] to [param mode]. */
        set_point_right_mode(index: int64, mode: Curve.TangentMode): void
        
        /** Returns the difference between [member min_value] and [member max_value]. */
        get_value_range(): float64
        
        /** Returns the difference between [member min_domain] and [member max_domain]. */
        get_domain_range(): float64
        
        /** Removes duplicate points, i.e. points that are less than 0.00001 units (engine epsilon value) away from their neighbor on the curve. */
        clean_dupes(): void
        
        /** Recomputes the baked cache of points for the curve. */
        bake(): void
        
        /** The minimum domain (x-coordinate) that points can have. */
        get min_domain(): float64
        set min_domain(value: float64)
        
        /** The maximum domain (x-coordinate) that points can have. */
        get max_domain(): float64
        set max_domain(value: float64)
        
        /** The minimum value (y-coordinate) that points can have. Tangents can cause lower values between points. */
        get min_value(): float64
        set min_value(value: float64)
        
        /** The maximum value (y-coordinate) that points can have. Tangents can cause higher values between points. */
        get max_value(): float64
        set max_value(value: float64)
        get _limits(): any
        set _limits(value: any)
        
        /** The number of points to include in the baked (i.e. cached) curve data. */
        get bake_resolution(): int64
        set bake_resolution(value: int64)
        get _data(): int64
        set _data(value: int64)
        
        /** The number of points describing the curve. */
        get point_count(): any /*Points,point_*/
        set point_count(value: any /*Points,point_*/)
        
        /** Emitted when [member max_value] or [member min_value] is changed. */
        readonly range_changed: Signal0
        
        /** Emitted when [member max_domain] or [member min_domain] is changed. */
        readonly domain_changed: Signal0
    }
    /** Describes a Bézier curve in 2D space.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_curve2d.html  
     */
    class Curve2D extends Resource {
        constructor(identifier?: any)
        /** Adds a point with the specified [param position] relative to the curve's own position, with control points [param in] and [param out]. Appends the new point at the end of the point list.  
         *  If [param index] is given, the new point is inserted before the existing point identified by index [param index]. Every existing point starting from [param index] is shifted further down the list of points. The index must be greater than or equal to `0` and must not exceed the number of existing points in the line. See [member point_count].  
         */
        add_point(position: Vector2, in_: Vector2 = Vector2.ZERO, out_: Vector2 = Vector2.ZERO, index: int64 = -1): void
        
        /** Sets the position for the vertex [param idx]. If the index is out of bounds, the function sends an error to the console. */
        set_point_position(idx: int64, position: Vector2): void
        
        /** Returns the position of the vertex [param idx]. If the index is out of bounds, the function sends an error to the console, and returns `(0, 0)`. */
        get_point_position(idx: int64): Vector2
        
        /** Sets the position of the control point leading to the vertex [param idx]. If the index is out of bounds, the function sends an error to the console. The position is relative to the vertex. */
        set_point_in(idx: int64, position: Vector2): void
        
        /** Returns the position of the control point leading to the vertex [param idx]. The returned position is relative to the vertex [param idx]. If the index is out of bounds, the function sends an error to the console, and returns `(0, 0)`. */
        get_point_in(idx: int64): Vector2
        
        /** Sets the position of the control point leading out of the vertex [param idx]. If the index is out of bounds, the function sends an error to the console. The position is relative to the vertex. */
        set_point_out(idx: int64, position: Vector2): void
        
        /** Returns the position of the control point leading out of the vertex [param idx]. The returned position is relative to the vertex [param idx]. If the index is out of bounds, the function sends an error to the console, and returns `(0, 0)`. */
        get_point_out(idx: int64): Vector2
        
        /** Deletes the point [param idx] from the curve. Sends an error to the console if [param idx] is out of bounds. */
        remove_point(idx: int64): void
        
        /** Removes all points from the curve. */
        clear_points(): void
        
        /** Returns the position between the vertex [param idx] and the vertex `idx + 1`, where [param t] controls if the point is the first vertex (`t = 0.0`), the last vertex (`t = 1.0`), or in between. Values of [param t] outside the range (`0.0 <= t <= 1.0`) give strange, but predictable results.  
         *  If [param idx] is out of bounds it is truncated to the first or last vertex, and [param t] is ignored. If the curve has no points, the function sends an error to the console, and returns `(0, 0)`.  
         */
        sample(idx: int64, t: float64): Vector2
        
        /** Returns the position at the vertex [param fofs]. It calls [method sample] using the integer part of [param fofs] as `idx`, and its fractional part as `t`. */
        samplef(fofs: float64): Vector2
        
        /** Returns the total length of the curve, based on the cached points. Given enough density (see [member bake_interval]), it should be approximate enough. */
        get_baked_length(): float64
        
        /** Returns a point within the curve at position [param offset], where [param offset] is measured as a pixel distance along the curve.  
         *  To do that, it finds the two cached points where the [param offset] lies between, then interpolates the values. This interpolation is cubic if [param cubic] is set to `true`, or linear if set to `false`.  
         *  Cubic interpolation tends to follow the curves better, but linear is faster (and often, precise enough).  
         */
        sample_baked(offset: float64 = 0, cubic: boolean = false): Vector2
        
        /** Similar to [method sample_baked], but returns [Transform2D] that includes a rotation along the curve, with [member Transform2D.origin] as the point position and the [member Transform2D.x] vector pointing in the direction of the path at that point. Returns an empty transform if the length of the curve is `0`.  
         *    
         */
        sample_baked_with_rotation(offset: float64 = 0, cubic: boolean = false): Transform2D
        
        /** Returns the cache of points as a [PackedVector2Array]. */
        get_baked_points(): PackedVector2Array
        
        /** Returns the closest point on baked segments (in curve's local space) to [param to_point].  
         *  [param to_point] must be in this curve's local space.  
         */
        get_closest_point(to_point: Vector2): Vector2
        
        /** Returns the closest offset to [param to_point]. This offset is meant to be used in [method sample_baked].  
         *  [param to_point] must be in this curve's local space.  
         */
        get_closest_offset(to_point: Vector2): float64
        
        /** Returns a list of points along the curve, with a curvature controlled point density. That is, the curvier parts will have more points than the straighter parts.  
         *  This approximation makes straight segments between each point, then subdivides those segments until the resulting shape is similar enough.  
         *  [param max_stages] controls how many subdivisions a curve segment may face before it is considered approximate enough. Each subdivision splits the segment in half, so the default 5 stages may mean up to 32 subdivisions per curve segment. Increase with care!  
         *  [param tolerance_degrees] controls how many degrees the midpoint of a segment may deviate from the real curve, before the segment has to be subdivided.  
         */
        tessellate(max_stages: int64 = 5, tolerance_degrees: float64 = 4): PackedVector2Array
        
        /** Returns a list of points along the curve, with almost uniform density. [param max_stages] controls how many subdivisions a curve segment may face before it is considered approximate enough. Each subdivision splits the segment in half, so the default 5 stages may mean up to 32 subdivisions per curve segment. Increase with care!  
         *  [param tolerance_length] controls the maximal distance between two neighboring points, before the segment has to be subdivided.  
         */
        tessellate_even_length(max_stages: int64 = 5, tolerance_length: float64 = 20): PackedVector2Array
        
        /** The distance in pixels between two adjacent cached points. Changing it forces the cache to be recomputed the next time the [method get_baked_points] or [method get_baked_length] function is called. The smaller the distance, the more points in the cache and the more memory it will consume, so use with care. */
        get bake_interval(): float64
        set bake_interval(value: float64)
        get _data(): int64
        set _data(value: int64)
        
        /** The number of points describing the curve. */
        get point_count(): any /*Points,point_*/
        set point_count(value: any /*Points,point_*/)
    }
    /** Describes a Bézier curve in 3D space.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_curve3d.html  
     */
    class Curve3D extends Resource {
        constructor(identifier?: any)
        /** Adds a point with the specified [param position] relative to the curve's own position, with control points [param in] and [param out]. Appends the new point at the end of the point list.  
         *  If [param index] is given, the new point is inserted before the existing point identified by index [param index]. Every existing point starting from [param index] is shifted further down the list of points. The index must be greater than or equal to `0` and must not exceed the number of existing points in the line. See [member point_count].  
         */
        add_point(position: Vector3, in_: Vector3 = new Vector3(0, 0, 0), out_: Vector3 = new Vector3(0, 0, 0), index: int64 = -1): void
        
        /** Sets the position for the vertex [param idx]. If the index is out of bounds, the function sends an error to the console. */
        set_point_position(idx: int64, position: Vector3): void
        
        /** Returns the position of the vertex [param idx]. If the index is out of bounds, the function sends an error to the console, and returns `(0, 0, 0)`. */
        get_point_position(idx: int64): Vector3
        
        /** Sets the tilt angle in radians for the point [param idx]. If the index is out of bounds, the function sends an error to the console.  
         *  The tilt controls the rotation along the look-at axis an object traveling the path would have. In the case of a curve controlling a [PathFollow3D], this tilt is an offset over the natural tilt the [PathFollow3D] calculates.  
         */
        set_point_tilt(idx: int64, tilt: float64): void
        
        /** Returns the tilt angle in radians for the point [param idx]. If the index is out of bounds, the function sends an error to the console, and returns `0`. */
        get_point_tilt(idx: int64): float64
        
        /** Sets the position of the control point leading to the vertex [param idx]. If the index is out of bounds, the function sends an error to the console. The position is relative to the vertex. */
        set_point_in(idx: int64, position: Vector3): void
        
        /** Returns the position of the control point leading to the vertex [param idx]. The returned position is relative to the vertex [param idx]. If the index is out of bounds, the function sends an error to the console, and returns `(0, 0, 0)`. */
        get_point_in(idx: int64): Vector3
        
        /** Sets the position of the control point leading out of the vertex [param idx]. If the index is out of bounds, the function sends an error to the console. The position is relative to the vertex. */
        set_point_out(idx: int64, position: Vector3): void
        
        /** Returns the position of the control point leading out of the vertex [param idx]. The returned position is relative to the vertex [param idx]. If the index is out of bounds, the function sends an error to the console, and returns `(0, 0, 0)`. */
        get_point_out(idx: int64): Vector3
        
        /** Deletes the point [param idx] from the curve. Sends an error to the console if [param idx] is out of bounds. */
        remove_point(idx: int64): void
        
        /** Removes all points from the curve. */
        clear_points(): void
        
        /** Returns the position between the vertex [param idx] and the vertex `idx + 1`, where [param t] controls if the point is the first vertex (`t = 0.0`), the last vertex (`t = 1.0`), or in between. Values of [param t] outside the range (`0.0 >= t <=1`) give strange, but predictable results.  
         *  If [param idx] is out of bounds it is truncated to the first or last vertex, and [param t] is ignored. If the curve has no points, the function sends an error to the console, and returns `(0, 0, 0)`.  
         */
        sample(idx: int64, t: float64): Vector3
        
        /** Returns the position at the vertex [param fofs]. It calls [method sample] using the integer part of [param fofs] as `idx`, and its fractional part as `t`. */
        samplef(fofs: float64): Vector3
        
        /** Returns the total length of the curve, based on the cached points. Given enough density (see [member bake_interval]), it should be approximate enough. */
        get_baked_length(): float64
        
        /** Returns a point within the curve at position [param offset], where [param offset] is measured as a distance in 3D units along the curve. To do that, it finds the two cached points where the [param offset] lies between, then interpolates the values. This interpolation is cubic if [param cubic] is set to `true`, or linear if set to `false`.  
         *  Cubic interpolation tends to follow the curves better, but linear is faster (and often, precise enough).  
         */
        sample_baked(offset: float64 = 0, cubic: boolean = false): Vector3
        
        /** Returns a [Transform3D] with `origin` as point position, `basis.x` as sideway vector, `basis.y` as up vector, `basis.z` as forward vector. When the curve length is 0, there is no reasonable way to calculate the rotation, all vectors aligned with global space axes. See also [method sample_baked]. */
        sample_baked_with_rotation(offset: float64 = 0, cubic: boolean = false, apply_tilt: boolean = false): Transform3D
        
        /** Returns an up vector within the curve at position [param offset], where [param offset] is measured as a distance in 3D units along the curve. To do that, it finds the two cached up vectors where the [param offset] lies between, then interpolates the values. If [param apply_tilt] is `true`, an interpolated tilt is applied to the interpolated up vector.  
         *  If the curve has no up vectors, the function sends an error to the console, and returns `(0, 1, 0)`.  
         */
        sample_baked_up_vector(offset: float64, apply_tilt: boolean = false): Vector3
        
        /** Returns the cache of points as a [PackedVector3Array]. */
        get_baked_points(): PackedVector3Array
        
        /** Returns the cache of tilts as a [PackedFloat32Array]. */
        get_baked_tilts(): PackedFloat32Array
        
        /** Returns the cache of up vectors as a [PackedVector3Array].  
         *  If [member up_vector_enabled] is `false`, the cache will be empty.  
         */
        get_baked_up_vectors(): PackedVector3Array
        
        /** Returns the closest point on baked segments (in curve's local space) to [param to_point].  
         *  [param to_point] must be in this curve's local space.  
         */
        get_closest_point(to_point: Vector3): Vector3
        
        /** Returns the closest offset to [param to_point]. This offset is meant to be used in [method sample_baked] or [method sample_baked_up_vector].  
         *  [param to_point] must be in this curve's local space.  
         */
        get_closest_offset(to_point: Vector3): float64
        
        /** Returns a list of points along the curve, with a curvature controlled point density. That is, the curvier parts will have more points than the straighter parts.  
         *  This approximation makes straight segments between each point, then subdivides those segments until the resulting shape is similar enough.  
         *  [param max_stages] controls how many subdivisions a curve segment may face before it is considered approximate enough. Each subdivision splits the segment in half, so the default 5 stages may mean up to 32 subdivisions per curve segment. Increase with care!  
         *  [param tolerance_degrees] controls how many degrees the midpoint of a segment may deviate from the real curve, before the segment has to be subdivided.  
         */
        tessellate(max_stages: int64 = 5, tolerance_degrees: float64 = 4): PackedVector3Array
        
        /** Returns a list of points along the curve, with almost uniform density. [param max_stages] controls how many subdivisions a curve segment may face before it is considered approximate enough. Each subdivision splits the segment in half, so the default 5 stages may mean up to 32 subdivisions per curve segment. Increase with care!  
         *  [param tolerance_length] controls the maximal distance between two neighboring points, before the segment has to be subdivided.  
         */
        tessellate_even_length(max_stages: int64 = 5, tolerance_length: float64 = 0.2): PackedVector3Array
        
        /** If `true`, and the curve has more than 2 control points, the last point and the first one will be connected in a loop. */
        get closed(): boolean
        set closed(value: boolean)
        
        /** The distance in meters between two adjacent cached points. Changing it forces the cache to be recomputed the next time the [method get_baked_points] or [method get_baked_length] function is called. The smaller the distance, the more points in the cache and the more memory it will consume, so use with care. */
        get bake_interval(): float64
        set bake_interval(value: float64)
        get _data(): int64
        set _data(value: int64)
        
        /** The number of points describing the curve. */
        get point_count(): any /*Points,point_*/
        set point_count(value: any /*Points,point_*/)
        
        /** If `true`, the curve will bake up vectors used for orientation. This is used when [member PathFollow3D.rotation_mode] is set to [constant PathFollow3D.ROTATION_ORIENTED]. Changing it forces the cache to be recomputed. */
        get up_vector_enabled(): boolean
        set up_vector_enabled(value: boolean)
    }
    class CurveEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    class CurvePreviewGenerator extends EditorResourcePreviewGenerator {
        constructor(identifier?: any)
    }
    namespace CurveTexture {
        enum TextureMode {
            /** Store the curve equally across the red, green and blue channels. This uses more video memory, but is more compatible with shaders that only read the green and blue values. */
            TEXTURE_MODE_RGB = 0,
            
            /** Store the curve only in the red channel. This saves video memory, but some custom shaders may not be able to work with this. */
            TEXTURE_MODE_RED = 1,
        }
    }
    /** A 1D texture where pixel brightness corresponds to points on a curve.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_curvetexture.html  
     */
    class CurveTexture extends Texture2D {
        constructor(identifier?: any)
        /** The width of the texture (in pixels). Higher values make it possible to represent high-frequency data better (such as sudden direction changes), at the cost of increased generation time and memory usage. */
        get width(): int64
        set width(value: int64)
        
        /** The format the texture should be generated with. When passing a CurveTexture as an input to a [Shader], this may need to be adjusted. */
        get texture_mode(): int64
        set texture_mode(value: int64)
        
        /** The [Curve] that is rendered onto the texture. Should be a unit [Curve]. */
        get curve(): Curve
        set curve(value: Curve)
    }
    /** A 1D texture where the red, green, and blue color channels correspond to points on 3 curves.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_curvexyztexture.html  
     */
    class CurveXYZTexture extends Texture2D {
        constructor(identifier?: any)
        /** The width of the texture (in pixels). Higher values make it possible to represent high-frequency data better (such as sudden direction changes), at the cost of increased generation time and memory usage. */
        get width(): int64
        set width(value: int64)
        
        /** The [Curve] that is rendered onto the texture's red channel. Should be a unit [Curve]. */
        get curve_x(): Curve
        set curve_x(value: Curve)
        
        /** The [Curve] that is rendered onto the texture's green channel. Should be a unit [Curve]. */
        get curve_y(): Curve
        set curve_y(value: Curve)
        
        /** The [Curve] that is rendered onto the texture's blue channel. Should be a unit [Curve]. */
        get curve_z(): Curve
        set curve_z(value: Curve)
    }
    /** Class representing a cylindrical [PrimitiveMesh].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_cylindermesh.html  
     */
    class CylinderMesh extends PrimitiveMesh {
        constructor(identifier?: any)
        /** Top radius of the cylinder. If set to `0.0`, the top faces will not be generated, resulting in a conic shape. See also [member cap_top]. */
        get top_radius(): float64
        set top_radius(value: float64)
        
        /** Bottom radius of the cylinder. If set to `0.0`, the bottom faces will not be generated, resulting in a conic shape. See also [member cap_bottom]. */
        get bottom_radius(): float64
        set bottom_radius(value: float64)
        
        /** Full height of the cylinder. */
        get height(): float64
        set height(value: float64)
        
        /** Number of radial segments on the cylinder. Higher values result in a more detailed cylinder/cone at the cost of performance. */
        get radial_segments(): int64
        set radial_segments(value: int64)
        
        /** Number of edge rings along the height of the cylinder. Changing [member rings] does not have any visual impact unless a shader or procedural mesh tool is used to alter the vertex data. Higher values result in more subdivisions, which can be used to create smoother-looking effects with shaders or procedural mesh tools (at the cost of performance). When not altering the vertex data using a shader or procedural mesh tool, [member rings] should be kept to its default value. */
        get rings(): int64
        set rings(value: int64)
        
        /** If `true`, generates a cap at the top of the cylinder. This can be set to `false` to speed up generation and rendering when the cap is never seen by the camera. See also [member top_radius].  
         *      
         *  **Note:** If [member top_radius] is `0.0`, cap generation is always skipped even if [member cap_top] is `true`.  
         */
        get cap_top(): boolean
        set cap_top(value: boolean)
        
        /** If `true`, generates a cap at the bottom of the cylinder. This can be set to `false` to speed up generation and rendering when the cap is never seen by the camera. See also [member bottom_radius].  
         *      
         *  **Note:** If [member bottom_radius] is `0.0`, cap generation is always skipped even if [member cap_bottom] is `true`.  
         */
        get cap_bottom(): boolean
        set cap_bottom(value: boolean)
    }
    /** A 3D cylinder shape used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_cylindershape3d.html  
     */
    class CylinderShape3D extends Shape3D {
        constructor(identifier?: any)
        /** The cylinder's height. */
        get height(): float64
        set height(value: float64)
        
        /** The cylinder's radius. */
        get radius(): float64
        set radius(value: float64)
    }
    /** Helper class to implement a DTLS server.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_dtlsserver.html  
     */
    class DTLSServer extends RefCounted {
        constructor(identifier?: any)
        /** Setup the DTLS server to use the given [param server_options]. See [method TLSOptions.server]. */
        setup(server_options: TLSOptions): GError
        
        /** Try to initiate the DTLS handshake with the given [param udp_peer] which must be already connected (see [method PacketPeerUDP.connect_to_host]).  
         *      
         *  **Note:** You must check that the state of the return PacketPeerUDP is [constant PacketPeerDTLS.STATUS_HANDSHAKING], as it is normal that 50% of the new connections will be invalid due to cookie exchange.  
         */
        take_connection(udp_peer: PacketPeerUDP): PacketPeerDTLS
    }
    /** A physics joint that connects two 2D physics bodies with a spring-like force.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_dampedspringjoint2d.html  
     */
    class DampedSpringJoint2D<Map extends Record<string, Node> = Record<string, Node>> extends Joint2D<Map> {
        constructor(identifier?: any)
        /** The spring joint's maximum length. The two attached bodies cannot stretch it past this value. */
        get length(): float64
        set length(value: float64)
        
        /** When the bodies attached to the spring joint move they stretch or squash it. The joint always tries to resize towards this length. */
        get rest_length(): float64
        set rest_length(value: float64)
        
        /** The higher the value, the less the bodies attached to the joint will deform it. The joint applies an opposing force to the bodies, the product of the stiffness multiplied by the size difference from its resting length. */
        get stiffness(): float64
        set stiffness(value: float64)
        
        /** The spring joint's damping ratio. A value between `0` and `1`. When the two bodies move into different directions the system tries to align them to the spring axis again. A high [member damping] value forces the attached bodies to align faster. */
        get damping(): float64
        set damping(value: float64)
    }
    class DebugAdapterParser extends Object {
        constructor(identifier?: any)
        req_initialize(params: GDictionary): GDictionary
        req_disconnect(params: GDictionary): GDictionary
        req_launch(params: GDictionary): GDictionary
        req_attach(params: GDictionary): GDictionary
        req_restart(params: GDictionary): GDictionary
        req_terminate(params: GDictionary): GDictionary
        req_configurationDone(params: GDictionary): GDictionary
        req_pause(params: GDictionary): GDictionary
        req_continue(params: GDictionary): GDictionary
        req_threads(params: GDictionary): GDictionary
        req_stackTrace(params: GDictionary): GDictionary
        req_setBreakpoints(params: GDictionary): GDictionary
        req_breakpointLocations(params: GDictionary): GDictionary
        req_scopes(params: GDictionary): GDictionary
        req_variables(params: GDictionary): GDictionary
        req_next(params: GDictionary): GDictionary
        req_stepIn(params: GDictionary): GDictionary
        req_evaluate(params: GDictionary): GDictionary
        ["req_godot/put_msg"]: (params: GDictionary) => GDictionary
    }
    class DebugAdapterServer<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    class DebuggerEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    namespace Decal {
        enum DecalTexture {
            /** [Texture2D] corresponding to [member texture_albedo]. */
            TEXTURE_ALBEDO = 0,
            
            /** [Texture2D] corresponding to [member texture_normal]. */
            TEXTURE_NORMAL = 1,
            
            /** [Texture2D] corresponding to [member texture_orm]. */
            TEXTURE_ORM = 2,
            
            /** [Texture2D] corresponding to [member texture_emission]. */
            TEXTURE_EMISSION = 3,
            
            /** Max size of [enum DecalTexture] enum. */
            TEXTURE_MAX = 4,
        }
    }
    /** Node that projects a texture onto a [MeshInstance3D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_decal.html  
     */
    class Decal<Map extends Record<string, Node> = Record<string, Node>> extends VisualInstance3D<Map> {
        constructor(identifier?: any)
        /** Sets the [Texture2D] associated with the specified [enum DecalTexture]. This is a convenience method, in most cases you should access the texture directly.  
         *  For example, instead of `$Decal.set_texture(Decal.TEXTURE_ALBEDO, albedo_tex)`, use `$Decal.texture_albedo = albedo_tex`.  
         *  One case where this is better than accessing the texture directly is when you want to copy one Decal's textures to another. For example:  
         *    
         */
        set_texture(type: Decal.DecalTexture, texture: Texture2D): void
        
        /** Returns the [Texture2D] associated with the specified [enum DecalTexture]. This is a convenience method, in most cases you should access the texture directly.  
         *  For example, instead of `albedo_tex = $Decal.get_texture(Decal.TEXTURE_ALBEDO)`, use `albedo_tex = $Decal.texture_albedo`.  
         *  One case where this is better than accessing the texture directly is when you want to copy one Decal's textures to another. For example:  
         *    
         */
        get_texture(type: Decal.DecalTexture): Texture2D
        
        /** Sets the size of the [AABB] used by the decal. All dimensions must be set to a value greater than zero (they will be clamped to `0.001` if this is not the case). The AABB goes from `-size/2` to `size/2`.  
         *      
         *  **Note:** To improve culling efficiency of "hard surface" decals, set their [member upper_fade] and [member lower_fade] to `0.0` and set the Y component of the [member size] as low as possible. This will reduce the decals' AABB size without affecting their appearance.  
         */
        get size(): Vector3
        set size(value: Vector3)
        
        /** [Texture2D] with the base [Color] of the Decal. Either this or the [member texture_emission] must be set for the Decal to be visible. Use the alpha channel like a mask to smoothly blend the edges of the decal with the underlying object.  
         *      
         *  **Note:** Unlike [BaseMaterial3D] whose filter mode can be adjusted on a per-material basis, the filter mode for [Decal] textures is set globally with [member ProjectSettings.rendering/textures/decals/filter].  
         */
        get texture_albedo(): Texture2D | any /*-AnimatedTexture*/ | any /*-AtlasTexture*/ | any /*-CameraTexture*/ | any /*-CanvasTexture*/ | any /*-MeshTexture*/ | any /*-Texture2DRD*/ | any /*-ViewportTexture*/
        set texture_albedo(value: Texture2D | any /*-AnimatedTexture*/ | any /*-AtlasTexture*/ | any /*-CameraTexture*/ | any /*-CanvasTexture*/ | any /*-MeshTexture*/ | any /*-Texture2DRD*/ | any /*-ViewportTexture*/)
        
        /** [Texture2D] with the per-pixel normal map for the decal. Use this to add extra detail to decals.  
         *      
         *  **Note:** Unlike [BaseMaterial3D] whose filter mode can be adjusted on a per-material basis, the filter mode for [Decal] textures is set globally with [member ProjectSettings.rendering/textures/decals/filter].  
         *      
         *  **Note:** Setting this texture alone will not result in a visible decal, as [member texture_albedo] must also be set. To create a normal-only decal, load an albedo texture into [member texture_albedo] and set [member albedo_mix] to `0.0`. The albedo texture's alpha channel will be used to determine where the underlying surface's normal map should be overridden (and its intensity).  
         */
        get texture_normal(): Texture2D | any /*-AnimatedTexture*/ | any /*-AtlasTexture*/ | any /*-CameraTexture*/ | any /*-CanvasTexture*/ | any /*-MeshTexture*/ | any /*-Texture2DRD*/ | any /*-ViewportTexture*/
        set texture_normal(value: Texture2D | any /*-AnimatedTexture*/ | any /*-AtlasTexture*/ | any /*-CameraTexture*/ | any /*-CanvasTexture*/ | any /*-MeshTexture*/ | any /*-Texture2DRD*/ | any /*-ViewportTexture*/)
        
        /** [Texture2D] storing ambient occlusion, roughness, and metallic for the decal. Use this to add extra detail to decals.  
         *      
         *  **Note:** Unlike [BaseMaterial3D] whose filter mode can be adjusted on a per-material basis, the filter mode for [Decal] textures is set globally with [member ProjectSettings.rendering/textures/decals/filter].  
         *      
         *  **Note:** Setting this texture alone will not result in a visible decal, as [member texture_albedo] must also be set. To create an ORM-only decal, load an albedo texture into [member texture_albedo] and set [member albedo_mix] to `0.0`. The albedo texture's alpha channel will be used to determine where the underlying surface's ORM map should be overridden (and its intensity).  
         */
        get texture_orm(): Texture2D | any /*-AnimatedTexture*/ | any /*-AtlasTexture*/ | any /*-CameraTexture*/ | any /*-CanvasTexture*/ | any /*-MeshTexture*/ | any /*-Texture2DRD*/ | any /*-ViewportTexture*/
        set texture_orm(value: Texture2D | any /*-AnimatedTexture*/ | any /*-AtlasTexture*/ | any /*-CameraTexture*/ | any /*-CanvasTexture*/ | any /*-MeshTexture*/ | any /*-Texture2DRD*/ | any /*-ViewportTexture*/)
        
        /** [Texture2D] with the emission [Color] of the Decal. Either this or the [member texture_albedo] must be set for the Decal to be visible. Use the alpha channel like a mask to smoothly blend the edges of the decal with the underlying object.  
         *      
         *  **Note:** Unlike [BaseMaterial3D] whose filter mode can be adjusted on a per-material basis, the filter mode for [Decal] textures is set globally with [member ProjectSettings.rendering/textures/decals/filter].  
         */
        get texture_emission(): Texture2D | any /*-AnimatedTexture*/ | any /*-AtlasTexture*/ | any /*-CameraTexture*/ | any /*-CanvasTexture*/ | any /*-MeshTexture*/ | any /*-Texture2DRD*/ | any /*-ViewportTexture*/
        set texture_emission(value: Texture2D | any /*-AnimatedTexture*/ | any /*-AtlasTexture*/ | any /*-CameraTexture*/ | any /*-CanvasTexture*/ | any /*-MeshTexture*/ | any /*-Texture2DRD*/ | any /*-ViewportTexture*/)
        
        /** Energy multiplier for the emission texture. This will make the decal emit light at a higher or lower intensity, independently of the albedo color. See also [member modulate]. */
        get emission_energy(): float64
        set emission_energy(value: float64)
        
        /** Changes the [Color] of the Decal by multiplying the albedo and emission colors with this value. The alpha component is only taken into account when multiplying the albedo color, not the emission color. See also [member emission_energy] and [member albedo_mix] to change the emission and albedo intensity independently of each other. */
        get modulate(): Color
        set modulate(value: Color)
        
        /** Blends the albedo [Color] of the decal with albedo [Color] of the underlying mesh. This can be set to `0.0` to create a decal that only affects normal or ORM. In this case, an albedo texture is still required as its alpha channel will determine where the normal and ORM will be overridden. See also [member modulate]. */
        get albedo_mix(): float64
        set albedo_mix(value: float64)
        
        /** Fades the Decal if the angle between the Decal's [AABB] and the target surface becomes too large. A value of `0` projects the Decal regardless of angle, a value of `1` limits the Decal to surfaces that are nearly perpendicular.  
         *      
         *  **Note:** Setting [member normal_fade] to a value greater than `0.0` has a small performance cost due to the added normal angle computations.  
         */
        get normal_fade(): float64
        set normal_fade(value: float64)
        
        /** Sets the curve over which the decal will fade as the surface gets further from the center of the [AABB]. Only positive values are valid (negative values will be clamped to `0.0`). See also [member lower_fade]. */
        get upper_fade(): float64
        set upper_fade(value: float64)
        
        /** Sets the curve over which the decal will fade as the surface gets further from the center of the [AABB]. Only positive values are valid (negative values will be clamped to `0.0`). See also [member upper_fade]. */
        get lower_fade(): float64
        set lower_fade(value: float64)
        
        /** If `true`, decals will smoothly fade away when far from the active [Camera3D] starting at [member distance_fade_begin]. The Decal will fade out over [member distance_fade_begin] + [member distance_fade_length], after which it will be culled and not sent to the shader at all. Use this to reduce the number of active Decals in a scene and thus improve performance. */
        get distance_fade_enabled(): boolean
        set distance_fade_enabled(value: boolean)
        
        /** The distance from the camera at which the Decal begins to fade away (in 3D units). */
        get distance_fade_begin(): float64
        set distance_fade_begin(value: float64)
        
        /** The distance over which the Decal fades (in 3D units). The Decal becomes slowly more transparent over this distance and is completely invisible at the end. Higher values result in a smoother fade-out transition, which is more suited when the camera moves fast. */
        get distance_fade_length(): float64
        set distance_fade_length(value: float64)
        
        /** Specifies which [member VisualInstance3D.layers] this decal will project on. By default, Decals affect all layers. This is used so you can specify which types of objects receive the Decal and which do not. This is especially useful so you can ensure that dynamic objects don't accidentally receive a Decal intended for the terrain under them. */
        get cull_mask(): int64
        set cull_mask(value: int64)
    }
    class DecalGizmoPlugin extends EditorNode3DGizmoPlugin {
        constructor(identifier?: any)
    }
    class DefaultThemeEditorPreview<Map extends Record<string, Node> = Record<string, Node>> extends ThemeEditorPreview<Map> {
        constructor(identifier?: any)
    }
    class DependencyEditor<Map extends Record<string, Node> = Record<string, Node>> extends AcceptDialog<Map> {
        constructor(identifier?: any)
    }
    class DependencyEditorOwners<Map extends Record<string, Node> = Record<string, Node>> extends AcceptDialog<Map> {
        constructor(identifier?: any)
    }
    class DependencyErrorDialog<Map extends Record<string, Node> = Record<string, Node>> extends ConfirmationDialog<Map> {
        constructor(identifier?: any)
    }
    class DependencyRemoveDialog<Map extends Record<string, Node> = Record<string, Node>> extends ConfirmationDialog<Map> {
        constructor(identifier?: any)
        readonly resource_removed: Signal1<Object>
        readonly file_removed: Signal1<string>
        readonly folder_removed: Signal1<string>
    }
    /** Provides methods for managing directories and their content.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_diraccess.html  
     */
    class DirAccess extends RefCounted {
        constructor(identifier?: any)
        /** Creates a new [DirAccess] object and opens an existing directory of the filesystem. The [param path] argument can be within the project tree (`res://folder`), the user directory (`user://folder`) or an absolute path of the user filesystem (e.g. `/tmp/folder` or `C:\tmp\folder`).  
         *  Returns `null` if opening the directory failed. You can use [method get_open_error] to check the error that occurred.  
         */
        static open(path: string): DirAccess
        
        /** Returns the result of the last [method open] call in the current thread. */
        static get_open_error(): GError
        
        /** Creates a temporary directory. This directory will be freed when the returned [DirAccess] is freed.  
         *  If [param prefix] is not empty, it will be prefixed to the directory name, separated by a `-`.  
         *  If [param keep] is `true`, the directory is not deleted when the returned [DirAccess] is freed.  
         *  Returns `null` if opening the directory failed. You can use [method get_open_error] to check the error that occurred.  
         */
        static create_temp(prefix: string = '', keep: boolean = false): DirAccess
        
        /** Initializes the stream used to list all files and directories using the [method get_next] function, closing the currently opened stream if needed. Once the stream has been processed, it should typically be closed with [method list_dir_end].  
         *  Affected by [member include_hidden] and [member include_navigational].  
         *      
         *  **Note:** The order of files and directories returned by this method is not deterministic, and can vary between operating systems. If you want a list of all files or folders sorted alphabetically, use [method get_files] or [method get_directories].  
         */
        list_dir_begin(): GError
        
        /** Returns the next element (file or directory) in the current directory.  
         *  The name of the file or directory is returned (and not its full path). Once the stream has been fully processed, the method returns an empty [String] and closes the stream automatically (i.e. [method list_dir_end] would not be mandatory in such a case).  
         */
        get_next(): string
        
        /** Returns whether the current item processed with the last [method get_next] call is a directory (`.` and `..` are considered directories). */
        current_is_dir(): boolean
        
        /** Closes the current stream opened with [method list_dir_begin] (whether it has been fully processed with [method get_next] does not matter). */
        list_dir_end(): void
        
        /** Returns a [PackedStringArray] containing filenames of the directory contents, excluding directories. The array is sorted alphabetically.  
         *  Affected by [member include_hidden].  
         *      
         *  **Note:** When used on a `res://` path in an exported project, only the files actually included in the PCK at the given folder level are returned. In practice, this means that since imported resources are stored in a top-level `.godot/` folder, only paths to `*.gd` and `*.import` files are returned (plus a few files such as `project.godot` or `project.binary` and the project icon). In an exported project, the list of returned files will also vary depending on whether [member ProjectSettings.editor/export/convert_text_resources_to_binary] is `true`.  
         */
        get_files(): PackedStringArray
        
        /** Returns a [PackedStringArray] containing filenames of the directory contents, excluding directories, at the given [param path]. The array is sorted alphabetically.  
         *  Use [method get_files] if you want more control of what gets included.  
         *      
         *  **Note:** When used on a `res://` path in an exported project, only the files included in the PCK at the given folder level are returned. In practice, this means that since imported resources are stored in a top-level `.godot/` folder, only paths to `.gd` and `.import` files are returned (plus a few other files, such as `project.godot` or `project.binary` and the project icon). In an exported project, the list of returned files will also vary depending on [member ProjectSettings.editor/export/convert_text_resources_to_binary].  
         */
        static get_files_at(path: string): PackedStringArray
        
        /** Returns a [PackedStringArray] containing filenames of the directory contents, excluding files. The array is sorted alphabetically.  
         *  Affected by [member include_hidden] and [member include_navigational].  
         *      
         *  **Note:** The returned directories in the editor and after exporting in the `res://` directory may differ as some files are converted to engine-specific formats when exported.  
         */
        get_directories(): PackedStringArray
        
        /** Returns a [PackedStringArray] containing filenames of the directory contents, excluding files, at the given [param path]. The array is sorted alphabetically.  
         *  Use [method get_directories] if you want more control of what gets included.  
         *      
         *  **Note:** The returned directories in the editor and after exporting in the `res://` directory may differ as some files are converted to engine-specific formats when exported.  
         */
        static get_directories_at(path: string): PackedStringArray
        
        /** On Windows, returns the number of drives (partitions) mounted on the current filesystem.  
         *  On macOS, returns the number of mounted volumes.  
         *  On Linux, returns the number of mounted volumes and GTK 3 bookmarks.  
         *  On other platforms, the method returns 0.  
         */
        static get_drive_count(): int64
        
        /** On Windows, returns the name of the drive (partition) passed as an argument (e.g. `C:`).  
         *  On macOS, returns the path to the mounted volume passed as an argument.  
         *  On Linux, returns the path to the mounted volume or GTK 3 bookmark passed as an argument.  
         *  On other platforms, or if the requested drive does not exist, the method returns an empty String.  
         */
        static get_drive_name(idx: int64): string
        
        /** Returns the currently opened directory's drive index. See [method get_drive_name] to convert returned index to the name of the drive. */
        get_current_drive(): int64
        
        /** Changes the currently opened directory to the one passed as an argument. The argument can be relative to the current directory (e.g. `newdir` or `../newdir`), or an absolute path (e.g. `/tmp/newdir` or `res://somedir/newdir`).  
         *  Returns one of the [enum Error] code constants ([constant OK] on success).  
         *      
         *  **Note:** The new directory must be within the same scope, e.g. when you had opened a directory inside `res://`, you can't change it to `user://` directory. If you need to open a directory in another access scope, use [method open] to create a new instance instead.  
         */
        change_dir(to_dir: string): GError
        
        /** Returns the absolute path to the currently opened directory (e.g. `res://folder` or `C:\tmp\folder`). */
        get_current_dir(include_drive: boolean = true): string
        
        /** Creates a directory. The argument can be relative to the current directory, or an absolute path. The target directory should be placed in an already existing directory (to create the full path recursively, see [method make_dir_recursive]).  
         *  Returns one of the [enum Error] code constants ([constant OK] on success).  
         */
        make_dir(path: string): GError
        
        /** Static version of [method make_dir]. Supports only absolute paths. */
        static make_dir_absolute(path: string): GError
        
        /** Creates a target directory and all necessary intermediate directories in its path, by calling [method make_dir] recursively. The argument can be relative to the current directory, or an absolute path.  
         *  Returns one of the [enum Error] code constants ([constant OK] on success).  
         */
        make_dir_recursive(path: string): GError
        
        /** Static version of [method make_dir_recursive]. Supports only absolute paths. */
        static make_dir_recursive_absolute(path: string): GError
        
        /** Returns whether the target file exists. The argument can be relative to the current directory, or an absolute path.  
         *  For a static equivalent, use [method FileAccess.file_exists].  
         *      
         *  **Note:** Many resources types are imported (e.g. textures or sound files), and their source asset will not be included in the exported game, as only the imported version is used. See [method ResourceLoader.exists] for an alternative approach that takes resource remapping into account.  
         */
        file_exists(path: string): boolean
        
        /** Returns whether the target directory exists. The argument can be relative to the current directory, or an absolute path.  
         *      
         *  **Note:** The returned [bool] in the editor and after exporting when used on a path in the `res://` directory may be different. Some files are converted to engine-specific formats when exported, potentially changing the directory structure.  
         */
        dir_exists(path: string): boolean
        
        /** Static version of [method dir_exists]. Supports only absolute paths.  
         *      
         *  **Note:** The returned [bool] in the editor and after exporting when used on a path in the `res://` directory may be different. Some files are converted to engine-specific formats when exported, potentially changing the directory structure.  
         */
        static dir_exists_absolute(path: string): boolean
        
        /** Returns the available space on the current directory's disk, in bytes. Returns `0` if the platform-specific method to query the available space fails. */
        get_space_left(): int64
        
        /** Copies the [param from] file to the [param to] destination. Both arguments should be paths to files, either relative or absolute. If the destination file exists and is not access-protected, it will be overwritten.  
         *  If [param chmod_flags] is different than `-1`, the Unix permissions for the destination path will be set to the provided value, if available on the current operating system.  
         *  Returns one of the [enum Error] code constants ([constant OK] on success).  
         */
        copy(from: string, to: string, chmod_flags: int64 = -1): GError
        
        /** Static version of [method copy]. Supports only absolute paths. */
        static copy_absolute(from: string, to: string, chmod_flags: int64 = -1): GError
        
        /** Renames (move) the [param from] file or directory to the [param to] destination. Both arguments should be paths to files or directories, either relative or absolute. If the destination file or directory exists and is not access-protected, it will be overwritten.  
         *  Returns one of the [enum Error] code constants ([constant OK] on success).  
         */
        rename(from: string, to: string): GError
        
        /** Static version of [method rename]. Supports only absolute paths. */
        static rename_absolute(from: string, to: string): GError
        
        /** Permanently deletes the target file or an empty directory. The argument can be relative to the current directory, or an absolute path. If the target directory is not empty, the operation will fail.  
         *  If you don't want to delete the file/directory permanently, use [method OS.move_to_trash] instead.  
         *  Returns one of the [enum Error] code constants ([constant OK] on success).  
         */
        remove(path: string): GError
        
        /** Static version of [method remove]. Supports only absolute paths. */
        static remove_absolute(path: string): GError
        
        /** Returns `true` if the file or directory is a symbolic link, directory junction, or other reparse point.  
         *      
         *  **Note:** This method is implemented on macOS, Linux, and Windows.  
         */
        is_link(path: string): boolean
        
        /** Returns target of the symbolic link.  
         *      
         *  **Note:** This method is implemented on macOS, Linux, and Windows.  
         */
        read_link(path: string): string
        
        /** Creates symbolic link between files or folders.  
         *      
         *  **Note:** On Windows, this method works only if the application is running with elevated privileges or Developer Mode is enabled.  
         *      
         *  **Note:** This method is implemented on macOS, Linux, and Windows.  
         */
        create_link(source: string, target: string): GError
        
        /** Returns `true` if the directory is a macOS bundle.  
         *      
         *  **Note:** This method is implemented on macOS.  
         */
        is_bundle(path: string): boolean
        
        /** Returns `true` if the file system or directory use case sensitive file names.  
         *      
         *  **Note:** This method is implemented on macOS, Linux (for EXT4 and F2FS filesystems only) and Windows. On other platforms, it always returns `true`.  
         */
        is_case_sensitive(path: string): boolean
        
        /** If `true`, `.` and `..` are included when navigating the directory.  
         *  Affects [method list_dir_begin] and [method get_directories].  
         */
        get include_navigational(): boolean
        set include_navigational(value: boolean)
        
        /** If `true`, hidden files are included when navigating the directory.  
         *  Affects [method list_dir_begin], [method get_directories] and [method get_files].  
         */
        get include_hidden(): boolean
        set include_hidden(value: boolean)
    }
    /** Directional 2D light from a distance.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_directionallight2d.html  
     */
    class DirectionalLight2D<Map extends Record<string, Node> = Record<string, Node>> extends Light2D<Map> {
        constructor(identifier?: any)
        /** The height of the light. Used with 2D normal mapping. Ranges from 0 (parallel to the plane) to 1 (perpendicular to the plane). */
        get height(): float64
        set height(value: float64)
        
        /** The maximum distance from the camera center objects can be before their shadows are culled (in pixels). Decreasing this value can prevent objects located outside the camera from casting shadows (while also improving performance). [member Camera2D.zoom] is not taken into account by [member max_distance], which means that at higher zoom values, shadows will appear to fade out sooner when zooming onto a given point. */
        get max_distance(): float64
        set max_distance(value: float64)
    }
    namespace DirectionalLight3D {
        enum ShadowMode {
            /** Renders the entire scene's shadow map from an orthogonal point of view. This is the fastest directional shadow mode. May result in blurrier shadows on close objects. */
            SHADOW_ORTHOGONAL = 0,
            
            /** Splits the view frustum in 2 areas, each with its own shadow map. This shadow mode is a compromise between [constant SHADOW_ORTHOGONAL] and [constant SHADOW_PARALLEL_4_SPLITS] in terms of performance. */
            SHADOW_PARALLEL_2_SPLITS = 1,
            
            /** Splits the view frustum in 4 areas, each with its own shadow map. This is the slowest directional shadow mode. */
            SHADOW_PARALLEL_4_SPLITS = 2,
        }
        enum SkyMode {
            /** Makes the light visible in both scene lighting and sky rendering. */
            SKY_MODE_LIGHT_AND_SKY = 0,
            
            /** Makes the light visible in scene lighting only (including direct lighting and global illumination). When using this mode, the light will not be visible from sky shaders. */
            SKY_MODE_LIGHT_ONLY = 1,
            
            /** Makes the light visible to sky shaders only. When using this mode the light will not cast light into the scene (either through direct lighting or through global illumination), but can be accessed through sky shaders. This can be useful, for example, when you want to control sky effects without illuminating the scene (during a night cycle, for example). */
            SKY_MODE_SKY_ONLY = 2,
        }
    }
    /** Directional light from a distance, as from the Sun.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_directionallight3d.html  
     */
    class DirectionalLight3D<Map extends Record<string, Node> = Record<string, Node>> extends Light3D<Map> {
        constructor(identifier?: any)
        /** The light's shadow rendering algorithm. See [enum ShadowMode]. */
        get directional_shadow_mode(): int64
        set directional_shadow_mode(value: int64)
        
        /** The distance from camera to shadow split 1. Relative to [member directional_shadow_max_distance]. Only used when [member directional_shadow_mode] is [constant SHADOW_PARALLEL_2_SPLITS] or [constant SHADOW_PARALLEL_4_SPLITS]. */
        get directional_shadow_split_1(): float64
        set directional_shadow_split_1(value: float64)
        
        /** The distance from shadow split 1 to split 2. Relative to [member directional_shadow_max_distance]. Only used when [member directional_shadow_mode] is [constant SHADOW_PARALLEL_4_SPLITS]. */
        get directional_shadow_split_2(): float64
        set directional_shadow_split_2(value: float64)
        
        /** The distance from shadow split 2 to split 3. Relative to [member directional_shadow_max_distance]. Only used when [member directional_shadow_mode] is [constant SHADOW_PARALLEL_4_SPLITS]. */
        get directional_shadow_split_3(): float64
        set directional_shadow_split_3(value: float64)
        
        /** If `true`, shadow detail is sacrificed in exchange for smoother transitions between splits. Enabling shadow blend splitting also has a moderate performance cost. This is ignored when [member directional_shadow_mode] is [constant SHADOW_ORTHOGONAL]. */
        get directional_shadow_blend_splits(): boolean
        set directional_shadow_blend_splits(value: boolean)
        
        /** Proportion of [member directional_shadow_max_distance] at which point the shadow starts to fade. At [member directional_shadow_max_distance], the shadow will disappear. The default value is a balance between smooth fading and distant shadow visibility. If the camera moves fast and the [member directional_shadow_max_distance] is low, consider lowering [member directional_shadow_fade_start] below `0.8` to make shadow transitions less noticeable. On the other hand, if you tuned [member directional_shadow_max_distance] to cover the entire scene, you can set [member directional_shadow_fade_start] to `1.0` to prevent the shadow from fading in the distance (it will suddenly cut off instead). */
        get directional_shadow_fade_start(): float64
        set directional_shadow_fade_start(value: float64)
        
        /** The maximum distance for shadow splits. Increasing this value will make directional shadows visible from further away, at the cost of lower overall shadow detail and performance (since more objects need to be included in the directional shadow rendering). */
        get directional_shadow_max_distance(): float64
        set directional_shadow_max_distance(value: float64)
        
        /** Sets the size of the directional shadow pancake. The pancake offsets the start of the shadow's camera frustum to provide a higher effective depth resolution for the shadow. However, a high pancake size can cause artifacts in the shadows of large objects that are close to the edge of the frustum. Reducing the pancake size can help. Setting the size to `0` turns off the pancaking effect. */
        get directional_shadow_pancake_size(): float64
        set directional_shadow_pancake_size(value: float64)
        
        /** Set whether this [DirectionalLight3D] is visible in the sky, in the scene, or both in the sky and in the scene. See [enum SkyMode] for options. */
        get sky_mode(): int64
        set sky_mode(value: int64)
    }
    class DirectoryCreateDialog<Map extends Record<string, Node> = Record<string, Node>> extends ConfirmationDialog<Map> {
        constructor(identifier?: any)
    }
    class DockContextPopup<Map extends Record<string, Node> = Record<string, Node>> extends PopupPanel<Map> {
        constructor(identifier?: any)
    }
    class DockSplitContainer<Map extends Record<string, Node> = Record<string, Node>> extends SplitContainer<Map> {
        constructor(identifier?: any)
    }
    class DynamicFontImportSettingsData extends RefCounted {
        constructor(identifier?: any)
    }
    class DynamicFontImportSettingsDialog<Map extends Record<string, Node> = Record<string, Node>> extends ConfirmationDialog<Map> {
        constructor(identifier?: any)
    }
    namespace ENetConnection {
        enum CompressionMode {
            /** No compression. This uses the most bandwidth, but has the upside of requiring the fewest CPU resources. This option may also be used to make network debugging using tools like Wireshark easier. */
            COMPRESS_NONE = 0,
            
            /** ENet's built-in range encoding. Works well on small packets, but is not the most efficient algorithm on packets larger than 4 KB. */
            COMPRESS_RANGE_CODER = 1,
            
            /** [url=https://fastlz.org/]FastLZ[/url] compression. This option uses less CPU resources compared to [constant COMPRESS_ZLIB], at the expense of using more bandwidth. */
            COMPRESS_FASTLZ = 2,
            
            /** [url=https://www.zlib.net/]Zlib[/url] compression. This option uses less bandwidth compared to [constant COMPRESS_FASTLZ], at the expense of using more CPU resources. */
            COMPRESS_ZLIB = 3,
            
            /** [url=https://facebook.github.io/zstd/]Zstandard[/url] compression. Note that this algorithm is not very efficient on packets smaller than 4 KB. Therefore, it's recommended to use other compression algorithms in most cases. */
            COMPRESS_ZSTD = 4,
        }
        enum EventType {
            /** An error occurred during [method service]. You will likely need to [method destroy] the host and recreate it. */
            EVENT_ERROR = -1,
            
            /** No event occurred within the specified time limit. */
            EVENT_NONE = 0,
            
            /** A connection request initiated by enet_host_connect has completed. The array will contain the peer which successfully connected. */
            EVENT_CONNECT = 1,
            
            /** A peer has disconnected. This event is generated on a successful completion of a disconnect initiated by [method ENetPacketPeer.peer_disconnect], if a peer has timed out, or if a connection request initialized by [method connect_to_host] has timed out. The array will contain the peer which disconnected. The data field contains user supplied data describing the disconnection, or 0, if none is available. */
            EVENT_DISCONNECT = 2,
            
            /** A packet has been received from a peer. The array will contain the peer which sent the packet and the channel number upon which the packet was received. The received packet will be queued to the associated [ENetPacketPeer]. */
            EVENT_RECEIVE = 3,
        }
        enum HostStatistic {
            /** Total data sent. */
            HOST_TOTAL_SENT_DATA = 0,
            
            /** Total UDP packets sent. */
            HOST_TOTAL_SENT_PACKETS = 1,
            
            /** Total data received. */
            HOST_TOTAL_RECEIVED_DATA = 2,
            
            /** Total UDP packets received. */
            HOST_TOTAL_RECEIVED_PACKETS = 3,
        }
    }
    /** A wrapper class for an [url=http://enet.bespin.org/group__host.html]ENetHost[/url].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_enetconnection.html  
     */
    class ENetConnection extends RefCounted {
        constructor(identifier?: any)
        /** Creates an ENetHost bound to the given [param bind_address] and [param bind_port] that allows up to [param max_peers] connected peers, each allocating up to [param max_channels] channels, optionally limiting bandwidth to [param in_bandwidth] and [param out_bandwidth] (if greater than zero).  
         *      
         *  **Note:** It is necessary to create a host in both client and server in order to establish a connection.  
         */
        create_host_bound(bind_address: string, bind_port: int64, max_peers: int64 = 32, max_channels: int64 = 0, in_bandwidth: int64 = 0, out_bandwidth: int64 = 0): GError
        
        /** Creates an ENetHost that allows up to [param max_peers] connected peers, each allocating up to [param max_channels] channels, optionally limiting bandwidth to [param in_bandwidth] and [param out_bandwidth] (if greater than zero).  
         *  This method binds a random available dynamic UDP port on the host machine at the  *unspecified*  address. Use [method create_host_bound] to specify the address and port.  
         *      
         *  **Note:** It is necessary to create a host in both client and server in order to establish a connection.  
         */
        create_host(max_peers: int64 = 32, max_channels: int64 = 0, in_bandwidth: int64 = 0, out_bandwidth: int64 = 0): GError
        
        /** Destroys the host and all resources associated with it. */
        destroy(): void
        
        /** Initiates a connection to a foreign [param address] using the specified [param port] and allocating the requested [param channels]. Optional [param data] can be passed during connection in the form of a 32 bit integer.  
         *      
         *  **Note:** You must call either [method create_host] or [method create_host_bound] on both ends before calling this method.  
         */
        connect_to_host(address: string, port: int64, channels: int64 = 0, data: int64 = 0): ENetPacketPeer
        
        /** Waits for events on this connection and shuttles packets between the host and its peers, with the given [param timeout] (in milliseconds). The returned [Array] will have 4 elements. An [enum EventType], the [ENetPacketPeer] which generated the event, the event associated data (if any), the event associated channel (if any). If the generated event is [constant EVENT_RECEIVE], the received packet will be queued to the associated [ENetPacketPeer].  
         *  Call this function regularly to handle connections, disconnections, and to receive new packets.  
         *      
         *  **Note:** This method must be called on both ends involved in the event (sending and receiving hosts).  
         */
        service(timeout: int64 = 0): GArray
        
        /** Sends any queued packets on the host specified to its designated peers. */
        flush(): void
        
        /** Adjusts the bandwidth limits of a host. */
        bandwidth_limit(in_bandwidth: int64 = 0, out_bandwidth: int64 = 0): void
        
        /** Limits the maximum allowed channels of future incoming connections. */
        channel_limit(limit: int64): void
        
        /** Queues a [param packet] to be sent to all peers associated with the host over the specified [param channel]. See [ENetPacketPeer] `FLAG_*` constants for available packet flags. */
        broadcast(channel: int64, packet: PackedByteArray | byte[] | ArrayBuffer, flags: int64): void
        
        /** Sets the compression method used for network packets. These have different tradeoffs of compression speed versus bandwidth, you may need to test which one works best for your use case if you use compression at all.  
         *      
         *  **Note:** Most games' network design involve sending many small packets frequently (smaller than 4 KB each). If in doubt, it is recommended to keep the default compression algorithm as it works best on these small packets.  
         *      
         *  **Note:** The compression mode must be set to the same value on both the server and all its clients. Clients will fail to connect if the compression mode set on the client differs from the one set on the server.  
         */
        compress(mode: ENetConnection.CompressionMode): void
        
        /** Configure this ENetHost to use the custom Godot extension allowing DTLS encryption for ENet servers. Call this right after [method create_host_bound] to have ENet expect peers to connect using DTLS. See [method TLSOptions.server]. */
        dtls_server_setup(server_options: TLSOptions): GError
        
        /** Configure this ENetHost to use the custom Godot extension allowing DTLS encryption for ENet clients. Call this before [method connect_to_host] to have ENet connect using DTLS validating the server certificate against [param hostname]. You can pass the optional [param client_options] parameter to customize the trusted certification authorities, or disable the common name verification. See [method TLSOptions.client] and [method TLSOptions.client_unsafe]. */
        dtls_client_setup(hostname: string, client_options: TLSOptions = undefined): GError
        
        /** Configures the DTLS server to automatically drop new connections.  
         *      
         *  **Note:** This method is only relevant after calling [method dtls_server_setup].  
         */
        refuse_new_connections(refuse: boolean): void
        
        /** Returns and resets host statistics. See [enum HostStatistic] for more info. */
        pop_statistic(statistic: ENetConnection.HostStatistic): float64
        
        /** Returns the maximum number of channels allowed for connected peers. */
        get_max_channels(): int64
        
        /** Returns the local port to which this peer is bound. */
        get_local_port(): int64
        
        /** Returns the list of peers associated with this host.  
         *      
         *  **Note:** This list might include some peers that are not fully connected or are still being disconnected.  
         */
        get_peers(): GArray
        
        /** Sends a [param packet] toward a destination from the address and port currently bound by this ENetConnection instance.  
         *  This is useful as it serves to establish entries in NAT routing tables on all devices between this bound instance and the public facing internet, allowing a prospective client's connection packets to be routed backward through the NAT device(s) between the public internet and this host.  
         *  This requires forward knowledge of a prospective client's address and communication port as seen by the public internet - after any NAT devices have handled their connection request. This information can be obtained by a [url=https://en.wikipedia.org/wiki/STUN]STUN[/url] service, and must be handed off to your host by an entity that is not the prospective client. This will never work for a client behind a Symmetric NAT due to the nature of the Symmetric NAT routing algorithm, as their IP and Port cannot be known beforehand.  
         */
        socket_send(destination_address: string, destination_port: int64, packet: PackedByteArray | byte[] | ArrayBuffer): void
    }
    /** A MultiplayerPeer implementation using the [url=http://enet.bespin.org/index.html]ENet[/url] library.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_enetmultiplayerpeer.html  
     */
    class ENetMultiplayerPeer extends MultiplayerPeer {
        constructor(identifier?: any)
        /** Create server that listens to connections via [param port]. The port needs to be an available, unused port between 0 and 65535. Note that ports below 1024 are privileged and may require elevated permissions depending on the platform. To change the interface the server listens on, use [method set_bind_ip]. The default IP is the wildcard `"*"`, which listens on all available interfaces. [param max_clients] is the maximum number of clients that are allowed at once, any number up to 4095 may be used, although the achievable number of simultaneous clients may be far lower and depends on the application. For additional details on the bandwidth parameters, see [method create_client]. Returns [constant OK] if a server was created, [constant ERR_ALREADY_IN_USE] if this ENetMultiplayerPeer instance already has an open connection (in which case you need to call [method MultiplayerPeer.close] first) or [constant ERR_CANT_CREATE] if the server could not be created. */
        create_server(port: int64, max_clients: int64 = 32, max_channels: int64 = 0, in_bandwidth: int64 = 0, out_bandwidth: int64 = 0): GError
        
        /** Create client that connects to a server at [param address] using specified [param port]. The given address needs to be either a fully qualified domain name (e.g. `"www.example.com"`) or an IP address in IPv4 or IPv6 format (e.g. `"192.168.1.1"`). The [param port] is the port the server is listening on. The [param channel_count] parameter can be used to specify the number of ENet channels allocated for the connection. The [param in_bandwidth] and [param out_bandwidth] parameters can be used to limit the incoming and outgoing bandwidth to the given number of bytes per second. The default of 0 means unlimited bandwidth. Note that ENet will strategically drop packets on specific sides of a connection between peers to ensure the peer's bandwidth is not overwhelmed. The bandwidth parameters also determine the window size of a connection which limits the amount of reliable packets that may be in transit at any given time. Returns [constant OK] if a client was created, [constant ERR_ALREADY_IN_USE] if this ENetMultiplayerPeer instance already has an open connection (in which case you need to call [method MultiplayerPeer.close] first) or [constant ERR_CANT_CREATE] if the client could not be created. If [param local_port] is specified, the client will also listen to the given port; this is useful for some NAT traversal techniques. */
        create_client(address: string, port: int64, channel_count: int64 = 0, in_bandwidth: int64 = 0, out_bandwidth: int64 = 0, local_port: int64 = 0): GError
        
        /** Initialize this [MultiplayerPeer] in mesh mode. The provided [param unique_id] will be used as the local peer network unique ID once assigned as the [member MultiplayerAPI.multiplayer_peer]. In the mesh configuration you will need to set up each new peer manually using [ENetConnection] before calling [method add_mesh_peer]. While this technique is more advanced, it allows for better control over the connection process (e.g. when dealing with NAT punch-through) and for better distribution of the network load (which would otherwise be more taxing on the server). */
        create_mesh(unique_id: int64): GError
        
        /** Add a new remote peer with the given [param peer_id] connected to the given [param host].  
         *      
         *  **Note:** The [param host] must have exactly one peer in the [constant ENetPacketPeer.STATE_CONNECTED] state.  
         */
        add_mesh_peer(peer_id: int64, host: ENetConnection): GError
        
        /** The IP used when creating a server. This is set to the wildcard `"*"` by default, which binds to all available interfaces. The given IP needs to be in IPv4 or IPv6 address format, for example: `"192.168.1.1"`. */
        set_bind_ip(ip: string): void
        
        /** Returns the [ENetPacketPeer] associated to the given [param id]. */
        get_peer(id: int64): ENetPacketPeer
        
        /** The underlying [ENetConnection] created after [method create_client] and [method create_server]. */
        get host(): ENetConnection
    }
    namespace ENetPacketPeer {
        enum PeerState {
            /** The peer is disconnected. */
            STATE_DISCONNECTED = 0,
            
            /** The peer is currently attempting to connect. */
            STATE_CONNECTING = 1,
            
            /** The peer has acknowledged the connection request. */
            STATE_ACKNOWLEDGING_CONNECT = 2,
            
            /** The peer is currently connecting. */
            STATE_CONNECTION_PENDING = 3,
            
            /** The peer has successfully connected, but is not ready to communicate with yet ([constant STATE_CONNECTED]). */
            STATE_CONNECTION_SUCCEEDED = 4,
            
            /** The peer is currently connected and ready to communicate with. */
            STATE_CONNECTED = 5,
            
            /** The peer is slated to disconnect after it has no more outgoing packets to send. */
            STATE_DISCONNECT_LATER = 6,
            
            /** The peer is currently disconnecting. */
            STATE_DISCONNECTING = 7,
            
            /** The peer has acknowledged the disconnection request. */
            STATE_ACKNOWLEDGING_DISCONNECT = 8,
            
            /** The peer has lost connection, but is not considered truly disconnected (as the peer didn't acknowledge the disconnection request). */
            STATE_ZOMBIE = 9,
        }
        enum PeerStatistic {
            /** Mean packet loss of reliable packets as a ratio with respect to the [constant PACKET_LOSS_SCALE]. */
            PEER_PACKET_LOSS = 0,
            
            /** Packet loss variance. */
            PEER_PACKET_LOSS_VARIANCE = 1,
            
            /** The time at which packet loss statistics were last updated (in milliseconds since the connection started). The interval for packet loss statistics updates is 10 seconds, and at least one packet must have been sent since the last statistics update. */
            PEER_PACKET_LOSS_EPOCH = 2,
            
            /** Mean packet round trip time for reliable packets. */
            PEER_ROUND_TRIP_TIME = 3,
            
            /** Variance of the mean round trip time. */
            PEER_ROUND_TRIP_TIME_VARIANCE = 4,
            
            /** Last recorded round trip time for a reliable packet. */
            PEER_LAST_ROUND_TRIP_TIME = 5,
            
            /** Variance of the last trip time recorded. */
            PEER_LAST_ROUND_TRIP_TIME_VARIANCE = 6,
            
            /** The peer's current throttle status. */
            PEER_PACKET_THROTTLE = 7,
            
            /** The maximum number of unreliable packets that should not be dropped. This value is always greater than or equal to `1`. The initial value is equal to [constant PACKET_THROTTLE_SCALE]. */
            PEER_PACKET_THROTTLE_LIMIT = 8,
            
            /** Internal value used to increment the packet throttle counter. The value is hardcoded to `7` and cannot be changed. You probably want to look at [constant PEER_PACKET_THROTTLE_ACCELERATION] instead. */
            PEER_PACKET_THROTTLE_COUNTER = 9,
            
            /** The time at which throttle statistics were last updated (in milliseconds since the connection started). The interval for throttle statistics updates is [constant PEER_PACKET_THROTTLE_INTERVAL]. */
            PEER_PACKET_THROTTLE_EPOCH = 10,
            
            /** The throttle's acceleration factor. Higher values will make ENet adapt to fluctuating network conditions faster, causing unrelaible packets to be sent  *more*  often. The default value is `2`. */
            PEER_PACKET_THROTTLE_ACCELERATION = 11,
            
            /** The throttle's deceleration factor. Higher values will make ENet adapt to fluctuating network conditions faster, causing unrelaible packets to be sent  *less*  often. The default value is `2`. */
            PEER_PACKET_THROTTLE_DECELERATION = 12,
            
            /** The interval over which the lowest mean round trip time should be measured for use by the throttle mechanism (in milliseconds). The default value is `5000`. */
            PEER_PACKET_THROTTLE_INTERVAL = 13,
        }
    }
    /** A wrapper class for an [url=http://enet.bespin.org/group__peer.html]ENetPeer[/url].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_enetpacketpeer.html  
     */
    class ENetPacketPeer extends PacketPeer {
        /** The reference scale for packet loss. See [method get_statistic] and [constant PEER_PACKET_LOSS]. */
        static readonly PACKET_LOSS_SCALE = 65536
        
        /** The reference value for throttle configuration. The default value is `32`. See [method throttle_configure]. */
        static readonly PACKET_THROTTLE_SCALE = 32
        
        /** Mark the packet to be sent as reliable. */
        static readonly FLAG_RELIABLE = 1
        
        /** Mark the packet to be sent unsequenced (unreliable). */
        static readonly FLAG_UNSEQUENCED = 2
        
        /** Mark the packet to be sent unreliable even if the packet is too big and needs fragmentation (increasing the chance of it being dropped). */
        static readonly FLAG_UNRELIABLE_FRAGMENT = 8
        constructor(identifier?: any)
        
        /** Request a disconnection from a peer. An [constant ENetConnection.EVENT_DISCONNECT] will be generated during [method ENetConnection.service] once the disconnection is complete. */
        peer_disconnect(data: int64 = 0): void
        
        /** Request a disconnection from a peer, but only after all queued outgoing packets are sent. An [constant ENetConnection.EVENT_DISCONNECT] will be generated during [method ENetConnection.service] once the disconnection is complete. */
        peer_disconnect_later(data: int64 = 0): void
        
        /** Force an immediate disconnection from a peer. No [constant ENetConnection.EVENT_DISCONNECT] will be generated. The foreign peer is not guaranteed to receive the disconnect notification, and is reset immediately upon return from this function. */
        peer_disconnect_now(data: int64 = 0): void
        
        /** Sends a ping request to a peer. ENet automatically pings all connected peers at regular intervals, however, this function may be called to ensure more frequent ping requests. */
        ping(): void
        
        /** Sets the [param ping_interval] in milliseconds at which pings will be sent to a peer. Pings are used both to monitor the liveness of the connection and also to dynamically adjust the throttle during periods of low traffic so that the throttle has reasonable responsiveness during traffic spikes. The default ping interval is `500` milliseconds. */
        ping_interval(ping_interval: int64): void
        
        /** Forcefully disconnects a peer. The foreign host represented by the peer is not notified of the disconnection and will timeout on its connection to the local host. */
        reset(): void
        
        /** Queues a [param packet] to be sent over the specified [param channel]. See `FLAG_*` constants for available packet flags. */
        send(channel: int64, packet: PackedByteArray | byte[] | ArrayBuffer, flags: int64): GError
        
        /** Configures throttle parameter for a peer.  
         *  Unreliable packets are dropped by ENet in response to the varying conditions of the Internet connection to the peer. The throttle represents a probability that an unreliable packet should not be dropped and thus sent by ENet to the peer. By measuring fluctuations in round trip times of reliable packets over the specified [param interval], ENet will either increase the probability by the amount specified in the [param acceleration] parameter, or decrease it by the amount specified in the [param deceleration] parameter (both are ratios to [constant PACKET_THROTTLE_SCALE]).  
         *  When the throttle has a value of [constant PACKET_THROTTLE_SCALE], no unreliable packets are dropped by ENet, and so 100% of all unreliable packets will be sent.  
         *  When the throttle has a value of `0`, all unreliable packets are dropped by ENet, and so 0% of all unreliable packets will be sent.  
         *  Intermediate values for the throttle represent intermediate probabilities between 0% and 100% of unreliable packets being sent. The bandwidth limits of the local and foreign hosts are taken into account to determine a sensible limit for the throttle probability above which it should not raise even in the best of conditions.  
         */
        throttle_configure(interval: int64, acceleration: int64, deceleration: int64): void
        
        /** Sets the timeout parameters for a peer. The timeout parameters control how and when a peer will timeout from a failure to acknowledge reliable traffic. Timeout values are expressed in milliseconds.  
         *  The [param timeout] is a factor that, multiplied by a value based on the average round trip time, will determine the timeout limit for a reliable packet. When that limit is reached, the timeout will be doubled, and the peer will be disconnected if that limit has reached [param timeout_min]. The [param timeout_max] parameter, on the other hand, defines a fixed timeout for which any packet must be acknowledged or the peer will be dropped.  
         */
        set_timeout(timeout: int64, timeout_min: int64, timeout_max: int64): void
        
        /** Returns the ENet flags of the next packet in the received queue. See `FLAG_*` constants for available packet flags. Note that not all flags are replicated from the sending peer to the receiving peer. */
        get_packet_flags(): int64
        
        /** Returns the IP address of this peer. */
        get_remote_address(): string
        
        /** Returns the remote port of this peer. */
        get_remote_port(): int64
        
        /** Returns the requested [param statistic] for this peer. See [enum PeerStatistic]. */
        get_statistic(statistic: ENetPacketPeer.PeerStatistic): float64
        
        /** Returns the current peer state. See [enum PeerState]. */
        get_state(): ENetPacketPeer.PeerState
        
        /** Returns the number of channels allocated for communication with peer. */
        get_channels(): int64
        
        /** Returns `true` if the peer is currently active (i.e. the associated [ENetConnection] is still valid). */
        is_active(): boolean
    }
    class EditorAbout<Map extends Record<string, Node> = Record<string, Node>> extends AcceptDialog<Map> {
        constructor(identifier?: any)
    }
    class EditorAssetLibrary<Map extends Record<string, Node> = Record<string, Node>> extends PanelContainer<Map> {
        constructor(identifier?: any)
        readonly install_asset: Signal2<string, string>
    }
    class EditorAudioBus<Map extends Record<string, Node> = Record<string, Node>> extends PanelContainer<Map> {
        constructor(identifier?: any)
        update_bus(): void
        update_send(): void
        readonly duplicate_request: Signal0
        readonly delete_request: Signal0
        readonly vol_reset_request: Signal0
        readonly drop_end_request: Signal0
        readonly dropped: Signal0
    }
    class EditorAudioBuses<Map extends Record<string, Node> = Record<string, Node>> extends VBoxContainer<Map> {
        constructor(identifier?: any)
        _update_bus(_unnamed_arg0: int64): void
        _update_sends(): void
    }
    class EditorAudioMeterNotches<Map extends Record<string, Node> = Record<string, Node>> extends Control<Map> {
        constructor(identifier?: any)
        add_notch(_unnamed_arg0: float64, _unnamed_arg1: float64, _unnamed_arg2: boolean): void
        _draw_audio_notches(): void
    }
    class EditorAudioStreamPreviewPlugin extends EditorResourcePreviewGenerator {
        constructor(identifier?: any)
    }
    class EditorAudioStreamTooltipPlugin extends EditorResourceTooltipPlugin {
        constructor(identifier?: any)
    }
    class EditorAutoloadSettings<Map extends Record<string, Node> = Record<string, Node>> extends VBoxContainer<Map> {
        constructor(identifier?: any)
        update_autoload(): void
        autoload_add(_unnamed_arg0: string, _unnamed_arg1: string): boolean
        autoload_remove(_unnamed_arg0: string): void
        readonly autoload_changed: Signal0
    }
    class EditorBitmapPreviewPlugin extends EditorResourcePreviewGenerator {
        constructor(identifier?: any)
    }
    class EditorBottomPanel<Map extends Record<string, Node> = Record<string, Node>> extends PanelContainer<Map> {
        constructor(identifier?: any)
    }
    namespace EditorBuildProfile {
        enum BuildOption {
            BUILD_OPTION_3D = 0,
            BUILD_OPTION_PHYSICS_2D = 1,
            BUILD_OPTION_PHYSICS_3D = 2,
            BUILD_OPTION_NAVIGATION = 3,
            BUILD_OPTION_XR = 4,
            BUILD_OPTION_RENDERING_DEVICE = 5,
            BUILD_OPTION_OPENGL = 6,
            BUILD_OPTION_VULKAN = 7,
            BUILD_OPTION_TEXT_SERVER_FALLBACK = 8,
            BUILD_OPTION_TEXT_SERVER_ADVANCED = 9,
            BUILD_OPTION_DYNAMIC_FONTS = 10,
            BUILD_OPTION_WOFF2_FONTS = 11,
            BUILD_OPTION_GRAPHITE_FONTS = 12,
            BUILD_OPTION_MSDFGEN = 13,
            BUILD_OPTION_MAX = 14,
        }
        enum BuildOptionCategory {
            BUILD_OPTION_CATEGORY_GENERAL = 0,
            BUILD_OPTION_CATEGORY_TEXT_SERVER = 1,
            BUILD_OPTION_CATEGORY_MAX = 2,
        }
    }
    class EditorBuildProfile extends RefCounted {
        constructor(identifier?: any)
        set_disable_class(class_name: StringName, disable: boolean): void
        is_class_disabled(class_name: StringName): boolean
        set_disable_build_option(build_option: EditorBuildProfile.BuildOption, disable: boolean): void
        is_build_option_disabled(build_option: EditorBuildProfile.BuildOption): boolean
        get_build_option_name(build_option: EditorBuildProfile.BuildOption): string
        save_to_file(path: string): GError
        load_from_file(path: string): GError
    }
    class EditorBuildProfileManager<Map extends Record<string, Node> = Record<string, Node>> extends AcceptDialog<Map> {
        constructor(identifier?: any)
        _update_selected_profile(): void
    }
    /** Godot editor's command palette.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_editorcommandpalette.html  
     */
    class EditorCommandPalette<Map extends Record<string, Node> = Record<string, Node>> extends ConfirmationDialog<Map> {
        constructor(identifier?: any)
        /** Adds a custom command to EditorCommandPalette.  
         *  - [param command_name]: [String] (Name of the **Command**. This is displayed to the user.)  
         *  - [param key_name]: [String] (Name of the key for a particular **Command**. This is used to uniquely identify the **Command**.)  
         *  - [param binded_callable]: [Callable] (Callable of the **Command**. This will be executed when the **Command** is selected.)  
         *  - [param shortcut_text]: [String] (Shortcut text of the **Command** if available.)  
         */
        add_command(command_name: string, key_name: string, binded_callable: Callable, shortcut_text: string = 'None'): void
        
        /** Removes the custom command from EditorCommandPalette.  
         *  - [param key_name]: [String] (Name of the key for a particular **Command**.)  
         */
        remove_command(key_name: string): void
    }
    namespace EditorContextMenuPlugin {
        enum ContextMenuSlot {
            /** Context menu of Scene dock. [method _popup_menu] will be called with a list of paths to currently selected nodes, while option callback will receive the list of currently selected nodes. */
            CONTEXT_SLOT_SCENE_TREE = 0,
            
            /** Context menu of FileSystem dock. [method _popup_menu] and option callback will be called with list of paths of the currently selected files. */
            CONTEXT_SLOT_FILESYSTEM = 1,
            
            /** Context menu of Script editor's script tabs. [method _popup_menu] will be called with the path to the currently edited script, while option callback will receive reference to that script. */
            CONTEXT_SLOT_SCRIPT_EDITOR = 2,
            
            /** The "Create..." submenu of FileSystem dock's context menu. [method _popup_menu] and option callback will be called with list of paths of the currently selected files. */
            CONTEXT_SLOT_FILESYSTEM_CREATE = 3,
            
            /** Context menu of Script editor's code editor. [method _popup_menu] will be called with the path to the [CodeEdit] node. You can fetch it using this code:  
             *    
             *  The option callback will receive reference to that node. You can use [CodeEdit] methods to perform symbol lookups etc.  
             */
            CONTEXT_SLOT_SCRIPT_EDITOR_CODE = 4,
            
            /** Context menu of scene tabs. [method _popup_menu] will be called with the path of the clicked scene, or empty [PackedStringArray] if the menu was opened on empty space. The option callback will receive the path of the clicked scene, or empty [String] if none was clicked. */
            CONTEXT_SLOT_SCENE_TABS = 5,
            
            /** Context menu of 2D editor's basic right-click menu. [method _popup_menu] will be called with paths to all [CanvasItem] nodes under the cursor. You can fetch them using this code:  
             *    
             *  The paths array is empty if there weren't any nodes under cursor. The option callback will receive a typed array of [CanvasItem] nodes.  
             */
            CONTEXT_SLOT_2D_EDITOR = 6,
        }
    }
    /** Plugin for adding custom context menus in the editor.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_editorcontextmenuplugin.html  
     */
    class EditorContextMenuPlugin extends RefCounted {
        constructor(identifier?: any)
        /** Called when creating a context menu, custom options can be added by using the [method add_context_menu_item] or [method add_context_menu_item_from_shortcut] functions. [param paths] contains currently selected paths (depending on menu), which can be used to conditionally add options. */
        /* gdvirtual */ _popup_menu(paths: PackedStringArray | string[]): void
        
        /** Registers a shortcut associated with the plugin's context menu. This method should be called once (e.g. in plugin's [method Object._init]). [param callback] will be called when user presses the specified [param shortcut] while the menu's context is in effect (e.g. FileSystem dock is focused). Callback should take single [Array] argument; array contents depend on context menu slot.  
         *    
         */
        add_menu_shortcut(shortcut: Shortcut, callback: Callable): void
        
        /** Add custom option to the context menu of the plugin's specified slot. When the option is activated, [param callback] will be called. Callback should take single [Array] argument; array contents depend on context menu slot.  
         *    
         *  If you want to assign shortcut to the menu item, use [method add_context_menu_item_from_shortcut] instead.  
         */
        add_context_menu_item(name: string, callback: Callable, icon: Texture2D = undefined): void
        
        /** Add custom option to the context menu of the plugin's specified slot. The option will have the [param shortcut] assigned and reuse its callback. The shortcut has to be registered beforehand with [method add_menu_shortcut].  
         *    
         */
        add_context_menu_item_from_shortcut(name: string, shortcut: Shortcut, icon: Texture2D = undefined): void
        
        /** Add a submenu to the context menu of the plugin's specified slot. The submenu is not automatically handled, you need to connect to its signals yourself. Also the submenu is freed on every popup, so provide a new [PopupMenu] every time.  
         *    
         */
        add_context_submenu_item(name: string, menu: PopupMenu, icon: Texture2D = undefined): void
    }
    class EditorContextMenuPluginManager extends Object {
        constructor(identifier?: any)
    }
    class EditorDebuggerInspector<Map extends Record<string, Node> = Record<string, Node>> extends EditorInspector<Map> {
        constructor(identifier?: any)
        readonly object_selected: Signal1<int64>
        readonly object_edited: Signal3<int64, string, any /*value*/>
        readonly object_property_updated: Signal2<int64, string>
    }
    class EditorDebuggerNode<Map extends Record<string, Node> = Record<string, Node>> extends MarginContainer<Map> {
        constructor(identifier?: any)
        live_debug_create_node(_unnamed_arg0: NodePath | string, _unnamed_arg1: string, _unnamed_arg2: string): void
        live_debug_instantiate_node(_unnamed_arg0: NodePath | string, _unnamed_arg1: string, _unnamed_arg2: string): void
        live_debug_remove_node(_unnamed_arg0: NodePath | string): void
        live_debug_remove_and_keep_node(_unnamed_arg0: NodePath | string, _unnamed_arg1: int64): void
        live_debug_restore_node(_unnamed_arg0: int64, _unnamed_arg1: NodePath | string, _unnamed_arg2: int64): void
        live_debug_duplicate_node(_unnamed_arg0: NodePath | string, _unnamed_arg1: string): void
        live_debug_reparent_node(_unnamed_arg0: NodePath | string, _unnamed_arg1: NodePath | string, _unnamed_arg2: string, _unnamed_arg3: int64): void
        readonly goto_script_line: Signal0
        readonly set_execution: Signal2<any /*script*/, int64>
        readonly clear_execution: Signal1<any /*script*/>
        readonly breaked: Signal2<boolean, boolean>
        readonly breakpoint_toggled: Signal3<string, int64, boolean>
        readonly breakpoint_set_in_tree: Signal4<any /*script*/, int64, boolean, int64>
        readonly breakpoints_cleared_in_tree: Signal1<int64>
    }
    /** A base class to implement debugger plugins.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_editordebuggerplugin.html  
     */
    class EditorDebuggerPlugin extends RefCounted {
        constructor(identifier?: any)
        /** Override this method to be notified whenever a new [EditorDebuggerSession] is created. Note that the session may be inactive during this stage. */
        /* gdvirtual */ _setup_session(session_id: int64): void
        
        /** Override this method to enable receiving messages from the debugger. If [param capture] is "my_message" then messages starting with "my_message:" will be passed to the [method _capture] method. */
        /* gdvirtual */ _has_capture(capture: string): boolean
        
        /** Override this method to process incoming messages. The [param session_id] is the ID of the [EditorDebuggerSession] that received the [param message]. Use [method get_session] to retrieve the session. This method should return `true` if the message is recognized. */
        /* gdvirtual */ _capture(message: string, data: GArray, session_id: int64): boolean
        
        /** Override this method to be notified when a breakpoint line has been clicked in the debugger breakpoint panel. */
        /* gdvirtual */ _goto_script_line(script: Script, line: int64): void
        
        /** Override this method to be notified when all breakpoints are cleared in the editor. */
        /* gdvirtual */ _breakpoints_cleared_in_tree(): void
        
        /** Override this method to be notified when a breakpoint is set in the editor. */
        /* gdvirtual */ _breakpoint_set_in_tree(script: Script, line: int64, enabled: boolean): void
        
        /** Returns the [EditorDebuggerSession] with the given [param id]. */
        get_session(id: int64): EditorDebuggerSession
        
        /** Returns an array of [EditorDebuggerSession] currently available to this debugger plugin.  
         *      
         *  **Note:** Sessions in the array may be inactive, check their state via [method EditorDebuggerSession.is_active].  
         */
        get_sessions(): GArray
    }
    class EditorDebuggerRemoteObject extends Object {
        constructor(identifier?: any)
        get_title(): string
        get_variant(_unnamed_arg0: StringName): any
        clear(): void
        get_remote_object_id(): int64
        readonly value_edited: Signal3<int64, string, any /*value*/>
    }
    /** A class to interact with the editor debugger.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_editordebuggersession.html  
     */
    class EditorDebuggerSession extends RefCounted {
        constructor(identifier?: any)
        /** Sends the given [param message] to the attached remote instance, optionally passing additionally [param data]. See [EngineDebugger] for how to retrieve those messages. */
        send_message(message: string, data: GArray = []): void
        
        /** Toggle the given [param profiler] on the attached remote instance, optionally passing additionally [param data]. See [EngineProfiler] for more details. */
        toggle_profiler(profiler: string, enable: boolean, data: GArray = []): void
        
        /** Returns `true` if the attached remote instance is currently in the debug loop. */
        is_breaked(): boolean
        
        /** Returns `true` if the attached remote instance can be debugged. */
        is_debuggable(): boolean
        
        /** Returns `true` if the debug session is currently attached to a remote instance. */
        is_active(): boolean
        
        /** Adds the given [param control] to the debug session UI in the debugger bottom panel. The [param control]'s node name will be used as the tab title. */
        add_session_tab(control: Control): void
        
        /** Removes the given [param control] from the debug session UI in the debugger bottom panel. */
        remove_session_tab(control: Control): void
        
        /** Enables or disables a specific breakpoint based on [param enabled], updating the Editor Breakpoint Panel accordingly. */
        set_breakpoint(path: string, line: int64, enabled: boolean): void
        
        /** Emitted when a remote instance is attached to this session (i.e. the session becomes active). */
        readonly started: Signal0
        
        /** Emitted when a remote instance is detached from this session (i.e. the session becomes inactive). */
        readonly stopped: Signal0
        
        /** Emitted when the attached remote instance enters a break state. If [param can_debug] is `true`, the remote instance will enter the debug loop. */
        readonly breaked: Signal1<boolean>
        
        /** Emitted when the attached remote instance exits a break state. */
        readonly continued: Signal0
    }
    class EditorDebuggerTree<Map extends Record<string, Node> = Record<string, Node>> extends Tree<Map> {
        constructor(identifier?: any)
        readonly object_selected: Signal2<int64, int64>
        readonly save_node: Signal3<int64, string, int64>
        readonly open: Signal0
    }
    class EditorDirDialog<Map extends Record<string, Node> = Record<string, Node>> extends ConfirmationDialog<Map> {
        constructor(identifier?: any)
        readonly copy_pressed: Signal1<string>
        readonly move_pressed: Signal1<string>
    }
    class EditorDockManager extends Object {
        constructor(identifier?: any)
    }
    class EditorExport<Map extends Record<string, Node> = Record<string, Node>> extends Node<Map> {
        constructor(identifier?: any)
        readonly export_presets_updated: Signal0
        readonly export_presets_runnable_updated: Signal0
    }
    class EditorExportGDScript extends EditorExportPlugin {
        constructor(identifier?: any)
    }
    namespace EditorExportPlatform {
        enum ExportMessageType {
            /** Invalid message type used as the default value when no type is specified. */
            EXPORT_MESSAGE_NONE = 0,
            
            /** Message type for informational messages that have no effect on the export. */
            EXPORT_MESSAGE_INFO = 1,
            
            /** Message type for warning messages that should be addressed but still allow to complete the export. */
            EXPORT_MESSAGE_WARNING = 2,
            
            /** Message type for error messages that must be addressed and fail the export. */
            EXPORT_MESSAGE_ERROR = 3,
        }
        enum DebugFlags {
            /** Flag is set if remotely debugged project is expected to use remote file system. If set, [method gen_export_flags] will add `--remote-fs` and `--remote-fs-password` (if password is set in the editor settings) command line arguments to the list. */
            DEBUG_FLAG_DUMB_CLIENT = 1,
            
            /** Flag is set if remote debug is enabled. If set, [method gen_export_flags] will add `--remote-debug` and `--breakpoints` (if breakpoints are selected in the script editor or added by the plugin) command line arguments to the list. */
            DEBUG_FLAG_REMOTE_DEBUG = 2,
            
            /** Flag is set if remotely debugged project is running on the localhost. If set, [method gen_export_flags] will use `localhost` instead of [member EditorSettings.network/debug/remote_host] as remote debugger host. */
            DEBUG_FLAG_REMOTE_DEBUG_LOCALHOST = 4,
            
            /** Flag is set if "Visible Collision Shapes" remote debug option is enabled. If set, [method gen_export_flags] will add `--debug-collisions` command line arguments to the list. */
            DEBUG_FLAG_VIEW_COLLISIONS = 8,
            
            /** Flag is set if Visible Navigation" remote debug option is enabled. If set, [method gen_export_flags] will add `--debug-navigation` command line arguments to the list. */
            DEBUG_FLAG_VIEW_NAVIGATION = 16,
        }
    }
    /** Identifies a supported export platform, and internally provides the functionality of exporting to that platform.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_editorexportplatform.html  
     */
    class EditorExportPlatform extends RefCounted {
        constructor(identifier?: any)
        /** Returns the name of the export operating system handled by this [EditorExportPlatform] class, as a friendly string. Possible return values are `Windows`, `Linux`, `macOS`, `Android`, `iOS`, and `Web`. */
        get_os_name(): string
        
        /** Create a new preset for this platform. */
        create_preset(): EditorExportPreset
        
        /** Locates export template for the platform, and returns [Dictionary] with the following keys: `path: String` and `error: String`. This method is provided for convenience and custom export platforms aren't required to use it or keep export templates stored in the same way official templates are. */
        find_export_template(template_file_name: string): GDictionary
        
        /** Returns array of [EditorExportPreset]s for this platform. */
        get_current_presets(): GArray
        
        /** Saves PCK archive and returns [Dictionary] with the following keys: `result: Error`, `so_files: Array` (array of the shared/static objects which contains dictionaries with the following keys: `path: String`, `tags: PackedStringArray`, and `target_folder: String`).  
         *  If [param embed] is `true`, PCK content is appended to the end of [param path] file and return [Dictionary] additionally include following keys: `embedded_start: int` (embedded PCK offset) and `embedded_size: int` (embedded PCK size).  
         */
        save_pack(preset: EditorExportPreset, debug: boolean, path: string, embed: boolean = false): GDictionary
        
        /** Saves ZIP archive and returns [Dictionary] with the following keys: `result: Error`, `so_files: Array` (array of the shared/static objects which contains dictionaries with the following keys: `path: String`, `tags: PackedStringArray`, and `target_folder: String`). */
        save_zip(preset: EditorExportPreset, debug: boolean, path: string): GDictionary
        
        /** Saves patch PCK archive and returns [Dictionary] with the following keys: `result: Error`, `so_files: Array` (array of the shared/static objects which contains dictionaries with the following keys: `path: String`, `tags: PackedStringArray`, and `target_folder: String`). */
        save_pack_patch(preset: EditorExportPreset, debug: boolean, path: string): GDictionary
        
        /** Saves patch ZIP archive and returns [Dictionary] with the following keys: `result: Error`, `so_files: Array` (array of the shared/static objects which contains dictionaries with the following keys: `path: String`, `tags: PackedStringArray`, and `target_folder: String`). */
        save_zip_patch(preset: EditorExportPreset, debug: boolean, path: string): GDictionary
        
        /** Generates array of command line arguments for the default export templates for the debug flags and editor settings. */
        gen_export_flags(flags: EditorExportPlatform.DebugFlags): PackedStringArray
        
        /** Exports project files for the specified preset. This method can be used to implement custom export format, other than PCK and ZIP. One of the callbacks is called for each exported file.  
         *  [param save_cb] is called for all exported files and have the following arguments: `file_path: String`, `file_data: PackedByteArray`, `file_index: int`, `file_count: int`, `encryption_include_filters: PackedStringArray`, `encryption_exclude_filters: PackedStringArray`, `encryption_key: PackedByteArray`.  
         *  [param shared_cb] is called for exported native shared/static libraries and have the following arguments: `file_path: String`, `tags: PackedStringArray`, `target_folder: String`.  
         *      
         *  **Note:** `file_index` and `file_count` are intended for progress tracking only and aren't necessarily unique and precise.  
         */
        export_project_files(preset: EditorExportPreset, debug: boolean, save_cb: Callable, shared_cb: Callable = new Callable()): GError
        
        /** Creates a full project at [param path] for the specified [param preset]. */
        export_project(preset: EditorExportPreset, debug: boolean, path: string, flags: EditorExportPlatform.DebugFlags = 0): GError
        
        /** Creates a PCK archive at [param path] for the specified [param preset]. */
        export_pack(preset: EditorExportPreset, debug: boolean, path: string, flags: EditorExportPlatform.DebugFlags = 0): GError
        
        /** Create a ZIP archive at [param path] for the specified [param preset]. */
        export_zip(preset: EditorExportPreset, debug: boolean, path: string, flags: EditorExportPlatform.DebugFlags = 0): GError
        
        /** Creates a patch PCK archive at [param path] for the specified [param preset], containing only the files that have changed since the last patch.  
         *      
         *  **Note:** [param patches] is an optional override of the set of patches defined in the export preset. When empty the patches defined in the export preset will be used instead.  
         */
        export_pack_patch(preset: EditorExportPreset, debug: boolean, path: string, patches: PackedStringArray | string[] = [], flags: EditorExportPlatform.DebugFlags = 0): GError
        
        /** Create a patch ZIP archive at [param path] for the specified [param preset], containing only the files that have changed since the last patch.  
         *      
         *  **Note:** [param patches] is an optional override of the set of patches defined in the export preset. When empty the patches defined in the export preset will be used instead.  
         */
        export_zip_patch(preset: EditorExportPreset, debug: boolean, path: string, patches: PackedStringArray | string[] = [], flags: EditorExportPlatform.DebugFlags = 0): GError
        
        /** Clears the export log. */
        clear_messages(): void
        
        /** Adds a message to the export log that will be displayed when exporting ends. */
        add_message(type: EditorExportPlatform.ExportMessageType, category: string, message: string): void
        
        /** Returns number of messages in the export log. */
        get_message_count(): int64
        
        /** Returns message type, for the message with [param index]. */
        get_message_type(index: int64): EditorExportPlatform.ExportMessageType
        
        /** Returns message category, for the message with [param index]. */
        get_message_category(index: int64): string
        
        /** Returns message text, for the message with [param index]. */
        get_message_text(index: int64): string
        
        /** Returns most severe message type currently present in the export log. */
        get_worst_message_type(): EditorExportPlatform.ExportMessageType
        
        /** Executes specified command on the remote host via SSH protocol and returns command output in the [param output]. */
        ssh_run_on_remote(host: string, port: string, ssh_arg: PackedStringArray | string[], cmd_args: string, output: GArray = [], port_fwd: int64 = -1): GError
        
        /** Executes specified command on the remote host via SSH protocol and returns process ID (on the remote host) without waiting for command to finish. */
        ssh_run_on_remote_no_wait(host: string, port: string, ssh_args: PackedStringArray | string[], cmd_args: string, port_fwd: int64 = -1): int64
        
        /** Uploads specified file over SCP protocol to the remote host. */
        ssh_push_to_remote(host: string, port: string, scp_args: PackedStringArray | string[], src_file: string, dst_file: string): GError
        
        /** Returns additional files that should always be exported regardless of preset configuration, and are not part of the project source. The returned [Dictionary] contains filename keys ([String]) and their corresponding raw data ([PackedByteArray]). */
        get_internal_export_files(preset: EditorExportPreset, debug: boolean): GDictionary
        
        /** Returns array of core file names that always should be exported regardless of preset config. */
        static get_forced_export_files(): PackedStringArray
    }
    /** Exporter for Android.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_editorexportplatformandroid.html  
     */
    class EditorExportPlatformAndroid extends EditorExportPlatform {
        constructor(identifier?: any)
    }
    /** Base class for custom [EditorExportPlatform] implementations (plugins).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_editorexportplatformextension.html  
     */
    class EditorExportPlatformExtension extends EditorExportPlatform {
        constructor(identifier?: any)
        /** **Required.**  
         *  Returns array of platform specific features for the specified [param preset].  
         */
        /* gdvirtual */ _get_preset_features(preset: EditorExportPreset): PackedStringArray
        
        /** **Optional.**  
         *  Returns `true` if specified file is a valid executable (native executable or script) for the target platform.  
         */
        /* gdvirtual */ _is_executable(path: string): boolean
        
        /** **Optional.**  
         *  Returns a property list, as an [Array] of dictionaries. Each [Dictionary] must at least contain the `name: StringName` and `type: Variant.Type` entries.  
         *  Additionally, the following keys are supported:  
         *  - `hint: PropertyHint`  
         *  - `hint_string: String`  
         *  - `usage: PropertyUsageFlags`  
         *  - `class_name: StringName`  
         *  - `default_value: Variant`, default value of the property.  
         *  - `update_visibility: bool`, if set to `true`, [method _get_export_option_visibility] is called for each property when this property is changed.  
         *  - `required: bool`, if set to `true`, this property warnings are critical, and should be resolved to make export possible. This value is a hint for the [method _has_valid_export_configuration] implementation, and not used by the engine directly.  
         *  See also [method Object._get_property_list].  
         */
        /* gdvirtual */ _get_export_options(): GArray
        
        /** **Optional.**  
         *  Returns `true` if export options list is changed and presets should be updated.  
         */
        /* gdvirtual */ _should_update_export_options(): boolean
        
        /** **Optional.**  
         *  Validates [param option] and returns visibility for the specified [param preset]. Default implementation return `true` for all options.  
         */
        /* gdvirtual */ _get_export_option_visibility(preset: EditorExportPreset, option: string): boolean
        
        /** **Optional.**  
         *  Validates [param option] and returns warning message for the specified [param preset]. Default implementation return empty string for all options.  
         */
        /* gdvirtual */ _get_export_option_warning(preset: EditorExportPreset, option: StringName): string
        
        /** **Required.**  
         *  Returns target OS name.  
         */
        /* gdvirtual */ _get_os_name(): string
        
        /** **Required.**  
         *  Returns export platform name.  
         */
        /* gdvirtual */ _get_name(): string
        
        /** **Required.**  
         *  Returns platform logo displayed in the export dialog, logo should be 32x32 adjusted to the current editor scale, see [method EditorInterface.get_editor_scale].  
         */
        /* gdvirtual */ _get_logo(): Texture2D
        
        /** **Optional.**  
         *  Returns `true` if one-click deploy options are changed and editor interface should be updated.  
         */
        /* gdvirtual */ _poll_export(): boolean
        
        /** **Optional.**  
         *  Returns number one-click deploy devices (or other one-click option displayed in the menu).  
         */
        /* gdvirtual */ _get_options_count(): int64
        
        /** **Optional.**  
         *  Returns tooltip of the one-click deploy menu button.  
         */
        /* gdvirtual */ _get_options_tooltip(): string
        
        /** **Optional.**  
         *  Returns one-click deploy menu item icon for the specified [param device], icon should be 16x16 adjusted to the current editor scale, see [method EditorInterface.get_editor_scale].  
         */
        /* gdvirtual */ _get_option_icon(device: int64): ImageTexture
        
        /** **Optional.**  
         *  Returns one-click deploy menu item label for the specified [param device].  
         */
        /* gdvirtual */ _get_option_label(device: int64): string
        
        /** **Optional.**  
         *  Returns one-click deploy menu item tooltip for the specified [param device].  
         */
        /* gdvirtual */ _get_option_tooltip(device: int64): string
        
        /** **Optional.**  
         *  Returns device architecture for one-click deploy.  
         */
        /* gdvirtual */ _get_device_architecture(device: int64): string
        
        /** **Optional.**  
         *  Called by the editor before platform is unregistered.  
         */
        /* gdvirtual */ _cleanup(): void
        
        /** **Optional.**  
         *  This method is called when [param device] one-click deploy menu option is selected.  
         *  Implementation should export project to a temporary location, upload and run it on the specific [param device], or perform another action associated with the menu item.  
         */
        /* gdvirtual */ _run(preset: EditorExportPreset, device: int64, debug_flags: EditorExportPlatform.DebugFlags): GError
        
        /** **Optional.**  
         *  Returns icon of the one-click deploy menu button, icon should be 16x16 adjusted to the current editor scale, see [method EditorInterface.get_editor_scale].  
         */
        /* gdvirtual */ _get_run_icon(): Texture2D
        
        /** **Optional.**  
         *  Returns `true`, if specified [param preset] is valid and can be exported. Use [method set_config_error] and [method set_config_missing_templates] to set error details.  
         *  Usual implementation can call [method _has_valid_export_configuration] and [method _has_valid_project_configuration] to determine if export is possible.  
         */
        /* gdvirtual */ _can_export(preset: EditorExportPreset, debug: boolean): boolean
        
        /** **Required.**  
         *  Returns `true` if export configuration is valid.  
         */
        /* gdvirtual */ _has_valid_export_configuration(preset: EditorExportPreset, debug: boolean): boolean
        
        /** **Required.**  
         *  Returns `true` if project configuration is valid.  
         */
        /* gdvirtual */ _has_valid_project_configuration(preset: EditorExportPreset): boolean
        
        /** **Required.**  
         *  Returns array of supported binary extensions for the full project export.  
         */
        /* gdvirtual */ _get_binary_extensions(preset: EditorExportPreset): PackedStringArray
        
        /** **Required.**  
         *  Creates a full project at [param path] for the specified [param preset].  
         *  This method is called when "Export" button is pressed in the export dialog.  
         *  This method implementation can call [method EditorExportPlatform.save_pack] or [method EditorExportPlatform.save_zip] to use default PCK/ZIP export process, or calls [method EditorExportPlatform.export_project_files] and implement custom callback for processing each exported file.  
         */
        /* gdvirtual */ _export_project(preset: EditorExportPreset, debug: boolean, path: string, flags: EditorExportPlatform.DebugFlags): GError
        
        /** **Optional.**  
         *  Creates a PCK archive at [param path] for the specified [param preset].  
         *  This method is called when "Export PCK/ZIP" button is pressed in the export dialog, with "Export as Patch" disabled, and PCK is selected as a file type.  
         */
        /* gdvirtual */ _export_pack(preset: EditorExportPreset, debug: boolean, path: string, flags: EditorExportPlatform.DebugFlags): GError
        
        /** **Optional.**  
         *  Create a ZIP archive at [param path] for the specified [param preset].  
         *  This method is called when "Export PCK/ZIP" button is pressed in the export dialog, with "Export as Patch" disabled, and ZIP is selected as a file type.  
         */
        /* gdvirtual */ _export_zip(preset: EditorExportPreset, debug: boolean, path: string, flags: EditorExportPlatform.DebugFlags): GError
        
        /** **Optional.**  
         *  Creates a patch PCK archive at [param path] for the specified [param preset], containing only the files that have changed since the last patch.  
         *  This method is called when "Export PCK/ZIP" button is pressed in the export dialog, with "Export as Patch" enabled, and PCK is selected as a file type.  
         *      
         *  **Note:** The patches provided in [param patches] have already been loaded when this method is called and are merely provided as context. When empty the patches defined in the export preset have been loaded instead.  
         */
        /* gdvirtual */ _export_pack_patch(preset: EditorExportPreset, debug: boolean, path: string, patches: PackedStringArray | string[], flags: EditorExportPlatform.DebugFlags): GError
        
        /** **Optional.**  
         *  Create a ZIP archive at [param path] for the specified [param preset], containing only the files that have changed since the last patch.  
         *  This method is called when "Export PCK/ZIP" button is pressed in the export dialog, with "Export as Patch" enabled, and ZIP is selected as a file type.  
         *      
         *  **Note:** The patches provided in [param patches] have already been loaded when this method is called and are merely provided as context. When empty the patches defined in the export preset have been loaded instead.  
         */
        /* gdvirtual */ _export_zip_patch(preset: EditorExportPreset, debug: boolean, path: string, patches: PackedStringArray | string[], flags: EditorExportPlatform.DebugFlags): GError
        
        /** **Required.**  
         *  Returns array of platform specific features.  
         */
        /* gdvirtual */ _get_platform_features(): PackedStringArray
        
        /** **Optional.**  
         *  Returns protocol used for remote debugging. Default implementation return `tcp://`.  
         */
        /* gdvirtual */ _get_debug_protocol(): string
        
        /** Sets current configuration error message text. This method should be called only from the [method _can_export], [method _has_valid_export_configuration], or [method _has_valid_project_configuration] implementations. */
        set_config_error(error_text: string): void
        
        /** Returns current configuration error message text. This method should be called only from the [method _can_export], [method _has_valid_export_configuration], or [method _has_valid_project_configuration] implementations. */
        get_config_error(): string
        
        /** Set to `true` is export templates are missing from the current configuration. This method should be called only from the [method _can_export], [method _has_valid_export_configuration], or [method _has_valid_project_configuration] implementations. */
        set_config_missing_templates(missing_templates: boolean): void
        
        /** Returns `true` is export templates are missing from the current configuration. This method should be called only from the [method _can_export], [method _has_valid_export_configuration], or [method _has_valid_project_configuration] implementations. */
        get_config_missing_templates(): boolean
    }
    /** Exporter for iOS.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_editorexportplatformios.html  
     */
    class EditorExportPlatformIOS extends EditorExportPlatform {
        constructor(identifier?: any)
    }
    /** Exporter for Linux/BSD.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_editorexportplatformlinuxbsd.html  
     */
    class EditorExportPlatformLinuxBSD extends EditorExportPlatformPC {
        constructor(identifier?: any)
    }
    /** Exporter for macOS.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_editorexportplatformmacos.html  
     */
    class EditorExportPlatformMacOS extends EditorExportPlatform {
        constructor(identifier?: any)
    }
    /** Base class for the desktop platform exporter (Windows and Linux/BSD).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_editorexportplatformpc.html  
     */
    class EditorExportPlatformPC extends EditorExportPlatform {
        constructor(identifier?: any)
    }
    /** Exporter for the Web.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_editorexportplatformweb.html  
     */
    class EditorExportPlatformWeb extends EditorExportPlatform {
        constructor(identifier?: any)
    }
    /** Exporter for Windows.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_editorexportplatformwindows.html  
     */
    class EditorExportPlatformWindows extends EditorExportPlatformPC {
        constructor(identifier?: any)
    }
    /** A script that is executed when exporting the project.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_editorexportplugin.html  
     */
    class EditorExportPlugin extends RefCounted {
        constructor(identifier?: any)
        /** Virtual method to be overridden by the user. Called for each exported file before [method _customize_resource] and [method _customize_scene]. The arguments can be used to identify the file. [param path] is the path of the file, [param type] is the [Resource] represented by the file (e.g. [PackedScene]), and [param features] is the list of features for the export.  
         *  Calling [method skip] inside this callback will make the file not included in the export.  
         */
        /* gdvirtual */ _export_file(path: string, type: string, features: PackedStringArray | string[]): void
        
        /** Virtual method to be overridden by the user. It is called when the export starts and provides all information about the export. [param features] is the list of features for the export, [param is_debug] is `true` for debug builds, [param path] is the target path for the exported project. [param flags] is only used when running a runnable profile, e.g. when using native run on Android. */
        /* gdvirtual */ _export_begin(features: PackedStringArray | string[], is_debug: boolean, path: string, flags: int64): void
        
        /** Virtual method to be overridden by the user. Called when the export is finished. */
        /* gdvirtual */ _export_end(): void
        
        /** Return `true` if this plugin will customize resources based on the platform and features used.  
         *  When enabled, [method _get_customization_configuration_hash] and [method _customize_resource] will be called and must be implemented.  
         */
        /* gdvirtual */ _begin_customize_resources(platform: EditorExportPlatform, features: PackedStringArray | string[]): boolean
        
        /** Customize a resource. If changes are made to it, return the same or a new resource. Otherwise, return `null`. When a new resource is returned, [param resource] will be replaced by a copy of the new resource.  
         *  The [param path] argument is only used when customizing an actual file, otherwise this means that this resource is part of another one and it will be empty.  
         *  Implementing this method is required if [method _begin_customize_resources] returns `true`.  
         *      
         *  **Note:** When customizing any of the following types and returning another resource, the other resource should not be skipped using [method skip] in [method _export_file]:  
         *  - [AtlasTexture]  
         *  - [CompressedCubemap]  
         *  - [CompressedCubemapArray]  
         *  - [CompressedTexture2D]  
         *  - [CompressedTexture2DArray]  
         *  - [CompressedTexture3D]  
         */
        /* gdvirtual */ _customize_resource(resource: Resource, path: string): Resource
        
        /** Return `true` if this plugin will customize scenes based on the platform and features used.  
         *  When enabled, [method _get_customization_configuration_hash] and [method _customize_scene] will be called and must be implemented.  
         *      
         *  **Note:** [method _customize_scene] will only be called for scenes that have been modified since the last export.  
         */
        /* gdvirtual */ _begin_customize_scenes(platform: EditorExportPlatform, features: PackedStringArray | string[]): boolean
        
        /** Customize a scene. If changes are made to it, return the same or a new scene. Otherwise, return `null`. If a new scene is returned, it is up to you to dispose of the old one.  
         *  Implementing this method is required if [method _begin_customize_scenes] returns `true`.  
         */
        /* gdvirtual */ _customize_scene(scene: Node, path: string): Node
        
        /** Return a hash based on the configuration passed (for both scenes and resources). This helps keep separate caches for separate export configurations.  
         *  Implementing this method is required if [method _begin_customize_resources] returns `true`.  
         */
        /* gdvirtual */ _get_customization_configuration_hash(): int64
        
        /** This is called when the customization process for scenes ends. */
        /* gdvirtual */ _end_customize_scenes(): void
        
        /** This is called when the customization process for resources ends. */
        /* gdvirtual */ _end_customize_resources(): void
        
        /** Return a list of export options that can be configured for this export plugin.  
         *  Each element in the return value is a [Dictionary] with the following keys:  
         *  - `option`: A dictionary with the structure documented by [method Object.get_property_list], but all keys are optional.  
         *  - `default_value`: The default value for this option.  
         *  - `update_visibility`: An optional boolean value. If set to `true`, the preset will emit [signal Object.property_list_changed] when the option is changed.  
         */
        /* gdvirtual */ _get_export_options(platform: EditorExportPlatform): GArray
        
        /** Return a [Dictionary] of override values for export options, that will be used instead of user-provided values. Overridden options will be hidden from the user interface.  
         *    
         */
        /* gdvirtual */ _get_export_options_overrides(platform: EditorExportPlatform): GDictionary
        
        /** Return `true`, if the result of [method _get_export_options] has changed and the export options of preset corresponding to [param platform] should be updated. */
        /* gdvirtual */ _should_update_export_options(platform: EditorExportPlatform): boolean
        
        /** **Optional.**  
         *  Validates [param option] and returns the visibility for the specified [param platform]. The default implementation returns `true` for all options.  
         */
        /* gdvirtual */ _get_export_option_visibility(platform: EditorExportPlatform, option: string): boolean
        
        /** Check the requirements for the given [param option] and return a non-empty warning string if they are not met.  
         *      
         *  **Note:** Use [method get_option] to check the value of the export options.  
         */
        /* gdvirtual */ _get_export_option_warning(platform: EditorExportPlatform, option: string): string
        
        /** Return a [PackedStringArray] of additional features this preset, for the given [param platform], should have. */
        /* gdvirtual */ _get_export_features(platform: EditorExportPlatform, debug: boolean): PackedStringArray
        
        /** Return the name identifier of this plugin (for future identification by the exporter). The plugins are sorted by name before exporting.  
         *  Implementing this method is required.  
         */
        /* gdvirtual */ _get_name(): string
        
        /** Return `true` if the plugin supports the given [param platform]. */
        /* gdvirtual */ _supports_platform(platform: EditorExportPlatform): boolean
        
        /** Virtual method to be overridden by the user. This is called to retrieve the set of Android dependencies provided by this plugin. Each returned Android dependency should have the format of an Android remote binary dependency: `org.godot.example:my-plugin:0.0.0`  
         *  For more information see [url=https://developer.android.com/build/dependencies?agpversion=4.1#dependency-types]Android documentation on dependencies[/url].  
         *      
         *  **Note:** Only supported on Android and requires [member EditorExportPlatformAndroid.gradle_build/use_gradle_build] to be enabled.  
         */
        /* gdvirtual */ _get_android_dependencies(platform: EditorExportPlatform, debug: boolean): PackedStringArray
        
        /** Virtual method to be overridden by the user. This is called to retrieve the URLs of Maven repositories for the set of Android dependencies provided by this plugin.  
         *  For more information see [url=https://docs.gradle.org/current/userguide/dependency_management.html#sec:maven_repo]Gradle documentation on dependency management[/url].  
         *      
         *  **Note:** Google's Maven repo and the Maven Central repo are already included by default.  
         *      
         *  **Note:** Only supported on Android and requires [member EditorExportPlatformAndroid.gradle_build/use_gradle_build] to be enabled.  
         */
        /* gdvirtual */ _get_android_dependencies_maven_repos(platform: EditorExportPlatform, debug: boolean): PackedStringArray
        
        /** Virtual method to be overridden by the user. This is called to retrieve the local paths of the Android libraries archive (AAR) files provided by this plugin.  
         *      
         *  **Note:** Relative paths **must** be relative to Godot's `res://addons/` directory. For example, an AAR file located under `res://addons/hello_world_plugin/HelloWorld.release.aar` can be returned as an absolute path using `res://addons/hello_world_plugin/HelloWorld.release.aar` or a relative path using `hello_world_plugin/HelloWorld.release.aar`.  
         *      
         *  **Note:** Only supported on Android and requires [member EditorExportPlatformAndroid.gradle_build/use_gradle_build] to be enabled.  
         */
        /* gdvirtual */ _get_android_libraries(platform: EditorExportPlatform, debug: boolean): PackedStringArray
        
        /** Virtual method to be overridden by the user. This is used at export time to update the contents of the `activity` element in the generated Android manifest.  
         *      
         *  **Note:** Only supported on Android and requires [member EditorExportPlatformAndroid.gradle_build/use_gradle_build] to be enabled.  
         */
        /* gdvirtual */ _get_android_manifest_activity_element_contents(platform: EditorExportPlatform, debug: boolean): string
        
        /** Virtual method to be overridden by the user. This is used at export time to update the contents of the `application` element in the generated Android manifest.  
         *      
         *  **Note:** Only supported on Android and requires [member EditorExportPlatformAndroid.gradle_build/use_gradle_build] to be enabled.  
         */
        /* gdvirtual */ _get_android_manifest_application_element_contents(platform: EditorExportPlatform, debug: boolean): string
        
        /** Virtual method to be overridden by the user. This is used at export time to update the contents of the `manifest` element in the generated Android manifest.  
         *      
         *  **Note:** Only supported on Android and requires [member EditorExportPlatformAndroid.gradle_build/use_gradle_build] to be enabled.  
         */
        /* gdvirtual */ _get_android_manifest_element_contents(platform: EditorExportPlatform, debug: boolean): string
        
        /** Adds a shared object or a directory containing only shared objects with the given [param tags] and destination [param path].  
         *      
         *  **Note:** In case of macOS exports, those shared objects will be added to `Frameworks` directory of app bundle.  
         *  In case of a directory code-sign will error if you place non code object in directory.  
         */
        add_shared_object(path: string, tags: PackedStringArray | string[], target: string): void
        
        /** Adds a static lib from the given [param path] to the iOS project. */
        add_ios_project_static_lib(path: string): void
        
        /** Adds a custom file to be exported. [param path] is the virtual path that can be used to load the file, [param file] is the binary data of the file.  
         *  When called inside [method _export_file] and [param remap] is `true`, the current file will not be exported, but instead remapped to this custom file. [param remap] is ignored when called in other places.  
         *  [param file] will not be imported, so consider using [method _customize_resource] to remap imported resources.  
         */
        add_file(path: string, file: PackedByteArray | byte[] | ArrayBuffer, remap: boolean): void
        
        /** Adds a static library (*.a) or dynamic library (*.dylib, *.framework) to Linking Phase in iOS's Xcode project. */
        add_ios_framework(path: string): void
        
        /** Adds a dynamic library (*.dylib, *.framework) to Linking Phase in iOS's Xcode project and embeds it into resulting binary.  
         *      
         *  **Note:** For static libraries (*.a) works in same way as [method add_ios_framework].  
         *      
         *  **Note:** This method should not be used for System libraries as they are already present on the device.  
         */
        add_ios_embedded_framework(path: string): void
        
        /** Adds content for iOS Property List files. */
        add_ios_plist_content(plist_content: string): void
        
        /** Adds linker flags for the iOS export. */
        add_ios_linker_flags(flags: string): void
        
        /** Adds an iOS bundle file from the given [param path] to the exported project. */
        add_ios_bundle_file(path: string): void
        
        /** Adds a C++ code to the iOS export. The final code is created from the code appended by each active export plugin. */
        add_ios_cpp_code(code: string): void
        
        /** Adds file or directory matching [param path] to `PlugIns` directory of macOS app bundle.  
         *      
         *  **Note:** This is useful only for macOS exports.  
         */
        add_macos_plugin_file(path: string): void
        
        /** To be called inside [method _export_file]. Skips the current file, so it's not included in the export. */
        skip(): void
        
        /** Returns the current value of an export option supplied by [method _get_export_options]. */
        get_option(name: StringName): any
        
        /** Returns currently used export preset. */
        get_export_preset(): EditorExportPreset
        
        /** Returns currently used export platform. */
        get_export_platform(): EditorExportPlatform
    }
    namespace EditorExportPreset {
        enum ExportFilter {
            EXPORT_ALL_RESOURCES = 0,
            EXPORT_SELECTED_SCENES = 1,
            EXPORT_SELECTED_RESOURCES = 2,
            EXCLUDE_SELECTED_RESOURCES = 3,
            EXPORT_CUSTOMIZED = 4,
        }
        enum FileExportMode {
            MODE_FILE_NOT_CUSTOMIZED = 0,
            MODE_FILE_STRIP = 1,
            MODE_FILE_KEEP = 2,
            MODE_FILE_REMOVE = 3,
        }
        enum ScriptExportMode {
            MODE_SCRIPT_TEXT = 0,
            MODE_SCRIPT_BINARY_TOKENS = 1,
            MODE_SCRIPT_BINARY_TOKENS_COMPRESSED = 2,
        }
    }
    /** Export preset configuration.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_editorexportpreset.html  
     */
    class EditorExportPreset extends RefCounted {
        constructor(identifier?: any)
        _get_property_warning(name: StringName): string
        
        /** Returns `true` if preset has specified property. */
        has(property: StringName): boolean
        
        /** Returns array of files to export. */
        get_files_to_export(): PackedStringArray
        
        /** Returns [Dictionary] of files selected in the "Resources" tab of the export dialog. Dictionary keys are file names and values are export mode - `"strip"`, `"keep"`, or `"remove"`. See also [method get_file_export_mode]. */
        get_customized_files(): GDictionary
        
        /** Returns number of files selected in the "Resources" tab of the export dialog. */
        get_customized_files_count(): int64
        
        /** Returns `true` if specified file is exported. */
        has_export_file(path: string): boolean
        
        /** Returns file export mode for the specified file. */
        get_file_export_mode(path: string, default_: EditorExportPreset.FileExportMode = 0): EditorExportPreset.FileExportMode
        
        /** Returns export preset name. */
        get_preset_name(): string
        
        /** Returns `true` if "Runnable" toggle is enabled in the export dialog. */
        is_runnable(): boolean
        
        /** Returns `true` if "Advanced" toggle is enabled in the export dialog. */
        are_advanced_options_enabled(): boolean
        
        /** Returns `true` if dedicated server export mode is selected in the export dialog. */
        is_dedicated_server(): boolean
        
        /** Returns export file filter mode selected in the "Resources" tab of the export dialog. */
        get_export_filter(): EditorExportPreset.ExportFilter
        
        /** Returns file filters to include during export. */
        get_include_filter(): string
        
        /** Returns file filters to exclude during export. */
        get_exclude_filter(): string
        
        /** Returns string with a comma separated list of custom features. */
        get_custom_features(): string
        
        /** Returns the list of packs on which to base a patch export on. */
        get_patches(): PackedStringArray
        
        /** Returns export target path. */
        get_export_path(): string
        
        /** Returns file filters to include during PCK encryption. */
        get_encryption_in_filter(): string
        
        /** Returns file filters to exclude during PCK encryption. */
        get_encryption_ex_filter(): string
        
        /** Returns `true`, PCK encryption is enabled in the export dialog. */
        get_encrypt_pck(): boolean
        
        /** Returns `true`, PCK directory encryption is enabled in the export dialog. */
        get_encrypt_directory(): boolean
        
        /** Returns PCK encryption key. */
        get_encryption_key(): string
        
        /** Returns script export mode. */
        get_script_export_mode(): int64
        
        /** Returns export option value or value of environment variable if it is set. */
        get_or_env(name: StringName, env_var: string): any
        
        /** Returns the preset's version number, or fall back to the [member ProjectSettings.application/config/version] project setting if set to an empty string.  
         *  If [param windows_version] is `true`, formats the returned version number to be compatible with Windows executable metadata.  
         */
        get_version(name: StringName, windows_version: boolean): string
    }
    class EditorExpressionEvaluator<Map extends Record<string, Node> = Record<string, Node>> extends VBoxContainer<Map> {
        constructor(identifier?: any)
    }
    namespace EditorFeatureProfile {
        enum Feature {
            /** The 3D editor. If this feature is disabled, the 3D editor won't display but 3D nodes will still display in the Create New Node dialog. */
            FEATURE_3D = 0,
            
            /** The Script tab, which contains the script editor and class reference browser. If this feature is disabled, the Script tab won't display. */
            FEATURE_SCRIPT = 1,
            
            /** The AssetLib tab. If this feature is disabled, the AssetLib tab won't display. */
            FEATURE_ASSET_LIB = 2,
            
            /** Scene tree editing. If this feature is disabled, the Scene tree dock will still be visible but will be read-only. */
            FEATURE_SCENE_TREE = 3,
            
            /** The Node dock. If this feature is disabled, signals and groups won't be visible and modifiable from the editor. */
            FEATURE_NODE_DOCK = 4,
            
            /** The FileSystem dock. If this feature is disabled, the FileSystem dock won't be visible. */
            FEATURE_FILESYSTEM_DOCK = 5,
            
            /** The Import dock. If this feature is disabled, the Import dock won't be visible. */
            FEATURE_IMPORT_DOCK = 6,
            
            /** The History dock. If this feature is disabled, the History dock won't be visible. */
            FEATURE_HISTORY_DOCK = 7,
            
            /** The Game tab, which allows embedding the game window and selecting nodes by clicking inside of it. If this feature is disabled, the Game tab won't display. */
            FEATURE_GAME = 8,
            
            /** Represents the size of the [enum Feature] enum. */
            FEATURE_MAX = 9,
        }
    }
    /** An editor feature profile which can be used to disable specific features.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_editorfeatureprofile.html  
     */
    class EditorFeatureProfile extends RefCounted {
        constructor(identifier?: any)
        /** If [param disable] is `true`, disables the class specified by [param class_name]. When disabled, the class won't appear in the Create New Node dialog. */
        set_disable_class(class_name: StringName, disable: boolean): void
        
        /** Returns `true` if the class specified by [param class_name] is disabled. When disabled, the class won't appear in the Create New Node dialog. */
        is_class_disabled(class_name: StringName): boolean
        
        /** If [param disable] is `true`, disables editing for the class specified by [param class_name]. When disabled, the class will still appear in the Create New Node dialog but the Inspector will be read-only when selecting a node that extends the class. */
        set_disable_class_editor(class_name: StringName, disable: boolean): void
        
        /** Returns `true` if editing for the class specified by [param class_name] is disabled. When disabled, the class will still appear in the Create New Node dialog but the Inspector will be read-only when selecting a node that extends the class. */
        is_class_editor_disabled(class_name: StringName): boolean
        
        /** If [param disable] is `true`, disables editing for [param property] in the class specified by [param class_name]. When a property is disabled, it won't appear in the Inspector when selecting a node that extends the class specified by [param class_name]. */
        set_disable_class_property(class_name: StringName, property: StringName, disable: boolean): void
        
        /** Returns `true` if [param property] is disabled in the class specified by [param class_name]. When a property is disabled, it won't appear in the Inspector when selecting a node that extends the class specified by [param class_name]. */
        is_class_property_disabled(class_name: StringName, property: StringName): boolean
        
        /** If [param disable] is `true`, disables the editor feature specified in [param feature]. When a feature is disabled, it will disappear from the editor entirely. */
        set_disable_feature(feature: EditorFeatureProfile.Feature, disable: boolean): void
        
        /** Returns `true` if the [param feature] is disabled. When a feature is disabled, it will disappear from the editor entirely. */
        is_feature_disabled(feature: EditorFeatureProfile.Feature): boolean
        
        /** Returns the specified [param feature]'s human-readable name. */
        get_feature_name(feature: EditorFeatureProfile.Feature): string
        
        /** Saves the editor feature profile to a file in JSON format. It can then be imported using the feature profile manager's **Import** button or the [method load_from_file] method.  
         *      
         *  **Note:** Feature profiles created via the user interface are saved in the `feature_profiles` directory, as a file with the `.profile` extension. The editor configuration folder can be found by using [method EditorPaths.get_config_dir].  
         */
        save_to_file(path: string): GError
        
        /** Loads an editor feature profile from a file. The file must follow the JSON format obtained by using the feature profile manager's **Export** button or the [method save_to_file] method.  
         *      
         *  **Note:** Feature profiles created via the user interface are loaded from the `feature_profiles` directory, as a file with the `.profile` extension. The editor configuration folder can be found by using [method EditorPaths.get_config_dir].  
         */
        load_from_file(path: string): GError
    }
    class EditorFeatureProfileManager<Map extends Record<string, Node> = Record<string, Node>> extends AcceptDialog<Map> {
        constructor(identifier?: any)
        readonly current_feature_profile_changed: Signal0
    }
    namespace EditorFileDialog {
        enum FileMode {
            /** The [EditorFileDialog] can select only one file. Accepting the window will open the file. */
            FILE_MODE_OPEN_FILE = 0,
            
            /** The [EditorFileDialog] can select multiple files. Accepting the window will open all files. */
            FILE_MODE_OPEN_FILES = 1,
            
            /** The [EditorFileDialog] can select only one directory. Accepting the window will open the directory. */
            FILE_MODE_OPEN_DIR = 2,
            
            /** The [EditorFileDialog] can select a file or directory. Accepting the window will open it. */
            FILE_MODE_OPEN_ANY = 3,
            
            /** The [EditorFileDialog] can select only one file. Accepting the window will save the file. */
            FILE_MODE_SAVE_FILE = 4,
        }
        enum Access {
            /** The [EditorFileDialog] can only view `res://` directory contents. */
            ACCESS_RESOURCES = 0,
            
            /** The [EditorFileDialog] can only view `user://` directory contents. */
            ACCESS_USERDATA = 1,
            
            /** The [EditorFileDialog] can view the entire local file system. */
            ACCESS_FILESYSTEM = 2,
        }
        enum DisplayMode {
            /** The [EditorFileDialog] displays resources as thumbnails. */
            DISPLAY_THUMBNAILS = 0,
            
            /** The [EditorFileDialog] displays resources as a list of filenames. */
            DISPLAY_LIST = 1,
        }
    }
    /** A modified version of [FileDialog] used by the editor.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_editorfiledialog.html  
     */
    class EditorFileDialog<Map extends Record<string, Node> = Record<string, Node>> extends ConfirmationDialog<Map> {
        constructor(identifier?: any)
        _cancel_pressed(): void
        
        /** Removes all filters except for "All Files (*.*)". */
        clear_filters(): void
        
        /** Adds a comma-delimited file name [param filter] option to the [EditorFileDialog] with an optional [param description], which restricts what files can be picked.  
         *  A [param filter] should be of the form `"filename.extension"`, where filename and extension can be `*` to match any string. Filters starting with `.` (i.e. empty filenames) are not allowed.  
         *  For example, a [param filter] of `"*.tscn, *.scn"` and a [param description] of `"Scenes"` results in filter text "Scenes (*.tscn, *.scn)".  
         */
        add_filter(filter: string, description: string = ''): void
        
        /** Returns the name of the [OptionButton] or [CheckBox] with index [param option]. */
        get_option_name(option: int64): string
        
        /** Returns an array of values of the [OptionButton] with index [param option]. */
        get_option_values(option: int64): PackedStringArray
        
        /** Returns the default value index of the [OptionButton] or [CheckBox] with index [param option]. */
        get_option_default(option: int64): int64
        
        /** Sets the name of the [OptionButton] or [CheckBox] with index [param option]. */
        set_option_name(option: int64, name: string): void
        
        /** Sets the option values of the [OptionButton] with index [param option]. */
        set_option_values(option: int64, values: PackedStringArray | string[]): void
        
        /** Sets the default value index of the [OptionButton] or [CheckBox] with index [param option]. */
        set_option_default(option: int64, default_value_index: int64): void
        
        /** Adds an additional [OptionButton] to the file dialog. If [param values] is empty, a [CheckBox] is added instead.  
         *  [param default_value_index] should be an index of the value in the [param values]. If [param values] is empty it should be either `1` (checked), or `0` (unchecked).  
         */
        add_option(name: string, values: PackedStringArray | string[], default_value_index: int64): void
        
        /** Returns a [Dictionary] with the selected values of the additional [OptionButton]s and/or [CheckBox]es. [Dictionary] keys are names and values are selected value indices. */
        get_selected_options(): GDictionary
        
        /** Clear the filter for file names. */
        clear_filename_filter(): void
        
        /** Sets the value of the filter for file names. */
        set_filename_filter(filter: string): void
        
        /** Returns the value of the filter for file names. */
        get_filename_filter(): string
        
        /** Returns the [VBoxContainer] used to display the file system.  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member CanvasItem.visible] property.  
         */
        get_vbox(): VBoxContainer
        
        /** Returns the LineEdit for the selected file.  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member CanvasItem.visible] property.  
         */
        get_line_edit(): LineEdit
        _thumbnail_done(_unnamed_arg0: string, _unnamed_arg1: Texture2D, _unnamed_arg2: Texture2D, _unnamed_arg3: any): void
        _thumbnail_result(_unnamed_arg0: string, _unnamed_arg1: Texture2D, _unnamed_arg2: Texture2D, _unnamed_arg3: any): void
        
        /** Adds the given [param menu] to the side of the file dialog with the given [param title] text on top. Only one side menu is allowed. */
        add_side_menu(menu: Control, title: string = ''): void
        
        /** Shows the [EditorFileDialog] at the default size and position for file dialogs in the editor, and selects the file name if there is a current file. */
        popup_file_dialog(): void
        
        /** Notify the [EditorFileDialog] that its view of the data is no longer accurate. Updates the view contents on next view update. */
        invalidate(): void
        
        /** The location from which the user may select a file, including `res://`, `user://`, and the local file system. */
        get access(): int64
        set access(value: int64)
        
        /** The view format in which the [EditorFileDialog] displays resources to the user. */
        get display_mode(): int64
        set display_mode(value: int64)
        
        /** The dialog's open or save mode, which affects the selection behavior. See [enum FileMode]. */
        get file_mode(): int64
        set file_mode(value: int64)
        
        /** The currently occupied directory. */
        get current_dir(): string
        set current_dir(value: string)
        
        /** The currently selected file. */
        get current_file(): string
        set current_file(value: string)
        
        /** The file system path in the address bar. */
        get current_path(): string
        set current_path(value: string)
        
        /** The available file type filters. For example, this shows only `.png` and `.gd` files: `set_filters(PackedStringArray(["*.png ; PNG Images","*.gd ; GDScript Files"]))`. Multiple file types can also be specified in a single filter. `"*.png, *.jpg, *.jpeg ; Supported Images"` will show both PNG and JPEG files when selected. */
        get filters(): PackedStringArray
        set filters(value: PackedStringArray | string[])
        
        /** The number of additional [OptionButton]s and [CheckBox]es in the dialog. */
        get option_count(): any /*Options,option_*/
        set option_count(value: any /*Options,option_*/)
        
        /** If `true`, hidden files and directories will be visible in the [EditorFileDialog]. This property is synchronized with [member EditorSettings.filesystem/file_dialog/show_hidden_files]. */
        get show_hidden_files(): boolean
        set show_hidden_files(value: boolean)
        
        /** If `true`, the [EditorFileDialog] will not warn the user before overwriting files. */
        get disable_overwrite_warning(): boolean
        set disable_overwrite_warning(value: boolean)
        
        /** Emitted when a file is selected. */
        readonly file_selected: Signal1<string>
        
        /** Emitted when multiple files are selected. */
        readonly files_selected: Signal1<PackedStringArray | string[]>
        
        /** Emitted when a directory is selected. */
        readonly dir_selected: Signal1<string>
        
        /** Emitted when the filter for file names changes. */
        readonly filename_filter_changed: Signal1<string>
    }
}
