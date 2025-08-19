# Xperience Community: JSON component

[![Nuget](https://img.shields.io/nuget/v/XperienceCommunity.JsonComponent)](https://www.nuget.org/packages/XperienceCommunity.JsonComponent#versions-body-tab)
[![build](https://github.com/kentico-ericd/xperience-community-json-component/actions/workflows/build.yml/badge.svg)](https://github.com/kentico-ericd/xperience-community-json-component/actions/workflows/build.yml)

## Description

This package adds a new [UI form component](https://docs.kentico.com/developers-and-admins/customization/extend-the-administration-interface/ui-form-components) which stores multiple objects in a single field as a JSON array. New objects can be added and removed from the array directly from the administration UI.

## Library Version Matrix

| Xperience Version    | Library Version |
| -------------------- | --------------- |
| >= 29.0.0 < 30.0.0   | 1.x.x           |
| >= 30.5.0            | 2.x.x           |

## :gear: Package Installation

Add the package to your application using the .NET CLI

```powershell
dotnet add package XperienceCommunity.JsonComponent
```

## 🚀 Quick Start

1. Create a model that represents an object in the JSON array. Decorate properties with the `JsonInput` attribute to enable editing in the administration:

```cs
namespace MySite.Models;
public class MyModel {
    [JsonInput]
    public string? Name { get; set; }

    [JsonInput(Type = JsonInputType.Number)]
    public int Age { get; set; }
}
```

2. In the __Content types__ application, create a new field on your content type using the "Long text" data type
3. Select the "JSON array" form component
4. In the "Model class" property, add the fully-qualified type name (the namespace and class name) of your model from step 1. E.g. "MySite.Models.MyModel"

## 🗒 Full Instructions

View the [Usage Guide](./docs/Usage-Guide.md) for more detailed instructions.
